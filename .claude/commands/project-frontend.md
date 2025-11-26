---
name: project-frontend
description: "Frontend development workflow. Component creation, styling, testing, and build optimization."
tools: Read, Write, Edit, Bash(npm:*), Bash(npx:*), Bash(yarn:*), Bash(pnpm:*), Bash(tsc:*), Bash(eslint:*), Bash(prettier:*)
---

# Frontend Development Command

Manage frontend development tasks including component creation, styling, and testing.

**Action:** $ARGUMENTS

## Available Actions

| Action | Description |
|--------|-------------|
| `component <name>` | Create a new component |
| `page <name>` | Create a new page/route |
| `hook <name>` | Create a custom hook |
| `store <name>` | Create a state store |
| `test` | Run frontend tests |
| `build` | Build for production |
| `analyze` | Analyze bundle size |
| `lint` | Run linting and formatting |
| `storybook` | Start Storybook |

## Action: `component` - Create Component

### React Component Template
Create file: `src/components/<Name>/<Name>.tsx`

```typescript
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './<Name>.module.css';

export interface <Name>Props extends ComponentPropsWithoutRef<'div'> {
  /** Description of the prop */
  variant?: 'default' | 'primary' | 'secondary';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

export const <Name> = forwardRef<<Name>Props, HTMLDivElement>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.root,
          styles[variant],
          styles[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

<Name>.displayName = '<Name>';

export default <Name>;
```

### Component CSS Module
Create file: `src/components/<Name>/<Name>.module.css`

```css
.root {
  /* Base styles */
}

/* Variants */
.default {
  @apply bg-white border border-gray-200;
}

.primary {
  @apply bg-primary-600 text-white;
}

.secondary {
  @apply bg-gray-100 text-gray-900;
}

/* Sizes */
.sm {
  @apply p-2 text-sm;
}

.md {
  @apply p-4 text-base;
}

.lg {
  @apply p-6 text-lg;
}
```

### Component Test
Create file: `src/components/<Name>/<Name>.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { <Name> } from './<Name>';

describe('<Name>', () => {
  it('renders children', () => {
    render(<<Name>>Test content</<Name>>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    const { container } = render(<<Name> variant="primary" />);
    expect(container.firstChild).toHaveClass('primary');
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<<Name> ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
```

### Component Story
Create file: `src/components/<Name>/<Name>.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { <Name> } from './<Name>';

const meta: Meta<typeof <Name>> = {
  title: 'Components/<Name>',
  component: <Name>,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof <Name>>;

export const Default: Story = {
  args: {
    children: 'Default <Name>',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary <Name>',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <<Name> variant="default">Default</<Name>>
      <<Name> variant="primary">Primary</<Name>>
      <<Name> variant="secondary">Secondary</<Name>>
    </div>
  ),
};
```

### Index Export
Create file: `src/components/<Name>/index.ts`

```typescript
export { <Name>, type <Name>Props } from './<Name>';
export { default } from './<Name>';
```

### Vue Component Template
Create file: `src/components/<Name>.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue';

export interface Props {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const classes = computed(() => [
  'component',
  `variant-${props.variant}`,
  `size-${props.size}`,
]);
</script>

<template>
  <div :class="classes" @click="emit('click')">
    <slot />
  </div>
</template>

<style scoped>
.component {
  /* Base styles */
}

.variant-default {
  @apply bg-white border border-gray-200;
}

.variant-primary {
  @apply bg-primary-600 text-white;
}

.size-sm {
  @apply p-2 text-sm;
}

.size-md {
  @apply p-4 text-base;
}
</style>
```

## Action: `page` - Create Page/Route

### Next.js App Router Page
Create file: `src/app/<route>/page.tsx`

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '<Page Title>',
  description: '<Page description>',
};

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function <Page>Page({ params, searchParams }: PageProps) {
  // Fetch data (server component)
  const data = await fetchData(params.id);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6"><Page Title></h1>
      {/* Page content */}
    </main>
  );
}
```

### Loading State
Create file: `src/app/<route>/loading.tsx`

```typescript
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}
```

### Error Boundary
Create file: `src/app/<route>/error.tsx`

```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
      >
        Try again
      </button>
    </div>
  );
}
```

## Action: `hook` - Create Custom Hook

Create file: `src/hooks/use<Name>.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';

interface Use<Name>Options {
  initialValue?: string;
  onError?: (error: Error) => void;
}

interface Use<Name>Return {
  value: string;
  setValue: (value: string) => void;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

export function use<Name>(options: Use<Name>Options = {}): Use<Name>Return {
  const { initialValue = '', onError } = options;

  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return {
    value,
    setValue,
    isLoading,
    error,
    reset,
  };
}
```

## Action: `store` - Create State Store

Create file: `src/stores/use<Name>Store.ts`

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface <Name>State {
  items: Item[];
  isLoading: boolean;
  error: string | null;
}

interface <Name>Actions {
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  fetchItems: () => Promise<void>;
  reset: () => void;
}

type <Name>Store = <Name>State & <Name>Actions;

const initialState: <Name>State = {
  items: [],
  isLoading: false,
  error: null,
};

export const use<Name>Store = create<<Name>Store>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        addItem: (item) => {
          set((state) => {
            state.items.push(item);
          });
        },

        removeItem: (id) => {
          set((state) => {
            state.items = state.items.filter((i) => i.id !== id);
          });
        },

        updateItem: (id, updates) => {
          set((state) => {
            const item = state.items.find((i) => i.id === id);
            if (item) {
              Object.assign(item, updates);
            }
          });
        },

        fetchItems: async () => {
          set({ isLoading: true, error: null });
          try {
            const items = await api.getItems();
            set({ items, isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch',
              isLoading: false,
            });
          }
        },

        reset: () => set(initialState),
      })),
      { name: '<name>-storage' }
    ),
    { name: '<Name>Store' }
  )
);
```

## Action: `test` - Run Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific tests
npm run test -- --grep="<Name>"
```

## Action: `build` - Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Action: `analyze` - Bundle Analysis

```bash
# Next.js
ANALYZE=true npm run build

# Vite
npx vite-bundle-visualizer

# Webpack
npm run build -- --analyze
```

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║  🎨 FRONTEND COMMAND EXECUTED                                ║
╠══════════════════════════════════════════════════════════════╣
║  Action: component Button                                    ║
╠══════════════════════════════════════════════════════════════╣
║  FILES CREATED                                               ║
║  ✓ src/components/Button/Button.tsx                          ║
║  ✓ src/components/Button/Button.module.css                   ║
║  ✓ src/components/Button/Button.test.tsx                     ║
║  ✓ src/components/Button/Button.stories.tsx                  ║
║  ✓ src/components/Button/index.ts                            ║
╠══════════════════════════════════════════════════════════════╣
║  NEXT STEPS                                                  ║
║  • Import: import { Button } from '@/components/Button'      ║
║  • Test: npm run test -- Button                              ║
║  • Storybook: npm run storybook                              ║
╚══════════════════════════════════════════════════════════════╝
```
