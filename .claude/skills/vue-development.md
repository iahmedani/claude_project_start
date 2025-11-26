# Vue 3 Development Skill

Best practices for building modern Vue 3 applications with Composition API.

## Vue 3 Fundamentals

### Composition API Basics

#### Script Setup
```vue
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

// Props with defaults
interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

// Emits with type safety
const emit = defineEmits<{
  (e: 'update', value: number): void;
  (e: 'close'): void;
}>();

// Reactive state
const localCount = ref(props.count);
const items = ref<string[]>([]);

// Computed properties
const doubleCount = computed(() => localCount.value * 2);

// Methods
const increment = () => {
  localCount.value++;
  emit('update', localCount.value);
};

// Watchers
watch(localCount, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`);
});

// Lifecycle
onMounted(() => {
  console.log('Component mounted');
});

// Expose to parent (if needed)
defineExpose({
  localCount,
  increment,
});
</script>

<template>
  <div class="counter">
    <h1>{{ title }}</h1>
    <p>Count: {{ localCount }} (Double: {{ doubleCount }})</p>
    <button @click="increment">+</button>
    <button @click="emit('close')">Close</button>
  </div>
</template>
```

### Composables (Custom Hooks)

#### useCounter
```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  const increment = () => count.value++;
  const decrement = () => count.value--;
  const reset = () => count.value = initialValue;

  const isPositive = computed(() => count.value > 0);

  return {
    count,
    increment,
    decrement,
    reset,
    isPositive,
  };
}
```

#### useFetch
```typescript
// composables/useFetch.ts
import { ref, watchEffect, type Ref } from 'vue';

interface FetchState<T> {
  data: Ref<T | null>;
  error: Ref<Error | null>;
  isLoading: Ref<boolean>;
  execute: () => Promise<void>;
}

export function useFetch<T>(url: string | Ref<string>): FetchState<T> {
  const data = ref<T | null>(null) as Ref<T | null>;
  const error = ref<Error | null>(null);
  const isLoading = ref(false);

  const execute = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const urlValue = typeof url === 'string' ? url : url.value;
      const response = await fetch(urlValue);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      data.value = await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Unknown error');
    } finally {
      isLoading.value = false;
    }
  };

  // Auto-execute when URL changes
  watchEffect(() => {
    execute();
  });

  return { data, error, isLoading, execute };
}

// Usage:
// const { data, error, isLoading } = useFetch<User[]>('/api/users');
```

#### useLocalStorage
```typescript
// composables/useLocalStorage.ts
import { ref, watch, type Ref } from 'vue';

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const storedValue = localStorage.getItem(key);
  const value = ref<T>(storedValue ? JSON.parse(storedValue) : defaultValue) as Ref<T>;

  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });

  return value;
}
```

### Pinia Store

#### Store Definition
```typescript
// stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => user.value?.name ?? 'Guest');

  // Actions
  async function login(email: string, password: string) {
    isLoading.value = true;
    try {
      const response = await authApi.login({ email, password });
      user.value = response.user;
      token.value = response.token;
      localStorage.setItem('token', response.token);
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  async function checkAuth() {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      token.value = savedToken;
      try {
        user.value = await authApi.getMe();
      } catch {
        logout();
      }
    }
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    userName,
    login,
    logout,
    checkAuth,
  };
});
```

### Vue Router

#### Route Configuration
```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/Home.vue'),
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/pages/Dashboard.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFound.vue'),
    },
  ],
});

// Navigation guards
router.beforeEach((to, from) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'dashboard' };
  }
});

export default router;
```

### Component Patterns

#### Provide/Inject
```vue
<!-- Parent component -->
<script setup lang="ts">
import { provide, ref } from 'vue';
import type { Theme } from '@/types';

const theme = ref<Theme>('light');
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};

provide('theme', { theme, toggleTheme });
</script>

<!-- Child component (any depth) -->
<script setup lang="ts">
import { inject } from 'vue';
import type { Theme } from '@/types';

const { theme, toggleTheme } = inject<{
  theme: Ref<Theme>;
  toggleTheme: () => void;
}>('theme')!;
</script>
```

#### Renderless Components
```vue
<!-- components/DataFetcher.vue -->
<script setup lang="ts" generic="T">
import { useFetch } from '@/composables/useFetch';

const props = defineProps<{
  url: string;
}>();

const { data, error, isLoading, execute } = useFetch<T>(props.url);

defineSlots<{
  default(props: {
    data: T | null;
    error: Error | null;
    isLoading: boolean;
    refetch: () => Promise<void>;
  }): any;
}>();
</script>

<template>
  <slot :data="data" :error="error" :isLoading="isLoading" :refetch="execute" />
</template>

<!-- Usage -->
<DataFetcher url="/api/users" v-slot="{ data, isLoading }">
  <div v-if="isLoading">Loading...</div>
  <UserList v-else :users="data" />
</DataFetcher>
```

### Form Handling

#### VeeValidate + Zod
```vue
<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const schema = toTypedSchema(
  z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  })
);

const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema: schema,
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  await login(values);
});
</script>

<template>
  <form @submit="onSubmit">
    <div>
      <input v-model="email" v-bind="emailAttrs" type="email" placeholder="Email" />
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>

    <div>
      <input v-model="password" v-bind="passwordAttrs" type="password" placeholder="Password" />
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Loading...' : 'Login' }}
    </button>
  </form>
</template>
```

## Testing

### Component Testing with Vitest
```typescript
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import UserCard from './UserCard.vue';

describe('UserCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders user name', () => {
    const wrapper = mount(UserCard, {
      props: {
        user: { id: 1, name: 'John Doe', email: 'john@example.com' },
      },
    });

    expect(wrapper.text()).toContain('John Doe');
  });

  it('emits delete event', async () => {
    const wrapper = mount(UserCard, {
      props: {
        user: { id: 1, name: 'John', email: 'john@test.com' },
      },
    });

    await wrapper.find('[data-testid="delete-btn"]').trigger('click');

    expect(wrapper.emitted('delete')).toBeTruthy();
    expect(wrapper.emitted('delete')![0]).toEqual([1]);
  });
});
```

### Composable Testing
```typescript
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments count', () => {
    const { count, increment } = useCounter(0);

    expect(count.value).toBe(0);
    increment();
    expect(count.value).toBe(1);
  });

  it('starts with initial value', () => {
    const { count } = useCounter(10);
    expect(count.value).toBe(10);
  });
});
```

## Performance Optimization

### Async Components
```typescript
import { defineAsyncComponent } from 'vue';

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000,
});
```

### v-memo for Lists
```vue
<template>
  <div v-for="item in items" :key="item.id" v-memo="[item.id, item.updated]">
    <ExpensiveComponent :item="item" />
  </div>
</template>
```

### Computed with Getter/Setter
```typescript
const searchQuery = computed({
  get: () => route.query.q as string ?? '',
  set: (value) => router.push({ query: { ...route.query, q: value } }),
});
```
