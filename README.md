# Paisley Christmas Markets — White-Label Seasonal Event Platform (PoC)

> **Module:** COMP10020 Internet Technologies (UWS 2026-27)  
> **Assessment:** Coursework 2 — Proof-of-Concept Full-Stack Web Application  
> **Architecture:** React 18 + TypeScript + Vite + Tailwind CSS | Node.js + Express + MongoDB (with zero-config local persistence fallback)

## Key Architectural & Commercial Highlights
1. **Scottish Winter Editorial Visual System**: Bespoke design language featuring deep pine green (`#0D1F1A`), warm parchment (`#F7F4EE`), burgundy (`#6B1D2A`), and matte champagne gold (`#C9A66B`), with subtle SVG Paisley Pattern motifs, Paisley Abbey silhouette, and high-contrast Day/Night themes.
2. **Interactive Abbey Square Chalet Map**: Real-time SVG venue map synced with the backend database. Traders select available chalets directly from the map (auto-filling stall code, zone, utilities, and fee), while visitors explore approved traders by clicking booked chalets.
3. **Live Trader-to-Public Approval Pipeline**: End-to-end database workflow — trader submission locks a chalet as `Pending`; Admin approval immediately publishes the trader to the public directory and updates the interactive map to `Booked`.
4. **White-Label Multi-Tenant Engine (Generic Pattern)**: Demonstrates commercial reusability by storing branding, dates, location, and color palettes in the database (`SiteConfig`). Admins can switch the entire platform between *Paisley Christmas Markets*, *Glasgow Autumn Food Fair*, and *Edinburgh Summer Fringe* in one click.
5. **GDPR Compliance Suite**: Granular cookie consent, explicit application consent logging, and a self-service **GDPR Data Portal** enabling traders to export their personal data (JSON) or exercise their Right to Erasure (`DELETE /api/gdpr/erase`).

---

## Quick Start (Windows Terminal / PowerShell)

### 1. Install Dependencies
Open Windows Terminal in the project root folder and run:
```powershell
npm run install:all
```

### 2. Start Backend Server (Terminal 1)
```powershell
npm run dev:server
```
- Runs on `http://localhost:5000`
- **Zero-Config Database**: If `MONGODB_URI` is not set in `server/.env`, the server automatically runs a persistent local JSON database (`server/data/local-db.json`) so you can test immediately. To connect to **MongoDB Atlas**, copy `server/.env.example` to `server/.env` and paste your Atlas URI.

### 3. Start Frontend App (Terminal 2)
```powershell
npm run dev:client
```
- Runs on `http://localhost:5173`

---

## Demo Admin Credentials
- **Email:** `admin@paisleymarkets.co.uk`
- **Password:** `Paisley2026!`

## Cloud Deployment Guide (Free Tier)
1. **Database**: Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) and copy the connection string.
2. **Backend (Render)**: Connect your GitHub repo on [Render](https://render.com), set Root Directory to `server`, Build Command `npm install`, Start Command `npm start`, and add environment variables `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN`.
3. **Frontend (Vercel)**: Connect your GitHub repo on [Vercel](https://vercel.com), set Root Directory to `client`, Framework `Vite`, and add environment variable `VITE_API_URL=https://<your-render-app>.onrender.com/api`.
