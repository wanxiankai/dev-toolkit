# New Project Checklist

Use this checklist whenever you start a new product from this template.

## Branding

- Run `pnpm template:init --product-name "Your Product" --package-name your-product --site-url https://your-domain.com`
- If branding changes later, run `pnpm template:update` with only the changed fields
- Use `pnpm template:show` to verify the current identity values
- Update `config/site.ts`
- Replace logos in `public/`
- Replace Open Graph images in `public/`
- Update landing page copy
- Update metadata and product title references

## Infrastructure

- Set `NEXT_PUBLIC_SITE_URL`
- Set `DATABASE_URL`
- Set `BETTER_AUTH_SECRET`
- Configure deployment target
- Configure production domain

## Authentication

- Decide login methods
- Configure Google OAuth if needed
- Configure GitHub OAuth if needed
- Configure Turnstile if public sign-up is enabled

## Payments

- Decide whether to use Stripe, Creem, or both
- Create real products and prices
- Replace test pricing plans
- Set webhook secrets
- Test checkout and subscription flow

## Storage and email

- Configure Cloudflare R2 if files are needed
- Configure Resend if login emails or notifications are needed
- Set sender identity and domain

## Product modules

- Keep or remove AI demo pages
- Keep or remove blog and CMS
- Keep or remove credit system depending on business model
- Add product-specific tables and actions

## Data and content

- Review `lib/db/seed/pricing_plan_seed.sql`
- Review sample blog posts in `blogs/`
- Review legal pages
- Review admin-only pages and dev-only pages

## QA before launch

- Test sign-up and sign-in
- Test payments
- Test email delivery
- Test storage uploads if applicable
- Test metadata and OG cards
- Test mobile layout
- Test dashboard permissions

## Repository hygiene

- Enable GitHub template mode
- Add branch protection if needed
- Add deployment secrets
- Add issue templates if wanted
- Add product README if the new repo is product-specific
