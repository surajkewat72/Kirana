# Kirana Deployment Guide

This guide provides step-by-step instructions to deploy the Kirana application as a unified service on **Render**.

## Prerequisites
- A GitHub account with the project repository uploaded.
- A **Railway** account (for your existing PostgreSQL database).
- A **Render** account (for hosting the application).

---

## Step 1: Prepare your Database (Railway)
Your database is already on Railway. Ensure you have the connection string ready.
1. Log in to [Railway](https://railway.app/).
2. Go to your PostgreSQL service.
3. Under **Variables**, find the `DATABASE_URL`. It should look like `postgresql://user:password@host:port/database`.

---

## Step 2: Configure Render for Unified Deployment
1. Log in to [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Configure the following settings:
   - **Name**: `kirana-store` (or any name you prefer).
   - **Environment**: `Node`.
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Advanced** and add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (Paste your Railway `DATABASE_URL` here)
   - `JWT_SECRET`: (Enter a long, random string for security)
   - `PORT`: `3000` (Render will override this, but it's good practice)

---

## Step 3: Performance & Scale (Optional)
Since the project uses Prisma, Render will automatically run the schema generation during the build process because of the `build` script in `package.json`.

---

## Step 4: Verification
Once the deployment is complete:
1. Open the **Service URL** provided by Render (e.g., `https://kirana-store.onrender.com`).
2. The homepage should load, serving the React frontend.
3. Check the products - they should be fetched from the backend API (now served on the same domain).
4. Try logging in or adding items to the cart to verify database connectivity.

---

## Troubleshooting
- **Build Fails**: Ensure you have pushed your latest changes, specifically the modifications to `index.ts` and `package.json`.
- **White Screen on Frontend**: Ensure `process.env.NODE_ENV` is set to `production` on Render.
- **Database Error**: Check if the Railway database URL is correct and that it allows connections from Render's IP (Railway is usually open by default).
