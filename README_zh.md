# SaaS 启动模板

这是一个私有的全栈 SaaS 启动模板，基于 Next.js 16、React 19、Drizzle、PostgreSQL、Better Auth、Stripe/Creem、Cloudflare R2 和多种 AI 能力构建。

这个仓库的目标不是直接作为单一产品发布，而是作为你未来新产品的统一 Web 模板。以后每次有新的 SaaS 想法，都可以直接从这里初始化，减少重复搭建登录、支付、后台、数据库和基础设施的时间。

配套文档：

- `TEMPLATE_SETUP.md`：新项目初始化说明
- `NEW_PROJECT_CHECKLIST.md`：每次起新项目时的检查清单
- `CREEM_LAUNCH_CHECKLIST.md`：Creem 收款上线检查清单

身份信息命令：

- `pnpm template:show`
- `pnpm template:init --product-name "你的产品名" --package-name your-product --site-url https://your-domain.com`
- `pnpm template:init --product-name "你的产品名" --package-name your-product`
- `pnpm template:update --product-name "新的产品名"`
- `pnpm template:update --site-url https://new-domain.com`

## 已包含能力

- Next.js 16 + React 19 + App Router
- Better Auth 登录鉴权
- PostgreSQL + Drizzle ORM
- 定价、订阅、订单、积分体系
- Stripe / Creem 支付
- Cloudflare R2 文件存储
- Resend 邮件
- 多语言站点结构
- 管理后台
- AI 对话、图片、视频 demo 路由

## 新产品建议使用方式

1. 基于这个仓库复制一个新项目目录。
2. 运行 `pnpm template:init --product-name "你的产品名" --package-name your-product --site-url https://your-domain.com`。
3. 如果后续产品名称、包名或域名发生变化，运行 `pnpm template:update` 只修改变化的字段即可。
4. 将 `.env.example` 复制为 `.env.local`，按产品需要填写配置。
5. 更新 `config/site.ts`、`public/` 和多语言文案中的品牌信息。
6. 调整定价方案和权益配置。
7. 删除当前产品不需要的 demo 页面。
8. 增加该产品自己的数据模型和业务逻辑。

## 模板维护建议

- 将这个仓库作为长期稳定的基础模板
- 在 GitHub 仓库设置里开启 Template Repository
- 通用能力在这里维护，具体产品功能放到新的项目仓库里开发

## 通用基础配置

大多数产品至少需要：

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `BETTER_AUTH_SECRET`

按需接入：

- 登录：Google / GitHub
- 支付：Stripe 或 Creem
- 存储：Cloudflare R2
- 邮件：Resend
- AI：OpenAI / Replicate / Anthropic / Google / OpenRouter
- 限流：Upstash Redis

## 说明

- 这个仓库建议长期保持为私有模板仓库。
- 正式上线前应检查并清理 demo 页面、示例文案和测试定价数据。
- 现有 AI demo 与支付积分系统可复用，但应按具体产品需求调整。
