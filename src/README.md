# Source Code Guide (src)

This document describes how the source code is organized and how core feature flows work.

## Folder Breakdown

## app

Route-level pages using Next.js App Router.

- app/layout.tsx: root layout, fonts, toaster setup
- app/page.tsx: landing entry page
- app/admin/acting-assignments/page.tsx: dashboard
- app/admin/acting-assignments/[id]/page.tsx: assignment detail page

## components

Reusable and feature UI components.

### components/ui

Foundation components:

- modal
- data-table
- form-field
- status-badge
- stat-card
- page-header
- tab-bar

### components/layout

App shell:

- admin-layout

### components/acting

Feature-specific components:

- create-assignment-modal
- action-modals (terminate, convert, extend, edit)

## hooks

Feature orchestration and async interaction.

- use-acting-assignments.ts

Responsibilities:

- fetch assignments
- call create/update/lifecycle service operations
- trigger user toasts
- fire pre-expiry reminder notifications

## lib

Reusable domain utilities and constants.

- dayjs-format.ts: centralized date/time helpers
- constants.ts: labels, options, and display maps
- acting-assignment-utils.ts: lifecycle sync, compensation calculations, validation helpers

## models

TypeScript contracts and DTOs.

- acting-assignment.ts

Defines:

- assignment model
- status/reason/compensation unions
- create, update, terminate, extend, convert DTOs

## services

Data access/service abstraction.

- acting-assignment-service.ts

Current behavior:

- in-memory mock data store
- CRUD + lifecycle operations
- lifecycle synchronization at read/mutation points

## styles

Global tokens and foundational styles.

- globals.css

## Feature Flow

### 1) Dashboard Load

1. page calls use-acting-assignments
2. hook fetches service data
3. service synchronizes lifecycle state
4. dashboard renders stats, tabs, and table

### 2) Create Assignment

1. user submits Create modal form
2. DTO validation runs
3. service creates and logs activity
4. hook refreshes state + shows success toast

### 3) Lifecycle Actions

From detail page:

- terminate early
- extend assignment
- convert to permanent
- edit assignment

Each action:

1. submits typed DTO
2. calls service method
3. updates activity log
4. refreshes list/details via hook

### 4) Reminder Notifications

- reminder rule uses configurable days before end date
- reminders show in hook with duplicate prevention per session

## Conventions Applied

- strict typing and DTO contracts
- centralized date utility usage
- no direct service calls from pages outside hooks/components patterns
- reusable UI components and CSS modules
- feature-first organization under components/acting and admin pages

## Suggested Next Backend Step

To convert this into full-stack persistence:

- introduce REST or route handlers under app/api
- replace in-memory store with database (Prisma + PostgreSQL)
- keep models, utilities, and UI unchanged where possible
- map service layer from mock to API calls
