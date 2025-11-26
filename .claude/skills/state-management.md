# State Management Skill

> **Related**: `react-development` (React patterns), `vue-development` (Vue patterns), `api-design` (data fetching)

Modern state management patterns for React and Vue applications.

## React State Management

### Zustand (Recommended)

```typescript
// stores/useAuthStore.ts
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // State
          user: null,
          token: null,
          isLoading: false,
          error: null,

          // Actions
          login: async (email, password) => {
            set({ isLoading: true, error: null });
            try {
              const response = await authApi.login({ email, password });
              set({
                user: response.user,
                token: response.token,
                isLoading: false,
              });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : "Login failed",
                isLoading: false,
              });
              throw error;
            }
          },

          logout: () => {
            set({ user: null, token: null });
            localStorage.removeItem("token");
          },

          updateUser: (updates) => {
            set((state) => {
              if (state.user) {
                state.user = { ...state.user, ...updates };
              }
            });
          },

          clearError: () => set({ error: null }),
        })),
      ),
      {
        name: "auth-storage",
        partialize: (state) => ({ token: state.token }),
      },
    ),
    { name: "AuthStore" },
  ),
);

// Selectors (for performance)
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.token);
export const useIsAdmin = () =>
  useAuthStore((state) => state.user?.role === "admin");
```

### Zustand with Slices Pattern

```typescript
// stores/slices/cartSlice.ts
import { StateCreator } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartSlice {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const createCartSlice: StateCreator<
  CartSlice,
  [["zustand/immer", never]],
  [],
  CartSlice
> = (set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    });
  },

  removeItem: (id) => {
    set((state) => {
      state.items = state.items.filter((i) => i.id !== id);
    });
  },

  updateQuantity: (id, quantity) => {
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.max(0, quantity);
      }
    });
  },

  clearCart: () => set({ items: [] }),

  total: () => {
    return get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  },
});

// stores/index.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createCartSlice, CartSlice } from "./slices/cartSlice";
import { createUserSlice, UserSlice } from "./slices/userSlice";

type StoreState = CartSlice & UserSlice;

export const useStore = create<StoreState>()(
  immer((...args) => ({
    ...createCartSlice(...args),
    ...createUserSlice(...args),
  })),
);
```

### React Context (For simpler cases)

```typescript
// contexts/ThemeContext.tsx
import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('theme') as Theme) ?? 'system';
  });

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  const isDark = useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, isDark }),
    [theme, setTheme, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### TanStack Query (Server State)

```typescript
// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Query keys factory
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Queries
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => api.users.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => api.users.get(id),
    enabled: !!id,
  });
}

// Mutations
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => api.users.create(data),
    onSuccess: (newUser) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Or optimistically update the cache
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      api.users.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) });

      // Snapshot previous value
      const previous = queryClient.getQueryData(userKeys.detail(id));

      // Optimistically update
      queryClient.setQueryData(userKeys.detail(id), (old: User) => ({
        ...old,
        ...data,
      }));

      return { previous };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(userKeys.detail(id), context.previous);
      }
    },
    onSettled: (_, __, { id }) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.users.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
    },
  });
}
```

## Vue State Management

### Pinia (Recommended)

```typescript
// stores/cart.ts
import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const useCartStore = defineStore(
  "cart",
  () => {
    // State
    const items = ref<CartItem[]>([]);
    const isLoading = ref(false);

    // Getters
    const total = computed(() =>
      items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
    );

    const itemCount = computed(() =>
      items.value.reduce((sum, item) => sum + item.quantity, 0),
    );

    const isEmpty = computed(() => items.value.length === 0);

    // Actions
    function addItem(item: Omit<CartItem, "quantity">) {
      const existing = items.value.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        items.value.push({ ...item, quantity: 1 });
      }
    }

    function removeItem(id: string) {
      const index = items.value.findIndex((i) => i.id === id);
      if (index > -1) {
        items.value.splice(index, 1);
      }
    }

    function updateQuantity(id: string, quantity: number) {
      const item = items.value.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          removeItem(id);
        }
      }
    }

    function clearCart() {
      items.value = [];
    }

    async function checkout() {
      isLoading.value = true;
      try {
        await api.checkout(items.value);
        clearCart();
      } finally {
        isLoading.value = false;
      }
    }

    return {
      // State
      items,
      isLoading,
      // Getters
      total,
      itemCount,
      isEmpty,
      // Actions
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      checkout,
    };
  },
  {
    persist: true, // Enable persistence with pinia-plugin-persistedstate
  },
);
```

### Pinia with Options API Style

```typescript
// stores/auth.ts
import { defineStore } from "pinia";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
    userName: (state) => state.user?.name ?? "Guest",
  },

  actions: {
    async login(email: string, password: string) {
      this.isLoading = true;
      try {
        const response = await authApi.login({ email, password });
        this.user = response.user;
        this.token = response.token;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },

    async fetchUser() {
      if (!this.token) return;
      try {
        this.user = await authApi.me();
      } catch {
        this.logout();
      }
    },
  },

  persist: {
    paths: ["token"],
  },
});
```

## State Management Patterns

### Optimistic Updates

```typescript
// React with Zustand
const useOptimisticTodos = create<TodoStore>((set, get) => ({
  todos: [],

  addTodo: async (text: string) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTodo = { id: tempId, text, completed: false };

    // Optimistically add
    set((state) => ({ todos: [...state.todos, optimisticTodo] }));

    try {
      const realTodo = await api.createTodo(text);
      // Replace temp with real
      set((state) => ({
        todos: state.todos.map((t) => (t.id === tempId ? realTodo : t)),
      }));
    } catch (error) {
      // Rollback on error
      set((state) => ({
        todos: state.todos.filter((t) => t.id !== tempId),
      }));
      throw error;
    }
  },
}));
```

### Computed/Derived State

```typescript
// Zustand with derived state
const useStore = create((set, get) => ({
  items: [],
  filter: 'all',

  // Computed values as functions
  filteredItems: () => {
    const { items, filter } = get();
    switch (filter) {
      case 'completed':
        return items.filter((i) => i.completed);
      case 'active':
        return items.filter((i) => !i.completed);
      default:
        return items;
    }
  },

  completedCount: () => get().items.filter((i) => i.completed).length,
}));

// Usage with useMemo for performance
function TodoList() {
  const items = useStore((state) => state.items);
  const filter = useStore((state) => state.filter);

  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'completed':
        return items.filter((i) => i.completed);
      case 'active':
        return items.filter((i) => !i.completed);
      default:
        return items;
    }
  }, [items, filter]);

  return <ul>{filteredItems.map(/* ... */)}</ul>;
}
```

### State Machine Pattern

```typescript
// Using XState concepts with Zustand
type AuthStatus = "idle" | "authenticating" | "authenticated" | "error";

interface AuthMachine {
  status: AuthStatus;
  user: User | null;
  error: string | null;

  // Transitions
  startLogin: () => void;
  loginSuccess: (user: User) => void;
  loginError: (error: string) => void;
  logout: () => void;
}

const useAuthMachine = create<AuthMachine>((set) => ({
  status: "idle",
  user: null,
  error: null,

  startLogin: () => set({ status: "authenticating", error: null }),

  loginSuccess: (user) =>
    set({
      status: "authenticated",
      user,
      error: null,
    }),

  loginError: (error) =>
    set({
      status: "error",
      error,
      user: null,
    }),

  logout: () =>
    set({
      status: "idle",
      user: null,
      error: null,
    }),
}));
```

## Best Practices

1. **Keep stores focused** - One store per domain/feature
2. **Use selectors** - Prevent unnecessary re-renders
3. **Normalize data** - Avoid deeply nested state
4. **Separate server state** - Use React Query/SWR for server data
5. **Persist selectively** - Only persist what's needed
6. **Type everything** - Full TypeScript support
7. **Use middleware** - devtools, persist, immer for better DX
