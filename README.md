# 🔧 DevToolKit

All-in-One Developer Toolbox — Free, fast, and privacy-first online developer tools.

## Features

- 20+ developer tools (encoding, formatting, generating, converting, and more)
- AI-powered code explanation, conversion, and regex generation
- Dark/Light/System theme
- Multi-language support (English, 中文, 日本語)
- User authentication with favorites
- Privacy-first: all tools run client-side (except AI features)
- Fully responsive design

## Tech Stack

- Next.js 16 + React 19 (App Router)
- TypeScript 5 (strict)
- Tailwind CSS v4 + shadcn/ui
- Better Auth (GitHub/Google OAuth)
- PostgreSQL + Drizzle ORM
- Vercel AI SDK v4 (multi-provider)
- next-intl (i18n)
- Zustand (state management)

## Getting Started

```bash
pnpm install
cp .env.example .env.local
# Fill in DATABASE_URL, BETTER_AUTH_SECRET, and at least one OAuth provider
pnpm dev
```

## License

MIT
