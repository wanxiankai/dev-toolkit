# SaaS Starter Template

A private full-stack SaaS starter template based on Next.js 16, React 19, Drizzle, PostgreSQL, Better Auth, Stripe/Creem, Cloudflare R2, and AI integrations.

This repository is intended to be used as a reusable baseline for future products. Instead of starting each new idea from scratch, clone this template, adjust branding, connect the required services, and start building product-specific features.

See also:

- `TEMPLATE_SETUP.md` for the recommended initialization flow
- `NEW_PROJECT_CHECKLIST.md` for the per-product launch checklist
- `CREEM_LAUNCH_CHECKLIST.md` for Creem payment launch validation

Identity commands:

- `pnpm template:show`
- `pnpm template:init --product-name "My Product" --package-name my-product --site-url https://example.com`
- `pnpm template:init --product-name "My Product" --package-name my-product`
- `pnpm template:update --product-name "New Name"`
- `pnpm template:update --site-url https://new-domain.com`

## Included capabilities

- Next.js 16 + React 19 + App Router
- Better Auth authentication
- PostgreSQL + Drizzle ORM
- Pricing plans, subscriptions, orders, and credit system
- Stripe and Creem payment integration
- Cloudflare R2 file storage
- Resend email integration
- Multi-language app structure
- Admin dashboard
- AI demo routes for chat, image, and video workflows

## Suggested workflow for new products

1. Clone this repository into a new project directory.
2. Run `pnpm template:init --product-name "My Product" --package-name my-product --site-url https://example.com`.
3. If the name or domain changes later, rerun `pnpm template:update` with only the fields that changed.
4. Copy `.env.example` to `.env.local` and fill in only the services needed for that product.
5. Update branding in `config/site.ts`, `public/`, and localized copy.
6. Adjust pricing plans and benefits.
7. Remove any demo pages not needed for the product.
8. Add the product-specific data model and business logic.

## Template maintenance

- Keep this repository as the stable baseline
- Enable GitHub Template Repository in repo settings
- Prefer changing shared infrastructure here, and building product logic in new repos created from it

## Core setup

Required for most products:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `BETTER_AUTH_SECRET`

Common optional services:

- Auth providers: Google, GitHub
- Payments: Stripe or Creem
- Storage: Cloudflare R2
- Email: Resend
- AI providers: OpenAI, Replicate, Anthropic, Google, OpenRouter
- Rate limiting: Upstash Redis

## Notes

- This repository is intentionally kept as a private baseline template.
- Demo pages and sample content should be reviewed before shipping a production product.
- Pricing seed data and sample AI routes are useful references, but should be adapted per product.
