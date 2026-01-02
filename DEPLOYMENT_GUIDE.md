# Deployment Guide for Aanandham.go

## 1. Prerequisites
- Your code is committed to GitHub: [https://github.com/AmanTShekar/aanandham.go](https://github.com/AmanTShekar/aanandham.go)
- Create accounts on [Netlify](https://www.netlify.com/) (Frontend) and [Render](https://render.com/) (Backend).

---

## 2. Setup Database (MongoDB Atlas)
*(Do this first if you don't have a connection string)*
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up.
2.  Create a **Free Cluster (M0)**.
3.  **Database Access**: Create a user (e.g., `admin`) and password. **Remember this password.**
4.  **Network Access**: specificy `0.0.0.0/0` (Allow Access from Anywhere).
5.  **Connect**: Click **Connect** > **Drivers**.
    *   Copy the string: `mongodb+srv://<username>:<password>@cluster0...`
    *   Replace `<password>` with your real password.
    *   **This is your MONGO_URI.**

## 3. Deploy Frontend (Netlify)
1.  **Log in to Netlify** and click **"Add new site"** > **"Import from Git"**.
2.  Select **GitHub** and choose your repository `aanandham.go`.
3.  Configure basic settings:
    *   **Base directory**: `client`
    *   **Build command**: `npm run build`
    *   **Publish directory**: `client/dist` (or just `dist` if Netlify auto-detects from base)
4.  **Environment Variables**:
    *   If your frontend connects to the backend, add a variable:
        *   Key: `VITE_API_BASE_URL`
        *   Value: `https://your-render-backend-url.onrender.com` (You will get this URL in Step 3).
5.  Click **Deploy Site**.

---

## 4. Deploy Backend (Render)
1.  **Log in to Render** and click **"New"** > **"Web Service"**.
2.  Connect your GitHub repository.
3.  Configure settings:
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
4.  **Environment Variables** (Add these under "Environment"):
    *   `MONGO_URI`: (Your MongoDB Connection String)
    *   `JWT_SECRET`: (Your secret key)
    *   `PORT`: `10000` (Render default)
    *   `CLIENT_URL`: `https://your-netlify-frontend-url.netlify.app` (So CORS allows it).
5.  Click **Create Web Service**.

---

## 5. Final Connection
Once both are deployed:
1.  Copy the **Render Backend URL** (e.g., `https://aanandham-api.onrender.com`).
2.  Go back to **Netlify > Site Settings > Environment Variables**.
3.  Update/Add `VITE_API_BASE_URL` with that Render URL (ensure no trailing slash if your code adds it).
4.  **Trigger a new deploy** in Netlify for the change to take effect.
