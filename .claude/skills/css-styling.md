# CSS & Styling Skill

Modern CSS techniques, Tailwind CSS, and responsive design best practices.

## Modern CSS

### CSS Variables (Custom Properties)
```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-secondary: #64748b;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}

/* Dark mode */
[data-theme="dark"] {
  --color-bg: #0f172a;
  --color-text: #f8fafc;
  --color-border: #334155;
}
```

### Container Queries
```css
/* Container setup */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Responsive card based on container */
.card {
  display: grid;
  gap: var(--space-4);
}

@container card (min-width: 400px) {
  .card {
    grid-template-columns: 200px 1fr;
  }
}

@container card (min-width: 600px) {
  .card {
    grid-template-columns: 250px 1fr auto;
  }
}
```

### CSS Grid Layouts
```css
/* Auto-fit responsive grid */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
}

/* Named grid areas */
.dashboard {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.dashboard-header { grid-area: header; }
.dashboard-sidebar { grid-area: sidebar; }
.dashboard-main { grid-area: main; }
.dashboard-aside { grid-area: aside; }
.dashboard-footer { grid-area: footer; }

/* Responsive grid */
@media (max-width: 1024px) {
  .dashboard {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

### Flexbox Patterns
```css
/* Center everything */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Space between with wrap */
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
}

/* Stack with gap */
.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Cluster (inline items with wrap) */
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
}
```

## Tailwind CSS

### Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### Component Examples
```tsx
// Button variants
const buttonVariants = {
  base: 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  variants: {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  },
  sizes: {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  },
};

// Card component
<div className="
  bg-white dark:bg-gray-800
  rounded-xl shadow-md
  overflow-hidden
  border border-gray-200 dark:border-gray-700
  transition-shadow hover:shadow-lg
">
  <div className="p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Card Title
    </h3>
    <p className="mt-2 text-gray-600 dark:text-gray-300">
      Card description goes here.
    </p>
  </div>
</div>

// Input with label and error
<div className="space-y-1">
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Email
  </label>
  <input
    type="email"
    className="
      block w-full rounded-lg border-gray-300
      shadow-sm
      focus:border-primary-500 focus:ring-primary-500
      dark:bg-gray-700 dark:border-gray-600 dark:text-white
      disabled:bg-gray-100 disabled:cursor-not-allowed
    "
  />
  <p className="text-sm text-red-600">Error message</p>
</div>
```

### Responsive Patterns
```tsx
// Responsive navigation
<nav className="
  flex flex-col md:flex-row
  items-start md:items-center
  gap-4 md:gap-8
">
  {/* Mobile menu button - hidden on desktop */}
  <button className="md:hidden">Menu</button>

  {/* Nav links */}
  <div className="
    hidden md:flex
    flex-col md:flex-row
    gap-2 md:gap-6
  ">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>
</nav>

// Responsive grid
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4 md:gap-6
">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

## Animations & Transitions

### CSS Transitions
```css
/* Smooth hover transitions */
.btn {
  transition:
    background-color 200ms ease,
    transform 150ms ease,
    box-shadow 200ms ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
}

/* Page transitions */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms ease-out;
}

.page-exit {
  opacity: 1;
}

.page-exit-active {
  opacity: 0;
  transition: opacity 200ms ease-in;
}
```

### CSS Animations
```css
/* Loading spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Pulse animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background-color: var(--color-border);
}

/* Slide in */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out forwards;
}
```

## Accessibility

### Focus States
```css
/* Custom focus ring */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Color Contrast
```css
/* Ensure sufficient contrast */
.text-muted {
  /* 4.5:1 contrast ratio minimum */
  color: #6b7280; /* gray-500 on white */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-border: #000;
    --color-text: #000;
  }
}
```

## Best Practices

### BEM Naming
```css
/* Block */
.card {}

/* Element */
.card__header {}
.card__body {}
.card__footer {}

/* Modifier */
.card--featured {}
.card--compact {}
.card__header--sticky {}
```

### Utility-First with Components
```css
/* Base utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

/* Component layer */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center;
    @apply px-4 py-2 rounded-lg font-medium;
    @apply transition-colors duration-200;
  }

  .btn-primary {
    @apply bg-primary-600 text-white;
    @apply hover:bg-primary-700;
  }
}
```
