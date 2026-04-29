# Bink City -- ClubGG Token Automation Platform

## System Overview

Bink City is a web platform that automates ClubGG poker token delivery. Users sign up, verify their identity (government ID), purchase tokens via Stripe, and a backend automation agent delivers the tokens to their ClubGG account by driving the ClubGG application via GUI automation.

The critical design principle: **users are only charged after tokens are successfully delivered**. Stripe's manual-capture PaymentIntents authorize a hold on the card, and the hold is only captured after the automation agent confirms delivery. If the club or player ID is invalid, the hold is released and the user pays nothing.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│              Next.js 16 (App Router)                 │
│                                                     │
│  /signup    - Create account                        │
│  /login     - Sign in (NextAuth.js)                 │
│  /verify    - Onfido ID verification                │
│  /order     - Select club, player, token amount     │
│  /dashboard - View order history + status           │
│  /admin     - Admin order management (admin only)   │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│                   API ROUTES                         │
│            Next.js Route Handlers                    │
│                                                     │
│  POST /api/auth/signup          - Register user     │
│  GET/POST /api/auth/[...nextauth] - NextAuth        │
│  POST /api/onfido/create-check  - Start ID verify   │
│  POST /api/onfido/complete-check - Submit check     │
│  POST /api/webhooks/onfido      - Onfido callback   │
│  POST /api/orders               - Create order      │
│  GET  /api/orders               - List user orders  │
│  GET  /api/orders/:id           - Get single order  │
│  PATCH /api/orders/:id          - Update (admin)    │
│  POST /api/webhooks/stripe      - Stripe callback   │
│  GET  /api/admin/orders         - All orders (admin)│
│  POST /api/admin/orders/:id/retry - Retry (admin)   │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│                   DATABASE                           │
│              PostgreSQL + Prisma                     │
│                                                     │
│  User   - id, email, passwordHash, name, dob,      │
│           onfidoApplicantId, onfidoCheckId,          │
│           idVerified, isAdmin                        │
│  Order  - id, userId, clubGgClubId,                 │
│           clubGgPlayerId, tokenAmount, priceUsd,     │
│           stripePaymentIntentId, status,             │
│           failureReason                              │
└─────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│                   JOB QUEUE                          │
│              BullMQ + Redis                          │
│                                                     │
│  Queue: "token-delivery"                            │
│  Job: { orderId, clubId, playerId,                  │
│         tokenAmount, stripePaymentIntentId }         │
│  Retry: 3 attempts, exponential backoff             │
│  Dead letter: "bull:token-delivery:failed"          │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│              AUTOMATION WORKER                       │
│              Python (worker/)                        │
│                                                     │
│  main.py           - Queue consumer loop            │
│  clubgg_agent.py   - GUI automation (Appium)        │
│  stripe_client.py  - Capture / cancel payments      │
│  config.py         - Environment configuration      │
│                                                     │
│  Drives ClubGG app via Android emulator + Appium    │
│  On success: captures Stripe PaymentIntent          │
│  On failure: cancels PaymentIntent (no charge)      │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│              ClubGG APPLICATION                      │
│         Android Emulator / Desktop App               │
│                                                     │
│  Agent logs in → finds club → finds player →        │
│  sends tokens → confirms success                    │
└─────────────────────────────────────────────────────┘
```

---

## API Reference

### Authentication

#### `POST /api/auth/signup`

Create a new user account.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "name": "John Doe",
  "dateOfBirth": "1990-05-15"
}
```

**Response (201):**
```json
{
  "id": "clx...",
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Errors:**
- `400` - Missing fields or age < 18
- `409` - Email already registered

#### `GET/POST /api/auth/[...nextauth]`

NextAuth.js handlers. Supports credentials provider (email + password).

Session JWT includes: `id`, `email`, `name`, `idVerified`, `isAdmin`.

---

### Identity Verification (Onfido)

#### `POST /api/onfido/create-check`

Initialize Onfido verification. Creates an applicant (if not exists) and returns an SDK token.

**Auth:** Required (session)

**Response (200):**
```json
{
  "sdkToken": "eyJ...",
  "applicantId": "abc-123"
}
```

#### `POST /api/onfido/complete-check`

Submit the Onfido check after the user completes the SDK flow (document + selfie).

**Auth:** Required (session)

**Response (200):**
```json
{
  "checkId": "check-123",
  "status": "in_progress"
}
```

#### `POST /api/webhooks/onfido`

Onfido webhook. Updates `User.idVerified` when check completes.

**Auth:** HMAC signature verification via `x-sha2-signature` header.

**Handled events:**
- `check.completed` - Sets `idVerified = true` if status is `complete`

---

### Orders

#### `POST /api/orders`

Create a new token order. Creates a Stripe PaymentIntent with manual capture.

**Auth:** Required (session, `idVerified` must be `true`)

**Request body:**
```json
{
  "clubId": "12345",
  "playerId": "myplayer",
  "tokenAmount": 10000
}
```

**Response (200):**
```json
{
  "orderId": "clx...",
  "clientSecret": "pi_xxx_secret_yyy",
  "priceUsd": 10000
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Identity not verified
- `400` - Missing fields or invalid token amount

#### `GET /api/orders`

List the authenticated user's orders (most recent first, max 50).

**Auth:** Required (session)

**Response (200):**
```json
{
  "orders": [
    {
      "id": "clx...",
      "clubGgClubId": "12345",
      "clubGgPlayerId": "myplayer",
      "tokenAmount": 10000,
      "priceUsd": 10000,
      "status": "COMPLETED",
      "failureReason": null,
      "createdAt": "2026-04-28T...",
      "updatedAt": "2026-04-28T..."
    }
  ]
}
```

#### `GET /api/orders/:id`

Get a single order. Users can only access their own orders; admins can access any.

#### `PATCH /api/orders/:id`

Update order status/failure reason. Admin only.

---

### Stripe Webhooks

#### `POST /api/webhooks/stripe`

**Handled events:**

| Event | Action |
|-------|--------|
| `payment_intent.amount_capturable_updated` | Update order to `AUTHORIZED`, enqueue job |
| `payment_intent.succeeded` | Update order to `COMPLETED` |
| `payment_intent.canceled` | Update order to `FAILED` |

---

### Admin

#### `GET /api/admin/orders`

List all orders with pagination and status filtering. Includes user details.

**Auth:** Admin only (`isAdmin: true`)

**Query params:** `status`, `page`, `limit`

#### `POST /api/admin/orders/:id/retry`

Re-queue a failed order for delivery.

**Auth:** Admin only

---

## Database Schema

### User

| Column | Type | Notes |
|--------|------|-------|
| id | String (CUID) | Primary key |
| email | String | Unique |
| passwordHash | String | bcrypt hash |
| name | String | |
| dateOfBirth | DateTime | Must be 18+ |
| onfidoApplicantId | String? | Onfido applicant |
| onfidoCheckId | String? | Onfido check |
| idVerified | Boolean | Default: false |
| isAdmin | Boolean | Default: false |
| createdAt | DateTime | Auto |

### Order

| Column | Type | Notes |
|--------|------|-------|
| id | String (CUID) | Primary key |
| userId | String | FK -> User |
| clubGgClubId | String | ClubGG club identifier |
| clubGgPlayerId | String | ClubGG player identifier |
| tokenAmount | Int | Number of tokens |
| priceUsd | Int | Price in cents |
| stripePaymentIntentId | String | Unique, Stripe PI ID |
| status | OrderStatus | See enum below |
| failureReason | String? | Set on failure |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

### OrderStatus Enum

| Value | Meaning |
|-------|---------|
| `PENDING` | PaymentIntent created, awaiting card confirmation |
| `AUTHORIZED` | Card hold placed, job queued for automation |
| `PROCESSING` | Automation agent actively working |
| `COMPLETED` | Tokens delivered, payment captured |
| `FAILED` | Validation failed or automation error, payment released |
| `REFUNDED` | Manual refund issued after capture |

---

## Stripe Integration

### PaymentIntent Lifecycle

```
CREATE (capture_method: manual)
  → User confirms card via Stripe Elements
  → Webhook: payment_intent.amount_capturable_updated
  → Job enqueued
  →  Agent validates club + player
  ├─ Valid:   stripe.paymentIntents.capture(id) → COMPLETED
  └─ Invalid: stripe.paymentIntents.cancel(id)  → FAILED (no charge)
```

Key details:
- `capture_method: "manual"` places an authorization hold without charging
- Manual capture must happen within 7 days (Stripe limit)
- Cancellation immediately releases the hold on the customer's card
- Metadata on the PaymentIntent includes `userId`, `clubId`, `playerId`, `tokenAmount`

---

## Onfido Integration

### Flow

1. User clicks "Verify" on `/verify`
2. `POST /api/onfido/create-check` creates an Onfido applicant + returns SDK token
3. Onfido JavaScript SDK renders in-page (document upload + selfie capture)
4. On SDK completion, `POST /api/onfido/complete-check` creates a check
5. Onfido processes asynchronously, sends webhook on completion
6. `POST /api/webhooks/onfido` updates `User.idVerified = true`

### Required Onfido reports
- `document` - Government ID validation
- `facial_similarity_photo` - Selfie matching

---

## Automation Agent Protocol

### Job Payload

```json
{
  "orderId": "clx...",
  "clubId": "12345",
  "playerId": "myplayer",
  "tokenAmount": 10000,
  "stripePaymentIntentId": "pi_xxx"
}
```

### State Machine

```
AUTHORIZED → PROCESSING → COMPLETED (capture payment)
                        → FAILED    (cancel payment)
```

### Agent Steps

1. Connect to ClubGG app (Appium session)
2. Login with agent credentials (skip if already logged in)
3. Navigate to club by Club ID (search UI)
4. Find player by Player ID (member list search)
5. Send tokens (player profile → transfer → confirm)
6. Verify success (check for confirmation toast/dialog)

### Error Handling

| Error Type | Action |
|-----------|--------|
| `ClubGGValidationError` (club/player not found) | Cancel payment, mark FAILED, no retry |
| `ClubGGAgentError` (automation failure) | Retry with exponential backoff |
| All retries exhausted | Cancel payment, mark FAILED, move to dead letter queue |

### Retry Policy
- Max attempts: 3
- Backoff: exponential (5s, 10s, 20s)
- Dead letter queue: `bull:token-delivery:failed`

### Screenshots
- Saved to `worker/screenshots/` on every failure
- Named: `YYYYMMDD_HHMMSS_<step>.png`
- Steps: `pre_login`, `post_login`, `pre_club_nav`, `club_search_result`, `club_not_found`, `pre_player_search`, `player_search_result`, `player_not_found`, `pre_send_tokens`, `post_send_tokens`

---

## Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `DATABASE_URL` | Web | PostgreSQL connection string |
| `NEXTAUTH_URL` | Web | Public URL (e.g., `https://binkcity.com`) |
| `NEXTAUTH_SECRET` | Web | Random secret for JWT signing |
| `STRIPE_SECRET_KEY` | Web + Worker | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Web (client) | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Web | Stripe webhook signing secret |
| `ONFIDO_API_TOKEN` | Web | Onfido API token |
| `ONFIDO_WEBHOOK_SECRET` | Web | Onfido webhook HMAC secret |
| `REDIS_URL` | Web + Worker | Redis connection string |
| `RESEND_API_KEY` | Web | Resend email API key |
| `CLUBGG_AGENT_USERNAME` | Worker | ClubGG login credentials |
| `CLUBGG_AGENT_PASSWORD` | Worker | ClubGG login credentials |
| `APPIUM_SERVER` | Worker | Appium server URL |

---

## Deployment Topology

| Component | Host | Notes |
|-----------|------|-------|
| Next.js frontend + API | Vercel | Serverless, auto-scaling |
| PostgreSQL | Neon / Supabase / RDS | Managed, with connection pooling |
| Redis | Upstash / ElastiCache | For BullMQ job queue |
| Automation worker | VPS / EC2 | Must have GUI environment + ClubGG app |
| Android emulator | Same VPS as worker | Appium server at `:4723` |
| Onfido | SaaS | Webhook to `/api/webhooks/onfido` |
| Stripe | SaaS | Webhook to `/api/webhooks/stripe` |
| Resend | SaaS | Transactional email |

### Worker VPS Requirements
- Ubuntu 22.04+ or similar
- Docker (for containerized worker)
- Android SDK + emulator with ClubGG APK installed
- Appium server running on port 4723
- Network access to Redis and Stripe API

---

## Sequence Diagrams

### Full Order Flow

```
User → /order (enter Club ID, Player ID, amount)
  → POST /api/orders
    → Stripe: create PaymentIntent (manual capture)
    → DB: create Order (PENDING)
    → Return clientSecret
  → Stripe Elements: confirm card
  → Stripe webhook: amount_capturable_updated
    → DB: update Order (AUTHORIZED)
    → Redis: enqueue job
  → Worker: dequeue job
    → DB: update Order (PROCESSING)
    → Appium: login to ClubGG
    → Appium: find club by ID
    → Appium: find player by ID
    ├─ Found:
    │  → Appium: send tokens
    │  → Stripe: capture PaymentIntent
    │  → DB: update Order (COMPLETED)
    │  → Email: send completion notice
    └─ Not found:
       → Stripe: cancel PaymentIntent
       → DB: update Order (FAILED)
       → Email: send failure notice
```

### Signup + Verification Flow

```
User → /signup (name, email, password, DOB)
  → POST /api/auth/signup
    → Validate age >= 18
    → Hash password (bcrypt)
    → DB: create User
  → Redirect to /login
  → Sign in with NextAuth
  → /dashboard (sees "Verify Identity" banner)
  → /verify
    → POST /api/onfido/create-check
      → Onfido: create applicant
      → Onfido: generate SDK token
    → Onfido SDK: upload ID + take selfie
    → POST /api/onfido/complete-check
      → Onfido: create check
    → Onfido processes asynchronously
    → Onfido webhook: check.completed
      → DB: update User.idVerified = true
  → User can now access /order
```

---

## Project Structure

```
Bink-City-Games-Website/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.js    # NextAuth handlers
│   │   │   └── signup/route.js           # User registration
│   │   ├── orders/
│   │   │   ├── route.js                  # Create + list orders
│   │   │   └── [id]/route.js             # Get + update single order
│   │   ├── admin/
│   │   │   └── orders/
│   │   │       ├── route.js              # List all orders (admin)
│   │   │       └── [id]/retry/route.js   # Retry failed order
│   │   ├── onfido/
│   │   │   ├── create-check/route.js     # Init verification
│   │   │   └── complete-check/route.js   # Submit check
│   │   └── webhooks/
│   │       ├── stripe/route.js           # Stripe events
│   │       └── onfido/route.js           # Onfido events
│   ├── components/
│   │   ├── Navbar.js                     # Auth-aware navigation
│   │   └── SessionProvider.js            # NextAuth session wrapper
│   ├── admin/page.js                     # Admin panel
│   ├── dashboard/page.js                 # User dashboard
│   ├── login/page.js                     # Sign in
│   ├── order/page.js                     # Token purchase + Stripe
│   ├── payment/page.js                   # Redirect to /order
│   ├── signup/page.js                    # Registration
│   ├── verify/page.js                    # Onfido ID verification
│   ├── layout.js                         # Root layout + providers
│   ├── page.js                           # Marketing home
│   └── globals.css                       # Global styles
├── lib/
│   ├── auth.js                           # NextAuth configuration
│   ├── prisma.js                         # Prisma client singleton
│   ├── stripe.js                         # Stripe client
│   ├── queue.js                          # BullMQ queue producer
│   └── email.js                          # Resend email helpers
├── prisma/
│   └── schema.prisma                     # Database schema
├── worker/
│   ├── main.py                           # Queue consumer entry point
│   ├── clubgg_agent.py                   # ClubGG GUI automation
│   ├── stripe_client.py                  # Payment capture/cancel
│   ├── config.py                         # Environment config
│   └── requirements.txt                  # Python dependencies
├── middleware.js                          # Route protection
├── docker-compose.yml                    # Local dev services
├── Dockerfile.worker                     # Worker container
├── .env                                  # Environment variables
└── .github/workflows/deploy.yml          # CI/CD pipeline
```

---

## Customization Notes

### Token Pricing

Currently set to $0.01 per token in `app/api/orders/route.js`:
```js
const TOKEN_PRICE_CENTS_PER_UNIT = 1;
```

Adjust this to match your actual pricing model. You can also implement tiered pricing or volume discounts by modifying the price calculation.

### ClubGG App Selectors

The Appium selectors in `worker/clubgg_agent.py` are placeholder XPaths. You **must** update them to match the actual ClubGG app UI:

1. Install ClubGG on your Android emulator
2. Use Appium Inspector to identify element selectors
3. Update the XPaths in `clubgg_agent.py` for each step

### Adding an Admin User

After creating a regular account, promote it to admin via Prisma:

```bash
npx prisma studio
# Or via SQL:
# UPDATE "User" SET "isAdmin" = true WHERE email = 'admin@binkcity.com';
```
