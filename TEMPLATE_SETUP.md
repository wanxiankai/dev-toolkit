# Template Setup Guide

Use this repository as the starting point for any new SaaS product.

## Recommended new project flow

1. Create a new repository from this template.
2. Clone the new repository locally.
3. Copy `.env.example` to `.env.local`.
4. Run the identity command to set the currently known project identity:
   `pnpm template:init --product-name "My Product" --package-name my-product --site-url https://example.com`
5. If some information is not final yet, you can initialize with partial fields, for example:
   `pnpm template:init --product-name "My Product" --package-name my-product`
6. You can fill only the missing or changed parts later with:
   `pnpm template:update --product-name "New Product Name"`
7. Fill in only the services needed for that product.
8. Replace branding, content, pricing, and demo modules.
9. Add product-specific data tables and business logic.

## Identity commands

These commands are safe to use multiple times during product discovery and strategy changes.

- Show current project identity:
  - `pnpm template:show`
- Initial setup or first identity assignment:
  - `pnpm template:init --product-name "My Product" --package-name my-product --site-url https://example.com`
- Initial setup when the domain is not decided yet:
  - `pnpm template:init --product-name "My Product" --package-name my-product`
- Update only the product name:
  - `pnpm template:update --product-name "New Product Name"`
- Update only the package name:
  - `pnpm template:update --package-name new-package-name`
- Update only the site URL:
  - `pnpm template:update --site-url https://new-domain.com`
- Update creator and author:
  - `pnpm template:update --creator @newhandle --author-name "Your Name"`
- Update multiple fields together:
  - `pnpm template:update --product-name "New Product Name" --site-url https://new-domain.com`

Supported flags:

- `--product-name`
- `--package-name`
- `--site-url`
- `--creator`
- `--author-name`

Notes:

- `template:init` and `template:update` use the same underlying logic
- You do not need to know the final domain when the project starts
- If your product naming changes later, just rerun `template:update`
- After changing product name or domain, also review `.env.local`, deployment env vars, metadata, logos, and legal copy

## First files to update

- `config/site.ts`
  - Product name
  - Site URL
  - Author and creator fields
  - Social links
- `.env.local`
  - Site URL
  - Database URL
  - Auth secret
  - Payment, email, storage, and AI provider keys
- `public/`
  - `logo.png`
  - `logo.svg`
  - `favicon.ico`
  - `og.png`
  - locale-specific OG images if needed
- `package.json`
  - Confirm the package name after running identity commands

## Product-specific content to review

- Landing page copy under `i18n/messages/`
- Blog demo content under `blogs/`
- About, privacy, terms, and refund pages under `app/(site)/`
- Pricing plans and seeded data under `lib/db/seed/`

## Optional modules you can keep or remove

- `app/[locale]/(basic-layout)/ai-demo/`
  - Keep if the product is AI-related
  - Remove if it is unrelated to AI
- `blogs/` and CMS pages
  - Keep if you want SEO content and a built-in blog
  - Remove if the product does not need content marketing
- Stripe and Creem
  - Keep one or both depending on your payment stack
- Cloudflare R2
  - Keep if you need media or generated asset storage
- Resend
  - Keep if login emails or lifecycle emails are needed

## Common startup decisions

- Is this product credits-based, subscription-based, or both?
- Do users need Google/GitHub login, or only email login?
- Do you need a blog at launch?
- Do you need multi-language support at launch?
- Do you need file storage?
- Do you need AI providers from day one?

## Suggested branch strategy

- Keep `main` as the stable template baseline
- Create a new repo or new branch per product
- Avoid mixing template maintenance and product features in the same branch

## Good baseline cleanup for every new product

- Replace placeholder brand values
- Remove unused demo pages
- Remove unused provider env vars from deployment settings
- Replace sample pricing plans
- Replace sample images and OG assets
- Review legal pages before launch
