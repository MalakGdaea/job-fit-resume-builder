---
name: clean-code
description: Write and refactor code for clarity, maintainability, minimal complexity, and consistency with the existing codebase. Use when the user asks to clean up code, improve readability, reduce duplication, simplify logic, or make an implementation more maintainable without changing behavior.
---

# Clean Code Skill

## Purpose

Write code that is easy to read, understand, test, maintain, and extend. Prioritize clarity over cleverness.

---

## Core Principles

### Readability First

* Code is read more often than it is written.
* Optimize for human understanding.
* Prefer explicit code over clever shortcuts.
* Favor simplicity whenever possible.

### Meaningful Naming

Use descriptive names that reveal intent.

Good:

```ts
const activeUsers = users.filter(user => user.isActive);
```

Bad:

```ts
const a = users.filter(x => x.a);
```

Rules:

* Variables, functions, classes, and files must communicate purpose.
* Avoid abbreviations unless universally known.
* Avoid generic names such as:

    * data
    * temp
    * value
    * manager
    * helper
    * util
    * thing
    * stuff

---

## Functions

### One Responsibility

Each function should do one thing.

Good:

```ts
function validateEmail(email: string): boolean
```

Bad:

```ts
function validateEmailAndSaveUserAndSendNotification()
```

### Keep Functions Small

* Prefer functions under 20 lines.
* Extract complex logic into named helper functions.
* Use early returns to reduce nesting.

Good:

```ts
if (!user) {
  return null;
}
```

Avoid:

```ts
if (user) {
  ...
}
```

---

## Avoid Duplication

Before writing code:

* Search for existing implementations.
* Extract repeated logic.
* Create reusable abstractions only after duplication appears.

Do not create abstractions prematurely.

---

## Comments

Prefer self-documenting code.

Avoid:

```ts
// Increment i
i++;
```

Use comments only when explaining:

* Why something exists
* Business rules
* Non-obvious decisions
* Workarounds

Never use comments to explain obvious code.

---

## Error Handling

* Fail fast.
* Validate inputs early.
* Provide meaningful error messages.
* Never swallow exceptions silently.

Good:

```ts
throw new Error("User email is required");
```

Bad:

```ts
catch (error) {}
```

---

## Conditionals

Prefer positive conditions.

Good:

```ts
if (isAuthenticated)
```

Less desirable:

```ts
if (!isNotAuthenticated)
```

Extract complex conditions into named functions.

Good:

```ts
if (canUserEditPost(user, post))
```

---

## Classes and Components

### Single Responsibility

Each class, hook, service, or component should have one reason to change.

Avoid large files that manage:

* Data fetching
* Business logic
* UI rendering
* State management

all together.

---

## React & Next.js Guidelines

### Components

* Keep components focused.
* Extract reusable UI pieces.
* Avoid components longer than ~200 lines.

### Hooks

Move business logic into custom hooks when appropriate.

Good:

```ts
const { users, isLoading } = useUsers();
```

### Server vs Client

* Prefer Server Components when possible.
* Use Client Components only when interactivity is required.
* Keep server-side logic on the server.

---

## TypeScript

### Avoid Any

Never use `any` unless absolutely unavoidable.

Prefer:

```ts
unknown
```

or proper interfaces.

### Strong Types

Create clear interfaces and types.

Good:

```ts
interface User {
  id: string;
  email: string;
}
```

---

## File Organization

Organize by feature, not by technical type.

Prefer:

```text
features/
  auth/
    components/
    hooks/
    services/
```

Over:

```text
components/
hooks/
services/
```

for large applications.

---

## Testing Mindset

Code should be easy to test.

Prefer:

* Pure functions
* Dependency injection
* Small units of behavior

Avoid tightly coupled code.

---

## Refactoring Rules

When modifying existing code:

1. Leave the code cleaner than you found it.
2. Remove dead code.
3. Remove unused imports.
4. Improve names when unclear.
5. Reduce complexity when possible.
6. Preserve behavior.

---

## Code Review Checklist

Before submitting code:

* Are names clear?
* Does each function have one responsibility?
* Is duplication minimized?
* Is nesting shallow?
* Are errors handled properly?
* Is TypeScript strongly typed?
* Is the solution simpler than alternatives?
* Can another developer understand this in under 5 minutes?

---

## Agent Behavior

Before generating code:

1. Understand the requirement completely.
2. Prefer simple solutions.
3. Prefer maintainability over cleverness.
4. Avoid unnecessary abstractions.
5. Avoid premature optimization.
6. Follow existing project conventions.
7. Produce production-quality code.
8. Refactor when complexity becomes unnecessary.
9. Keep files cohesive and focused.
10. Always choose the most readable implementation that satisfies the requirement.
