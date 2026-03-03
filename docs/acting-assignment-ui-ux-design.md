# Acting Assignment Management UI/UX Design Specification

Version: 1.0
Date: March 2026.

## 1. Design Intent

Create a modern, elegant, and simple HR workflow for temporary acting assignments.

### Principles

- Clarity first: key dates, status, and compensation impact are visible immediately.
- Low-friction data entry: progressive form and contextual inputs.
- Trustworthy operations: lifecycle actions (extend, terminate, convert) are explicit and safe.
- Accessible by default: semantic structure, keyboard support, clear focus states.

## 2. Visual System (No Purple Palette)

### Core Palette

- Primary: Teal `#0F766E`
- Primary light: `#CCFBF1`
- Primary dark: `#0D5B55`
- Accent: Orange `#F97316`
- Success: `#16A34A`
- Warning: `#EAB308`
- Error: `#DC2626`
- Info: `#0EA5E9`
- Text dark: `#111827`
- Neutral body text: `#6B7280`
- Border: `#E5E7EB`
- Page background: `#F3F4F6`
- Card background: `#FFFFFF`

No purple tones are allowed in this module.

### Typography

- Heading: Space Grotesk.
- Body: Inter.
- Numeric emphasis: Outfit.

### Spacing and Radius

- Grid spacing base: 8px scale.
- Major card spacing: 24px to 32px.
- Radius: 12px and 16px for modern softness.

## 3. Information Architecture

## 3.1 Dashboard

Primary goals:

- show assignment health at a glance,
- enable quick filtering,
- allow rapid creation.

Sections:

1. Page header and primary action.
2. Stats cards:
   - Active Assignments,
   - Expiring Soon,
   - Total This Year,
   - Converted to Permanent.
3. Data table with tabs:
   - Active,
   - Expiring Soon,
   - All,
   - Archive.
4. Search by employee name/ID/acting role.

## 3.2 Assignment Detail

Primary goals:

- provide full context of one assignment,
- allow lifecycle decisions.

Sections:

1. Summary card with employee, positions, status, reason, and progress.
2. Action row:
   - Extend,
   - Terminate Early,
   - Convert to Permanent.
3. Tabbed content:
   - Compensation,
   - Timeline,
   - Activity Log.

## 3.3 Create Assignment Modal

Primary goals:

- complete registration in one guided form,
- minimize errors through dynamic fields.

Required fields:

- Employee Name / ID,
- Current Position,
- Acting Position,
- Acting Department,
- Start Date,
- Expected End Date,
- Reason,
- Compensation Type,
- Reminder days before expiry,
- Base salary.

Dynamic compensation section:

- Fixed increment input.
- Percentage input.
- Single allowance input.
- Multiple allowance rows with add/remove.

Live preview:

- Monthly addition,
- Updated monthly total.

## 4. Interaction Design

### 4.1 Assignment Lifecycle

Statuses:

- Active,
- Expired,
- Terminated Early,
- Converted to Permanent.

Behavior:

- Assignment auto-activates on start date.
- Assignment auto-expires after end date.
- Reminder warning shown before expiry using configurable day window.

### 4.2 Feedback Patterns

- Success toast for create/terminate/extend/convert.
- Error toast with user-friendly message on failed operations.
- Warning toast for upcoming expirations.

### 4.3 Safety and Confirmation

- Termination and conversion actions always require modal confirmation.
- Active-only guard for lifecycle actions.

## 5. Accessibility and Usability

- Keyboard focus visible on all controls.
- Compensation type selector implemented as buttons with `aria-pressed`.
- Form labels and required indicators are explicit.
- Contrast designed for readability in both light and dark themes.

## 6. Responsive Behavior

- Desktop: dense analytics and full-width table.
- Tablet: stat cards collapse from 4 to 2 columns.
- Mobile: single-column cards, stacked table controls, and simplified action layout.

## 7. Component Inventory

- `PageHeader`
- `StatCard`
- `TabBar`
- `DataTable`
- `StatusBadge`
- `Modal`
- `InputField`, `SelectField`, `TextareaField`
- `CreateActingAssignmentModal`
- lifecycle modals (`Terminate`, `Convert`, `Extend`)

## 8. Motion and Micro-interactions

- Subtle fade and slide-in animations (`150ms` to `300ms`).
- Hover elevation on primary controls.
- Progress bars and badges use restrained transitions.

## 9. Validation Rules (UX Layer)

- End date must be on or after start date.
- Reminder days must be between 1 and 60.
- Salary and compensation values must be positive.
- Multiple allowances require valid name and amount.

## 10. Suggested Git Delivery Plan

Feature branch:

- `feature/acting-assignment-management-ui`

Atomic commits:

1. `feat(acting): add lifecycle and compensation utility module`
2. `feat(acting): implement configurable reminder and automated status sync`
3. `feat(acting): improve dashboard and detail interactions`
4. `docs(acting): add detailed UI UX design specification`
