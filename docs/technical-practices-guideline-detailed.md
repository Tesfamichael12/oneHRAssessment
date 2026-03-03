# Technical Practices Guideline (Detailed Enforcement)

Last updated: March 2026.

This file is the detailed implementation reference for contributors. It mirrors and operationalizes the repository standards so new features (including Acting Assignment Management) remain consistent.

## 1) TypeScript Enforcement

- Use strict typing everywhere.
- No implicit `any` and no explicit `any`.
- Use explicit state types.
- Define interfaces/models in `src/models`.
- Use `| null` for absent values instead of optional meaningful fields.
- Prefer `interface` for object shapes.

### Required

- `const [isLoading, setIsLoading] = useState<boolean>(false);`
- `id: string | null;`

## 2) Formatting

- Semicolons are required.
- Double quotes are required.
- 4-space indentation (no tabs).
- Remove trailing spaces and unnecessary empty lines.
- Use ESLint + Prettier as source of truth.

## 3) Logging

- Allowed: `console.warn`, `console.error`.
- Disallowed: `console.log`.
- Remove temporary debug logs before commit.

## 4) Imports

Order imports by group:

1. React/framework imports.
2. Third-party imports.
3. Internal imports.

Additional rules:

- No duplicate imports.
- No unused imports.
- Use `import type` for type-only symbols.

## 5) Comments and Documentation

- Explain why, not what.
- Use JSDoc for public utility behavior and non-trivial logic.
- Remove stale or redundant comments.

## 6) Models and Data Contracts

- Maintain centralized models in `src/models`.
- Use union values for controlled states (status, reasons, compensation types).
- Keep DTO interfaces explicit and stable.

## 7) Theming

- Dark theme page background must be black (`#000000`).
- Use CSS variables from `src/styles/globals.css` for all theme colors.
- Keep secondary colors harmonious with black background.

## 8) Date and Time

- Use only centralized date helpers from `src/lib/dayjs-format.ts`.
- Do not import dayjs directly in feature files.
- Date format: `MMMM DD, YYYY`.
- Timestamp format: `MMMM DD, YYYY hh:mm A`.

## 9) File Size and Modularity

- Keep files under 500 lines.
- Split into utility modules, feature hooks, reusable sub-components, and service files.

## 10) Notifications

- Use `sonner` toasts for user-facing outcomes.
- Success, error, warning, and info must be actionable and clear.

## 11) Naming Conventions

- Variables/functions: `camelCase`.
- Components/interfaces/types: `PascalCase`.
- Constants/env vars: `UPPER_SNAKE_CASE`.
- Filenames: `kebab-case`.

## 12) Equality Checks

- Always use strict equality (`===`, `!==`).

## 13) Async/Await and Error Handling

- Prefer `async/await`.
- Wrap async paths with `try/catch`.
- Show user-friendly errors with toast notifications.

## 14) Folder Structure

- `src/app`: route pages.
- `src/components/ui`: base reusable UI.
- `src/components/[feature]`: feature components.
- `src/hooks`: shared state logic.
- `src/lib`: pure utilities.
- `src/models`: interfaces and contracts.
- `src/services`: centralized API/service layer.
- `src/styles`: global and design token styles.

## 15) API Handling

- No direct API calls inside components.
- Centralize all CRUD logic in `src/services`.
- Keep loading/error handling consistent in hooks.

## 16) Accessibility

- Semantic markup and keyboard interaction support.
- Visible focus styles.
- Proper labels and required indicators.
- `aria-*` where needed.

## 17) Security

- Never expose secrets in client code.
- Avoid logging sensitive information.
- Validate and sanitize user input paths.

## 18) Performance

- Use memoization (`useMemo`, `useCallback`) where meaningful.
- Lazy-load heavy modules when appropriate.
- Keep render paths lightweight.

## 19) Testing Expectations

Before completion:

- verify lint,
- validate critical logic paths,
- cover error and edge states,
- perform accessibility checks for forms and actions.

## 20) Git Workflow and Commit Strategy

- Use feature branches.
- Keep commits atomic and scoped.
- Use Conventional Commits format: `feat(scope): description`, `fix(scope): description`, `docs(scope): description`.

Recommended sequence for large features:

1. `feat(acting): add assignment lifecycle utilities and typed model updates`
2. `feat(acting): implement create flow with configurable expiry reminders`
3. `feat(acting): add dashboard and detail lifecycle improvements`
4. `docs(acting): add UI UX design specification`
