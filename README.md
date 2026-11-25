# Paisley Christmas Markets — White-Label Seasonal Event Platform (PoC)

> **Live Website (For Assessment):** https://paisley-christmas-markets-nu.vercel.app  
> *(Note: The backend is hosted on Render's free tier. Please allow 30–50 seconds for initial cold-start wake-up on the first visit.)*

- **Module:** COMP10020 Internet Technologies (UWS 2026–27)
- **Assessment:** Coursework 2 — Proof-of-Concept Full-Stack Web Application
- **Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS | Node.js, Express, MongoDB (with zero-config local JSON persistence fallback)

---

## 1. Key Architectural & Commercial Highlights
1. **Scottish Winter Editorial Visual System**: Bespoke design language featuring deep pine green (`#0D1F1A`), warm parchment (`#F7F4EE`), burgundy (`#6B1D2A`), and matte champagne gold (`#C9A66B`), incorporating SVG Paisley Pattern motifs, a Paisley Abbey silhouette, and high-contrast Day/Night themes.
2. **Interactive Abbey Square Chalet Map**: Real-time SVG venue map synced with the backend database. Traders select available chalets directly from the map (auto-filling stall code, zone, utilities, and fee), while visitors explore approved traders by clicking booked chalets.
3. **Live Trader-to-Public Approval Pipeline**: End-to-end database workflow — trader submission locks a chalet as `Pending`; Admin approval immediately publishes the trader to the public directory and updates the interactive map to `Booked`.
4. **White-Label Multi-Tenant Engine (Generic Pattern)**: Demonstrates commercial reusability by storing branding, dates, location, and colour palettes in the database (`SiteConfig`). Admins can switch the entire platform between *Paisley Christmas Markets*, *Glasgow Autumn Food Fair*, and *Edinburgh Summer Fringe* in one click.
5. **GDPR Compliance Suite**: Granular cookie consent, explicit application consent logging, and a self-service **GDPR Data Portal** enabling traders to export their personal data (JSON) or exercise their Right to Erasure (`DELETE /api/gdpr/erase`).

---

## 2. Demo Admin Credentials
Use the following credentials to test the Admin Dashboard, trader approval workflow, and White-Label Template Switcher:
- **Email:** `admin@paisleymarkets.co.uk`
- **Password:** `Paisley2026!`

---

## 3. Production Cloud Architecture (PaaS & CI/CD)
The application uses a decoupled, HTTPS-secured cloud architecture with automated CI/CD linked directly to this GitHub repository:
- **Frontend (Vercel):** Deployed from the `client/` root directory using Vite, connected to the backend API via the `VITE_API_URL` environment variable.
- **Backend (Render):** Deployed from the `server/` root directory running Express (`npm start`), configured with CORS and environment variables (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`).
- **Backend Base URL:** https://paisley-christmas-markets.onrender.com

---

## 4. Core RESTful API Endpoints
- `GET /api/config` — Retrieve active white-label site configuration and theme presets
- `GET /api/chalets` — Fetch real-time chalet availability and booking statuses
- `GET /api/traders` — Retrieve approved public traders for the directory and map
- `POST /api/applications` — Submit a new trader stall application (locks chalet as `Pending`)
- `DELETE /api/gdpr/erase` — Self-service GDPR Right to Erasure for trader records

---

## 5. Local Development Setup

### Step 1: Install Dependencies
Run the following command in the project root directory:
```bash
npm run install:all
Step 2: Start Backend Server (Terminal 1)
Bash
npm run dev:server
Runs on http://localhost:5000

Zero-Config Database: If MONGODB_URI is not set in server/.env, the server automatically falls back to a persistent local JSON database (server/data/local-db.json) for immediate testing. To connect to MongoDB Atlas, copy server/.env.example to server/.env and add your Atlas URI.

Step 3: Start Frontend App (Terminal 2)
Bash
npm run dev:client
Runs on http://localhost:5173
