# Backend Platform PRD

## Mission Scope
- Customer-facing: product catalog browsing, currency-aware pricing, cart & checkout, order tracking, WhatsApp concierge escalation.
- Admin-facing: CRUD for products/SKUs, inventory adjustments, user management, broadcast notifications, activity logging, analytics snapshotting.
- Integrations: Paystack (NGN), Stripe (USD), WhatsApp webhook, Resend email, optional Twilio SMS, analytics hooks.

## Architecture Overview
- Runtime: Node.js 20 LTS with NestJS for module structure, dependency injection, and guards.
- API: REST with OpenAPI documentation (`@nestjs/swagger`); public routes versioned under `/api/v1`.
- Auth: JWT access + refresh tokens, admin login via passcode/OTP; rate-limited endpoints and role guards.
- Data: PostgreSQL 14+ via Prisma ORM.
- Cache & jobs: Redis (cart sessions, rate limiting, memoized catalog) plus BullMQ for background work (emails, webhook processing, inventory reconciliation).
- File storage: S3-compatible bucket (e.g., Wasabi) using signed upload URLs for admin media.
- Observability: Pino logging with OpenTelemetry export, Sentry error tracking, optional Prometheus metrics.
- Deployment: Docker images, CI/CD through GitHub Actions, staging on Railway/Render, production on AWS ECS Fargate or Fly.io.
- Configuration: `@nestjs/config` with Zod validation, secrets managed outside repo (1Password / cloud env vars).

## Modules
1. **AuthModule** – registration/login, admin impersonation, refresh tokens, throttling.
2. **CatalogModule** – product CRUD, category taxonomy, search indices, currency prices.
3. **InventoryModule** – stock ledger, low-stock alerts, adjustment audit trail.
4. **CartModule** – session/user carts, currency totals, promo hook points.
5. **CheckoutModule** – Paystack & Stripe orchestration, webhook handlers, payment intent lifecycles.
6. **OrderModule** – order state machine, fulfillment updates, customer notifications.
7. **NotificationModule** – email/SMS/WhatsApp broadcast pipelines, admin alerts, digest jobs.
8. **AdminModule** – dashboards, analytics queries, admin user management.
9. **ActivityModule** – immutable audit events for admin/product changes.
10. **IntegrationModule** – typed clients for third-party services with retry/backoff policies.

## Data Model Highlights
- `Product`, `Price` (currency-specific), `InventoryBatch`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`, `User`, `Role`, `Notification`, `Activity`.
- Currency enum limited to `NGN` and `USD` initially.
- Audit tables store actor, action, payload, timestamps.

## Security & Compliance
- DTO validation via Zod, sanitised inputs.
- RBAC guards for admin/support/concierge roles.
- Rate limiting per IP/user with `@nestjs/throttler`.
- Webhook signature verification (Stripe/Paystack).
- Secrets rotation policy, TLS enforcement, HSTS.
- GDPR-style data export/delete for customer accounts.

## Dev Workflow
- Backend lives in `/backend` folder (to be scaffolded) with dedicated package.json/tsconfig.
- Local stack via Docker Compose (Postgres + Redis); `.env.example` maintained.
- Scripts: `yarn lint`, `yarn test`, `yarn db:migrate`, `yarn start:dev`.
- Prisma migrations checked in; seed command to import current product catalog.
- Swagger docs at `/docs` (auth-gated in production).
- Testing: Jest unit tests per module, integration tests via Testcontainers/Postgres.

## Frontend Integration Plan
- Replace client-side providers with API fetchers; expose typed SDK generated from OpenAPI or tRPC.
- Introduce client env vars for API base URL/secrets.
- Hook SSR caching (SWR/React Query) into backend responses with proper revalidation strategy.

## Implementation Phases
1. Scaffold NestJS project, Prisma setup, Docker dev stack.
2. Build auth & user modules; seed initial admin.
3. Implement catalog & inventory endpoints; connect admin UI.
4. Wire cart + checkout flows with Paystack/Stripe sandboxes.
5. Add order lifecycle, notifications, activity logs.
6. Harden (rate limiting, logging, background jobs, comprehensive tests).
7. Deploy staging, run E2E tests, prepare production launch.

## Open Questions
- Any existing systems to integrate with (ERP, CRM)?
- Hosting & secrets tooling preference?
- Requirements for multi-tenant or B2B support?
- Data residency constraints (Nigeria vs US)?
- Timeline for automating WhatsApp concierge?
