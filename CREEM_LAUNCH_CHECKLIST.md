# Creem Launch Checklist

Use this checklist before launching a product that uses Creem as the payment provider.

## 1. Creem account and dashboard setup

- Confirm your Creem account is fully activated
- Confirm you can create products in the target environment
- Decide whether you are launching in `test` or `live`
- Record the correct API key for that environment
- Record the correct webhook secret for that environment

## 2. Environment variables

Make sure the following variables are set correctly:

- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `CREEM_API_BASE_URL`
- `CREEM_API_KEY`
- `CREEM_WEBHOOK_SECRET`

Recommended related variables:

- `RESEND_API_KEY`
- `ADMIN_EMAIL`
- `R2_*` if the product stores uploaded or generated assets
- `UPSTASH_*` if you are using rate limiting or cached workflows

## 3. Creem product configuration

For every plan you want to sell:

- Create the matching product in Creem
- Confirm whether it is `onetime` or `recurring`
- Confirm the billing period is correct
- Confirm currency and amount are correct
- Copy the `product_id`

In this project, make sure each plan record matches the Creem product:

- `provider = creem`
- `creemProductId` is filled
- `paymentType` matches the intended purchase type
- `recurringInterval` matches the intended billing cadence
- `benefitsJsonb` is configured correctly

Examples:

- One-time credit pack:
  - `paymentType = onetime`
  - `benefitsJsonb.oneTimeCredits = <number>`
- Monthly subscription with credits:
  - `paymentType = recurring`
  - `recurringInterval = every-month`
  - `benefitsJsonb.monthlyCredits = <number>`

## 4. Admin-side verification

Before launch, verify every Creem product through the admin flow:

- Product ID verification works
- Discount code verification works, if discounts are used
- Product environment matches your current app environment

Relevant code paths:

- `app/api/admin/creem/verify-product/route.ts`
- `app/api/admin/creem/verify-discount/route.ts`

## 5. Webhook configuration

Make sure your Creem webhook points to:

- `/api/creem/webhook`

Recommended validation steps:

- Confirm the webhook secret exactly matches `CREEM_WEBHOOK_SECRET`
- Confirm webhook delivery works from Creem to your deployed domain
- Confirm your app returns successful responses for valid events

The current project expects these events:

- `checkout.completed`
- `subscription.active`
- `subscription.update`
- `subscription.expired`
- `subscription.canceled`
- `subscription.paid`
- `refund.created`

## 6. Checkout flow testing

Test all flows in the real deployed environment, not only locally:

- Logged-in user can start Creem checkout
- User is redirected to Creem checkout page
- Successful payment returns user to your success page
- Success page can verify payment correctly
- One-time purchase creates an order record
- Subscription purchase creates an order record
- Subscription purchase creates or updates a subscription record

Relevant code paths:

- `app/api/payment/checkout-session/route.ts`
- `app/api/payment/verify-success/route.ts`
- `app/api/payment/verify-success/creem-handler.ts`

## 7. Credits and benefits testing

If your business model uses credits, test both one-time and subscription grants:

- One-time purchase grants `oneTimeCreditsBalance`
- Subscription purchase grants `subscriptionCreditsBalance`
- Credit history records are written
- Credit deduction works correctly after payment
- Canceling a subscription revokes remaining subscription credits when expected
- Refunds revoke the correct benefits

Relevant code paths:

- `lib/payments/credit-manager.ts`
- `actions/usage/deduct.ts`
- `app/api/creem/webhook/handlers.ts`

## 8. Customer portal testing

If users should manage subscriptions themselves:

- User can open the subscription management page
- Creem customer portal link is created successfully
- Portal opens for the correct customer
- Cancel flow in portal is reflected back in your local database after webhook sync

Relevant code path:

- `actions/creem/portal.ts`

## 9. Order and subscription data checks

After test payments, check the database and dashboard:

- `orders` table contains the correct provider, order type, amount, and currency
- `subscriptions` table contains the correct Creem subscription ID and status
- `usage` table balances are updated correctly
- `credit_logs` contains the expected grant and usage records
- User dashboard shows the correct order and subscription state

## 10. Edge cases to test before launch

- Duplicate webhook delivery does not create duplicate orders
- Payment success page is visited before webhook processing finishes
- User refreshes the success page multiple times
- Discount code is invalid or expired
- Subscription is canceled from Creem portal
- Refund is issued after a purchase
- Product ID configured in admin does not match the environment

## 11. Current project limitations to be aware of

Creem support in this project is solid for normal launch flows, but it is not a perfect one-to-one copy of the Stripe implementation.

Review these areas if your business model is more advanced:

- Complex subscription upgrade and downgrade behavior
- More detailed proration handling
- Richer admin operations around payment state changes
- Provider-specific edge-case recovery flows

If your product only needs standard one-time purchases, subscriptions, refunds, portal access, and credits, the current Creem implementation should be sufficient for launch.

## 12. Final launch sign-off

Before going live, confirm all of the following:

- Deployed domain is final
- Environment variables are set in production
- Creem products are live products, not test products
- Webhook endpoint is live and receiving events
- At least one one-time payment has been tested end to end
- At least one subscription payment has been tested end to end
- Refund flow has been tested
- Customer portal flow has been tested
- Orders, subscriptions, and credit balances look correct in the database
