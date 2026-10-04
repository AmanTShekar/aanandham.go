# Website ↔ PMS handoff

This website treats PMS as the source of truth for public property IDs, booking intents, Razorpay orders, payment verification and webhook events. Operational edits belong in PMS. See the PMS repository's `INTEGRATION_CONTRACT.md` and `docs/WEBSITE_INTEGRATION_AUDIT_2026-09-30.md` for the complete current contract and release blockers.

## Server configuration

Set these on the website server for each environment:

| Variable | Purpose |
| --- | --- |
| `PMS_BASE_URL` | Explicit PMS HTTPS origin. HTTP is accepted only for loopback development or a same-host sidecar. |
| `PMS_TENANT_ID` | Tenant served by this website. |
| `PMS_SECRET_API_KEY` | Tenant-scoped `sk_` key with `bookings:read` for website admin booking reads. Server-only; never use `NEXT_PUBLIC_`. |

Do not configure a PMS database URL, `PMS_INTERNAL_TOKEN`, Razorpay key secret or webhook secret on this website for booking/payment operation. Store provider secrets only in PMS. Configure Razorpay to call PMS `/api/payments/webhook` directly; the website's `/api/payments/webhook` and `/api/webhooks/razorpay` remain raw-body compatibility relays.

## Current behavior

- `/api/admin/camps` reads the PMS catalog. It does not append local seed properties. It returns 503 if PMS fails and 501 for website-side bulk editing. Manage the catalog in PMS.
- `/api/bookings` POST forwards one booking intent to PMS. On failure it returns an error; it never starts a local booking or local Razorpay order. Reuse the same idempotency key for an identical retry.
- `/api/payments/verify` forwards the checkout proof to PMS. Only PMS `Confirmed` means confirmation. If verification times out after a charge, do not submit a new payment; reconcile the order with support/PMS.
- `/api/inquiries` and `/api/contact` wait for PMS lead persistence before acknowledging the visitor. A best-effort local copy remains for the website's legacy admin inquiry view; this is not the authoritative CRM.
- `/api/analytics` awaits PMS acknowledgement and permits only funnel events. Paid conversion comes from PMS-verified bookings, not browser telemetry.
- `/api/admin/bookings` reads PMS through a server-side scoped key. Website admin booking mutations are disabled until a scoped PMS write contract is implemented.
- `/api/admin/content` serves built-in editorial defaults; edits return 501. The previous in-memory save was lost on restart and the claimed PMS sync was unauthorized. A durable, scoped CMS write contract is required.

## Staging verification

Check the deployed origins and environment variables, then exercise a real test-mode property, inquiry and payment with a disposable tenant. Test a PMS outage, duplicate booking POST with the same idempotency key, declined payment, captured payment, duplicate webhook, wrong-tenant private key and mismatched order amount. Confirm state in PMS and the provider dashboard. A local build alone does not validate this path.

The website still has statically generated catalog/marketing pages from local source data and some legacy CMS/admin routes. Their content can lag PMS. Do not advertise date-specific vacancy or guaranteed payment/CRM delivery from those pages.
