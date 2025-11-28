# GraphQL API Skill

> **Related**: `api-design` (REST alternative), `database` (data layer), `react-development` (Apollo Client)

Best practices for designing and implementing GraphQL APIs.

## Schema Design

### Type Definitions

```graphql
# schema.graphql

# Scalars
scalar DateTime
scalar JSON

# Enums
enum UserRole {
  ADMIN
  USER
  GUEST
}

enum SortOrder {
  ASC
  DESC
}

# Input types
input CreateUserInput {
  email: String!
  name: String!
  role: UserRole = USER
}

input UpdateUserInput {
  email: String
  name: String
  role: UserRole
}

input UserFilter {
  role: UserRole
  search: String
  createdAfter: DateTime
}

input PaginationInput {
  page: Int = 1
  limit: Int = 20
}

input UserSortInput {
  field: UserSortField!
  order: SortOrder = ASC
}

enum UserSortField {
  NAME
  EMAIL
  CREATED_AT
}

# Types
type User {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  posts: [Post!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  published: Boolean!
  createdAt: DateTime!
}

# Connection types (Relay-style pagination)
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# Query type
type Query {
  # Single resources
  user(id: ID!): User
  me: User

  # Collections with pagination
  users(
    filter: UserFilter
    sort: UserSortInput
    pagination: PaginationInput
  ): UserConnection!

  # Search
  searchUsers(query: String!, limit: Int = 10): [User!]!
}

# Mutation type
type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
  deleteUser(id: ID!): DeleteUserPayload!

  # Batch operations
  deleteUsers(ids: [ID!]!): DeleteUsersPayload!
}

# Payload types (for mutations)
type CreateUserPayload {
  user: User
  errors: [UserError!]!
}

type UpdateUserPayload {
  user: User
  errors: [UserError!]!
}

type DeleteUserPayload {
  success: Boolean!
  errors: [UserError!]!
}

type DeleteUsersPayload {
  deletedCount: Int!
  errors: [UserError!]!
}

type UserError {
  field: String
  message: String!
  code: String!
}

# Subscription type
type Subscription {
  userCreated: User!
  userUpdated(id: ID): User!
}
```

## Server Implementation

### Apollo Server (Node.js)

```typescript
// src/graphql/server.ts
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import { shield, rule, allow } from "graphql-shield";

// Context type
interface Context {
  user: User | null;
  dataSources: DataSources;
}

// Resolvers
const resolvers = {
  Query: {
    me: (_: unknown, __: unknown, { user }: Context) => user,

    user: async (
      _: unknown,
      { id }: { id: string },
      { dataSources }: Context,
    ) => {
      return dataSources.users.findById(id);
    },

    users: async (
      _: unknown,
      { filter, sort, pagination }: UsersArgs,
      { dataSources }: Context,
    ) => {
      return dataSources.users.findMany({ filter, sort, pagination });
    },
  },

  Mutation: {
    createUser: async (
      _: unknown,
      { input }: { input: CreateUserInput },
      { dataSources }: Context,
    ) => {
      try {
        const user = await dataSources.users.create(input);
        return { user, errors: [] };
      } catch (error) {
        return {
          user: null,
          errors: [{ message: error.message, code: "CREATE_FAILED" }],
        };
      }
    },

    updateUser: async (
      _: unknown,
      { id, input }: { id: string; input: UpdateUserInput },
      { dataSources }: Context,
    ) => {
      try {
        const user = await dataSources.users.update(id, input);
        return { user, errors: [] };
      } catch (error) {
        return {
          user: null,
          errors: [{ message: error.message, code: "UPDATE_FAILED" }],
        };
      }
    },
  },

  User: {
    posts: async (parent: User, _: unknown, { dataSources }: Context) => {
      return dataSources.posts.findByAuthor(parent.id);
    },
  },

  DateTime: DateTimeScalar,
};

// Authorization with graphql-shield
const isAuthenticated = rule()((_, __, { user }) => !!user);
const isAdmin = rule()((_, __, { user }) => user?.role === "ADMIN");

const permissions = shield({
  Query: {
    me: isAuthenticated,
    users: isAuthenticated,
  },
  Mutation: {
    createUser: isAdmin,
    deleteUser: isAdmin,
  },
});

// Create schema with middleware
const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions,
);

// Apollo Server setup
const server = new ApolloServer<Context>({
  schema,
  plugins: [
    // Logging plugin
    {
      async requestDidStart() {
        return {
          async didEncounterErrors({ errors }) {
            errors.forEach((error) => console.error(error));
          },
        };
      },
    },
  ],
});

await server.start();

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req }) => ({
      user: await getUserFromToken(req.headers.authorization),
      dataSources: {
        users: new UsersDataSource(),
        posts: new PostsDataSource(),
      },
    }),
  }),
);
```

### DataLoader for N+1 Prevention

```typescript
// src/graphql/dataloaders.ts
import DataLoader from "dataloader";
import { prisma } from "../lib/prisma";

export function createLoaders() {
  return {
    userLoader: new DataLoader<string, User>(async (ids) => {
      const users = await prisma.user.findMany({
        where: { id: { in: [...ids] } },
      });
      const userMap = new Map(users.map((u) => [u.id, u]));
      return ids.map((id) => userMap.get(id) ?? null);
    }),

    postsByAuthorLoader: new DataLoader<string, Post[]>(async (authorIds) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: [...authorIds] } },
      });
      const postMap = new Map<string, Post[]>();
      posts.forEach((post) => {
        const existing = postMap.get(post.authorId) ?? [];
        postMap.set(post.authorId, [...existing, post]);
      });
      return authorIds.map((id) => postMap.get(id) ?? []);
    }),
  };
}

// Usage in resolver
const resolvers = {
  User: {
    posts: (parent: User, _: unknown, { loaders }: Context) => {
      return loaders.postsByAuthorLoader.load(parent.id);
    },
  },
};
```

## Client Implementation

### Apollo Client (React)

```typescript
// src/lib/apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          users: {
            keyArgs: ["filter", "sort"],
            merge(existing, incoming, { args }) {
              if (!args?.pagination?.page || args.pagination.page === 1) {
                return incoming;
              }
              return {
                ...incoming,
                edges: [...(existing?.edges ?? []), ...incoming.edges],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
```

### Generated Hooks (GraphQL Code Generator)

```typescript
// src/graphql/users.graphql
query GetUsers($filter: UserFilter, $sort: UserSortInput, $pagination: PaginationInput) {
  users(filter: $filter, sort: $sort, pagination: $pagination) {
    edges {
      node {
        id
        email
        name
        role
        createdAt
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}

mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    user {
      id
      email
      name
    }
    errors {
      field
      message
      code
    }
  }
}

// Generated hook usage
import { useGetUsersQuery, useCreateUserMutation } from '@/generated/graphql';

function UsersList() {
  const { data, loading, fetchMore } = useGetUsersQuery({
    variables: {
      pagination: { page: 1, limit: 20 },
    },
  });

  const [createUser, { loading: creating }] = useCreateUserMutation({
    update(cache, { data }) {
      // Update cache after mutation
      cache.modify({
        fields: {
          users(existing) {
            const newUserRef = cache.writeFragment({
              data: data?.createUser.user,
              fragment: gql`
                fragment NewUser on User {
                  id
                  email
                  name
                }
              `,
            });
            return {
              ...existing,
              edges: [{ node: newUserRef }, ...existing.edges],
              totalCount: existing.totalCount + 1,
            };
          },
        },
      });
    },
  });

  const loadMore = () => {
    if (data?.users.pageInfo.hasNextPage) {
      fetchMore({
        variables: {
          pagination: {
            page: Math.ceil(data.users.edges.length / 20) + 1,
            limit: 20,
          },
        },
      });
    }
  };

  return (
    <div>
      {data?.users.edges.map(({ node }) => (
        <UserCard key={node.id} user={node} />
      ))}
      {data?.users.pageInfo.hasNextPage && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}
```

## Testing

### Resolver Tests

```typescript
import { createTestServer } from "./test-utils";

describe("User Resolvers", () => {
  it("creates a user", async () => {
    const server = createTestServer({ user: adminUser });

    const result = await server.executeOperation({
      query: `
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            user { id email name }
            errors { message }
          }
        }
      `,
      variables: {
        input: { email: "test@example.com", name: "Test User" },
      },
    });

    expect(result.body.singleResult.errors).toBeUndefined();
    expect(result.body.singleResult.data?.createUser.user).toMatchObject({
      email: "test@example.com",
      name: "Test User",
    });
  });
});
```

## Best Practices

### Error Handling

```typescript
// Custom error classes
class GraphQLError extends Error {
  constructor(
    message: string,
    public code: string,
    public extensions?: Record<string, unknown>,
  ) {
    super(message);
  }
}

class NotFoundError extends GraphQLError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, "NOT_FOUND", { resource, id });
  }
}

class ValidationError extends GraphQLError {
  constructor(errors: Array<{ field: string; message: string }>) {
    super("Validation failed", "VALIDATION_ERROR", { errors });
  }
}
```

### Rate Limiting

```typescript
import { createRateLimitDirective } from 'graphql-rate-limit-directive';

const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } =
  createRateLimitDirective({
    keyGenerator: (_, __, ___, { user }) => user?.id ?? 'anonymous',
  });

// In schema
type Query {
  users: [User!]! @rateLimit(limit: 100, duration: 60)
}
```
