# Tutaly Production Deployment Guide

This guide will walk you through provisioning the required infrastructure and deploying both the Next.js frontend to Vercel and the NestJS backend to Railway.

## Prerequisites

- Accounts on **Supabase** (Database/Storage), **Upstash** (Redis), **Railway** (API Hosting), and **Vercel** (Web Hosting).
- GitHub repository containing the Tutaly monorepo.
- `pnpm` installed locally for running migrations.

---

## 1. Provision Infrastructure

### 1.1 Database & Storage (Supabase)
1. Go to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project. Remember your database password.
3. Go to **Project Settings > Database** and copy the **Connection string (URI)**. Replace `[YOUR-PASSWORD]` with the password you set.
   - Example: `postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`
4. Go to **Storage**. Create a new bucket named `tutaly-assets-prod`. Make it public if avatars/resumes are meant to be publicly readable, or keep it private and ensure the signed URL logic works.
5. Go to **Project Settings > Storage** and generate S3 Access Keys. Save the `Access Key ID`, `Secret Access Key`, and the `Endpoint`.

### 1.2 Redis (Upstash)
1. Go to the [Upstash Console](https://console.upstash.com/).
2. Create a new Redis Database.
3. Scroll down to the "Node.js (ioredis)" connection section and copy the `REDIS_URL`.

---

## 2. Set Up Environment Variables

1. Make a copy of `.env.production.example` locally as `.env.production`.
2. Fill in all the fields with the credentials you gathered in step 1.
3. Generate secure random secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET` (e.g., using `openssl rand -hex 32`).
4. Set up your Flutterwave **Live** keys.

---

## 3. Run Database Migrations

Before deploying the API, your database schema must be initialized. Run this locally:

```bash
# Set your production database URL temporarily in your local environment
set DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"

# Run TypeORM migrations from the API package
pnpm --filter api run migration:run
```

---

## 4. Deploy NestJS API to Railway

1. Go to the [Railway Dashboard](https://railway.app/).
2. Click **New Project** > **Deploy from GitHub repo**.
3. Select your Tutaly repository.
4. Railway will automatically detect the monorepo. We have provided `apps/api/railway.toml` which instructs it how to build.
5. Go to the project **Settings**:
   - Set the **Root Directory** to `/` (Root of the repo).
6. Go to **Variables** and paste the variables from your `.env.production` file.
   - Crucially ensure `DATABASE_URL`, `REDIS_URL`, and all keys are set.
7. Go to **Settings > Domains** and click **Generate Domain** (e.g., `tutaly-api-production.up.railway.app`).
8. Copy this API domain.

---

## 5. Deploy Next.js Web to Vercel

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New... > Project** and select your GitHub repository.
3. In the "Configure Project" screen:
   - **Framework Preset**: Next.js (usually auto-detected).
   - **Root Directory**: `apps/web`.
4. Open the **Environment Variables** section and add the required frontend variables:
   - `NEXT_PUBLIC_API_URL`: The Railway API domain you generated in Step 4.
   - Any other `NEXT_PUBLIC_*` variables required by your application.
5. Click **Deploy**. Vercel will automatically run `pnpm install` and build the Next.js app.
6. Once deployed, copy the production frontend URL (e.g., `https://tutaly.vercel.app`).

---

## 6. Finalize CORS and Webhooks

1. **Update API CORS**: Now that you have the Vercel URL, go back to Railway and add/update the `ALLOWED_ORIGINS` environment variable to include your exact Vercel frontend URL.
2. **Update Flutterwave Webhooks**: Go to your Flutterwave Dashboard > Settings > Webhooks. Set the webhook URL to point to your Railway API (e.g., `https://tutaly-api-production.up.railway.app/api/shop/webhook`). Ensure the secret hash matches your `FLUTTER_WAVE_WEBHOOK_SECRET`.

Your Tutaly platform should now be fully live!
