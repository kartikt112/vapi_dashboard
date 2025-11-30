# Deployment Guide for Vercel

This project currently uses **SQLite**, which is **not supported** for serverless deployments on Vercel because the filesystem is ephemeral (data will be lost on every redeploy).

To deploy to Vercel, you need to switch to a cloud database like **Vercel Postgres**.

## Step 1: Create Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Import your repository: `vapi_dashboard`.
4. Leave the settings as default for now and click **Deploy**. 
   * *Note: The build might fail or the app might error at runtime because of SQLite. This is expected.*

## Step 2: Set up Vercel Postgres
1. In your Vercel Project Dashboard, go to the **Storage** tab.
2. Click **"Connect Store"** -> **"Create New"** -> **"Postgres"**.
3. Accept the terms and create the database.
4. Once created, go to the **Settings** tab (of the database) -> **.env.local**.
5. Copy the `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`.

## Step 3: Update Project Configuration
You need to update your code to use Postgres instead of SQLite.

### 1. Update `prisma/schema.prisma`
Change the datasource provider:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL") // Uses connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // Uses direct connection
}
```

### 2. Install Dependencies
Run this locally:
```bash
npm install pg
```

### 3. Generate Client
Run:
```bash
npx prisma generate
```

## Step 4: Environment Variables
1. Go to your Vercel Project **Settings** -> **Environment Variables**.
2. Ensure the following variables are present (Vercel usually adds them automatically when you connect the database):
   * `POSTGRES_PRISMA_URL`
   * `POSTGRES_URL_NON_POOLING`
   * `VAPI_API_KEY` (You need to add this manually!)

## Step 5: Push Changes
1. Commit the changes to `prisma/schema.prisma` and `package.json`.
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Switch to Postgres for Vercel deployment"
   git push
   ```

## Step 6: Database Migration
Once deployed, Vercel will build your app. You might need to run migrations against the production database.
You can do this from your local machine if you have the env vars set, or via Vercel CLI.

**Locally (easiest):**
1. Pull Vercel env vars: `npx vercel env pull .env.local`
2. Run migration: `npx prisma migrate deploy`

Your app should now be live and connected to Postgres!
