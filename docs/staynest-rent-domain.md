# StayNest Rent Domain

## Entity Relationship

```
Resident
   ↓
  Room
   ↓
Rent Record
```

- A **Resident** stays in a **Room**.
- A **Rent Record** tracks what a resident owes for a given period.

## Rent Status

| Status    | Meaning                         |
|-----------|---------------------------------|
| `pending` | Created, not yet paid           |
| `paid`    | Paid in full                    |
| `overdue` | Past due date, still unpaid     |

## Payment Methods

| Method   | Label      |
|----------|------------|
| `cash`   | Cash       |
| `upi`    | UPI        |
| `bank_transfer` | Bank Transfer |
| `other`  | Other      |

## V1 Rules

1. A rent record belongs to **exactly one** resident.
2. A rent record **may** reference one room (nullable — retained for flexibility even if the resident vacates).
3. A rent record has **one** status.
4. A `paid` record **must** have `paid_at` set.
5. An unpaid record (`pending` / `overdue`) **must** have `paid_at = null`.

## What Rent V1 Includes

### Module Tabs
- All
- Pending
- Paid
- Overdue

### Actions
- Create Rent Record
- Mark Paid
- View Details

### Dashboard Metrics
- Total Due
- Collected
- Overdue
- Pending Count

### Table Columns
- Resident
- Room
- Amount
- Due Date
- Status
- Action

## What Rent V1 Skips (Phase 2)

- PDF Receipts
- GST / Tax
- Invoices / Pro-forma
- WhatsApp notifications
- Razorpay / payment gateway integration
- Auto-recurring rent generation
- Late fees calculation
- Reports / analytics
- Exports (CSV, PDF)
