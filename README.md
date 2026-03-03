# Imagnify

Imagnify is a full-stack AI image transformation SaaS app built with Next.js.

Users can upload images, apply AI-powered transformations (restore, remove background, object removal, recolor, and generative fill), save results, browse community edits, and purchase additional credits through Stripe.

## What This Project Does

Imagnify combines three core workflows into one product:

1. AI image editing with Cloudinary transformations.
2. User management and protected app access with Clerk.
3. Credit-based monetization with Stripe Checkout + webhook-driven credit top-ups.

This repository is a practical template for building production-style AI SaaS apps with account onboarding, billing, and persistent user-generated content.

## Core Features

- Authentication and protected routes with Clerk.
- Community feed with paginated transformed images.
- Search across Cloudinary-backed assets.
- AI transformation types:
  - Image Restore
  - Background Remove
  - Object Remove
  - Object Recolor
  - Generative Fill (outpainting)
- Transformation detail pages with before/after preview.
- Edit and delete support for image owners.
- User profile with credit balance and personal gallery.
- Credit gating for transformations.
- Stripe-powered credit purchases (Pro and Premium packages).
- Stripe webhook handling to create transactions and increment credits.
- Clerk webhook handling to sync users into MongoDB.

## Tech Stack

- Framework: Next.js (App Router), React, TypeScript
- UI: Tailwind CSS, shadcn/ui, Radix UI
- Auth: Clerk
- Database: MongoDB + Mongoose
- Media + AI transforms: Cloudinary + next-cloudinary
- Payments: Stripe Checkout + Webhooks

## How Credits Work

- Each transformation consumes credits (`creditFee = -1`).
- New users start with a default credit balance in MongoDB.
- If credits are insufficient, users see a modal and are redirected to `/credits`.
- Paid plans trigger Stripe Checkout.
- On successful payment, `POST /api/webhooks/stripe` stores a transaction and updates user credits.

## Main Routes

- `/` - Home feed + search + recent edits
- `/transformations/add/[type]` - Create new transformation
- `/transformations/[id]` - Transformation details
- `/transformations/[id]/update` - Update existing transformation
- `/profile` - User credits + personal transformations
- `/credits` - Credit plans and Stripe checkout
- `/api/webhooks/clerk` - Clerk user lifecycle sync
- `/api/webhooks/stripe` - Stripe payment confirmation

## Project Structure

```txt
app/
  (auth)/
  (root)/
  api/webhooks/{clerk,stripe}/
components/
  shared/
  ui/
constants/
lib/
  actions/
  database/
  utils/
public/
```

## Local Setup

### 1. Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas (or local MongoDB)
- Clerk account
- Cloudinary account
- Stripe account

### 2. Clone and install

```bash
git clone https://github.com/Nikhil-Verma-01/Imagnify.git
cd Imagnify
npm install
```

### 3. Configure environment variables

Create `.env.local` in the project root:

```env
# App
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# MongoDB
MONGODB_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 4. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Webhook Setup (Required)

### Clerk webhook

Configure Clerk to send user events to:

- `http://localhost:3000/api/webhooks/clerk` (local)
- your deployed URL in production

Use the signing secret as `WEBHOOK_SECRET`.

### Stripe webhook

Configure Stripe to send events to:

- `http://localhost:3000/api/webhooks/stripe` (local)
- your deployed URL in production

Required event:

- `checkout.session.completed`

Use the webhook signing secret as `STRIPE_WEBHOOK_SECRET`.

## NPM Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Data Models (High Level)

- `User`:
  - Clerk identity mapping (`clerkId`)
  - profile data
  - `creditBalance`
- `Image`:
  - source `publicId`
  - transformation metadata (`type`, `config`, prompts/colors, URLs)
  - author reference
- `Transaction`:
  - Stripe session/payment linkage (`stripeId`)
  - amount, plan, credits
  - buyer reference

## Deployment Notes

- Set all environment variables in your hosting provider.
- Point Clerk and Stripe webhooks to your production domain.
- Ensure MongoDB network access allows your deployment runtime.

## Why This Repo Is Useful

This project demonstrates an end-to-end SaaS implementation, not just UI:

- authenticated product experience,
- AI/media workflows,
- persistent data modeling,
- and real payment-to-entitlement logic.

If you are building an AI product with subscriptions or credits, this is a strong starter architecture.
