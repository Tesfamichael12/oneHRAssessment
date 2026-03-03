# oneHR Assessment

A focused HR module built with Next.js for managing temporary acting assignments, their lifecycle, and compensation adjustments.

## Brief Project Description

This project implements an **Acting Assignment Management** feature for HR teams. It allows HR to:

- register temporary acting assignments,
- track assignment duration (start/end),
- apply temporary compensation changes,
- manage assignment lifecycle states,
- receive configurable pre-expiry reminders.

The current implementation is production-style frontend + domain logic with an in-memory service layer (mock data), designed to demonstrate clean architecture, strict typing, and maintainable UI patterns.

## Functional Coverage

### Assignment Creation

Supports all required fields:

- Employee Name / ID
- Current Position
- Acting Position
- Acting Department
- Start Date
- Expected End Date
- Reason for Acting
- Compensation Adjustment Type:
  - Fixed Salary Increment
  - Percentage Increase
  - Acting Allowance
  - Multiple Allowances

### Assignment Lifecycle

Statuses supported:

- Active
- Expired
- Terminated Early
- Converted to Permanent

Lifecycle behavior:

- Auto-activate on start date
- Auto-expire after end date
- Configurable pre-expiry reminders for HR

### Actions

- Create assignment
- Edit assignment
- Terminate assignment early
- Extend assignment
- Convert assignment to permanent promotion

## Technology Stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- CSS Modules
- dayjs (centralized date utilities)
- sonner (toast notifications)
- lucide-react (icons)
- ESLint 9

## Project Structure

High-level:

- src/app: route pages and app shell
- src/components: reusable UI + feature components
- src/hooks: stateful feature hooks
- src/lib: constants and utility logic
- src/models: TypeScript interfaces and DTOs
- src/services: service layer (mock API)
- src/styles: global styles and design tokens
- docs: guidelines and design specification

See detailed source-level documentation in src/README.md.

## Scripts

- `pnpm dev` - run local development server on port 5005
- `pnpm lint` - run ESLint
- `pnpm lint:fix` - run ESLint with autofix
- `pnpm build` - production build
- `pnpm start` - run production server

## Setup

1. Install dependencies

```bash
pnpm install
```

1. Start development server

```bash
pnpm dev
```

1. Open browser

```text
http://localhost:5005
```

## Architecture Notes

- Components stay presentational where possible.
- Business rules and calculations live in utility/service layers.
- Date logic is centralized through one dayjs utility module.
- Feature behavior is orchestrated through typed hooks.
- User-facing feedback uses toast notifications consistently.

## Current Data Layer Status

The project currently uses an in-memory mock service for fast assessment delivery.

For a full production backend, recommended next step:

- add API routes,
- add database persistence (e.g., PostgreSQL + Prisma),
- move service methods to server-backed CRUD.

## Design and Standards

- UI/UX design specification: docs/acting-assignment-ui-ux-design.md
- technical coding rules: docs/technical-practices-guideline-detailed.md

## Assessment Scope Summary

This repository is intentionally optimized for assessment quality:

- clear feature completeness,
- strong TypeScript contracts,
- modular structure,
- maintainable and accessible UI,
- lifecycle + compensation domain behavior implemented end-to-end.
