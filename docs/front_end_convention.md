# Frontend Convention

## Tech Stack

| Technology | Description          |
| ---------- | -------------------- |
| Framework  | Next.js (App Router) |
| Language   | TypeScript           |
| UI Library | React                |
| Styling    | TailwindCSS          |
| Lint       | ESLint               |
| Formatter  | Prettier             |

---

# 1. Project Structure

```

src/
│
├── app/ # Next.js App Router
│ ├── layout.tsx
│ ├── page.tsx
│ ├── loading.tsx
│ └── error.tsx
│
├── components/ # Shared components
│ ├── ui/ # Atomic UI components
│ └── common/ # Business reusable components
│
├── features/ # Feature modules
│ ├── auth/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ └── types.ts
│
├── hooks/ # Global reusable hooks
├── services/ # API calls
├── utils/ # Helper functions
├── lib/ # Libraries and helpers
├── constants/ # Constants
├── types/ # Global types
├── styles/ # Global styles
│
└── middleware.ts

```

---

# 2. Naming Convention

## Component

Use **PascalCase**
EX: UserCard.tsx, LoginForm.tsx

## Hooks

Use prefix `use`
EX: useAuth.ts, useDebounce.ts

## Utilities

Use **camelCase**
EX: formatDate.ts, parseToken.ts

## Constants

Use **UPPER_SNAKE_CASE**
EX: API_URL, MAX_UPLOAD_SIZE

---

# 3.Component Structure

## Standard component structure:

```
type Props = {
  title: string
}

export default function Card({ title }: Props) {
  return (
    <div className="p-4 border rounded-lg">
      {title}
    </div>
  )
}
```

Order inside file:

### 1. Imports

### 2. Types / Interfaces

### 3. Component

### 4. Hooks

### 5. JSX

---

# 4. TypeScript Guidelines

## Always define types

### Bad:

```
function UserCard(props: any) {}
```

### Good:

```
type Props = {
  name: string
  age: number
}

function UserCard({ name, age }: Props) {}
```

## Prefer type over interface

```
type User = {
  id: string
  name: string
}
```

## Avoid any

### Prefer:

- unknown
- generics
- specific types

---

# 5. TailwindCSS Conventions

## Utility-first styling

Example:

```
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
```

## Conditional classes

Use clsx

```
import clsx from "clsx"

<div className={clsx(
  "p-4",
  isActive && "bg-blue-500"
)} />
```

## Avoid inline styles

### Bad:

```
style={{ marginTop: 10 }}
```

### Good:

```
mt-2
```

# 6. Folder Structure for Components

Example:

```

components/
ui/
button/
Button.tsx
Button.types.ts
index.ts

```

---

# 7. Lint and Format

## Run before commit:

```
npm run lint
npm run format
```

---

# 8. Code Review Checklist

## Before creating PR:

- Code typed with TypeScript
- No `any`
- Components reusable
- No console.log
- Tailwind consistent
- Naming correct
- No unused imports

---
