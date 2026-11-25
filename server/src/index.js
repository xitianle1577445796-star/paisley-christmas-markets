import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { initDatabase, getDbMode, db } from "./db.js";
import { EVENT_PRESETS } from "./seedData.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "paisley_winter_editorial_secret_2026";

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

// Demo admin account with bcrypt hash (Password: Paisley2026!)
const ADMIN_EMAIL = "admin@paisleymarkets.co.uk";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "Paisley2026!", 10);

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session token." });
  }
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: getDbMode(), timestamp: new Date().toISOString() });
});

// 1. White-label Site Config
app.get("/api/config", async (req, res) => {
  try {
    const config = await db.getConfig();
    res.json({ config, presets: Object.values(EVENT_PRESETS), database: getDbMode() });
  } catch (err) {
    res.status(500).json({ error: "Failed to load site configuration." });
  }
});

app.put("/api/admin/config", requireAdmin, async (req, res) => {
  try {
    const { presetKey, ...customFields } = req.body;
    let payload = customFields;
    if (presetKey && EVENT_PRESETS[presetKey] && Object.keys(customFields).length === 0) {
      payload = EVENT_PRESETS[presetKey];
    }
    const updated = await db.updateConfig(payload);
    res.json({ message: "Site configuration updated.", config: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update site configuration." });
  }
});

// 2. Interactive Chalet Map
app.get("/api/chalets", async (req, res) => {
  try {
    const chalets = await db.getChalets();
    const approvedTraders = await db.getTraders({ status: "approved" });
    const traderByChalet = Object.fromEntries(approvedTraders.map((t) => [t.chaletCode, {
      id: t.id,
      businessName: t.businessName,
      category: t.category,
      description: t.description,
      signatureItem: t.signatureItem
    }]));

    const enriched = chalets.map((c) => ({
      ...c,
      trader: traderByChalet[c.code] || null
    }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Failed to load chalet map data." });
  }
});

// 3. Public Approved Traders Directory (GDPR: strips private contact phone/email)
app.get("/api/traders", async (req, res) => {
  try {
    const traders = await db.getTraders({ status: "approved" });
    const publicSafe = traders.map((t) => ({
      id: t.id,
      businessName: t.businessName,
      category: t.category,
      chaletCode: t.chaletCode,
      description: t.description,
      signatureItem: t.signatureItem,
      hygieneCertified: t.hygieneCertified,
      createdAt: t.createdAt
    }));
    res.json(publicSafe);
  } catch (err) {
    res.status(500).json({ error: "Failed to load market traders." });
  }
});

// 4. Trader Application Submission (Locks selected chalet as 'pending')
app.post("/api/traders/apply", async (req, res) => {
  try {
    const {
      businessName,
      contactName,
      email,
      phone,
      category,
      chaletCode,
      description,
      signatureItem,
      hygieneCertified,
      publicLiabilityInsurance,
      gdprConsent
    } = req.body;

    if (!businessName || !contactName || !email || !chaletCode || !description) {
      return res.status(400).json({ error: "Please complete all required fields." });
    }
    if (!gdprConsent) {
      return res.status(400).json({ error: "Explicit GDPR data processing consent is required." });
    }
    if (!publicLiabilityInsurance) {
      return res.status(400).json({ error: "Public liability insurance confirmation is mandatory for market traders." });
    }

    const chalet = await db.getChaletByCode(chaletCode);
    if (!chalet) {
      return res.status(404).json({ error: "Selected chalet does not exist." });
    }
    if (chalet.status !== "available") {
      return res.status(409).json({ error: `Chalet ${chaletCode} is currently ${chalet.status}. Please select an available pitch.` });
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const traderObj = {
      id: `TRD-2026-${Date.now().toString().slice(-4)}`,
      referenceCode: `PCM-${randomDigits}`,
      businessName: businessName.trim(),
      contactName: contactName.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || "").trim(),
      category: category || chalet.category,
      chaletCode,
      description: description.trim(),
      signatureItem: (signatureItem || "Seasonal Artisan Specialty").trim(),
      hygieneCertified: Boolean(hygieneCertified),
      publicLiabilityInsurance: Boolean(publicLiabilityInsurance),
      gdprConsent: true,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    await db.createTrader(traderObj);
    await db.updateChaletStatus(chaletCode, "pending");

    res.status(201).json({
      message: "Application submitted successfully. Your chalet is now reserved pending administrator review.",
      referenceCode: traderObj.referenceCode,
      application: traderObj
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit trader application." });
  }
});

// 5. Admin Authentication
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const emailMatch = email.trim().toLowerCase() === ADMIN_EMAIL;
  const passMatch = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
  if (!emailMatch || !passMatch) {
    return res.status(401).json({ error: "Invalid administrator credentials." });
  }
  const token = jwt.sign({ email: ADMIN_EMAIL, role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, admin: { email: ADMIN_EMAIL, role: "Market Director" } });
});

// 6. Admin Trader Management (Full Pipeline)
app.get("/api/admin/traders", requireAdmin, async (req, res) => {
  try {
    const traders = await db.getTraders();
    res.json(traders);
  } catch {
    res.status(500).json({ error: "Failed to fetch applications." });
  }
});

app.patch("/api/admin/traders/:id/status", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }
    const existing = await db.getTraderById(id);
    if (!existing) {
      return res.status(404).json({ error: "Trader application not found." });
    }

    const updated = await db.updateTraderStatus(id, status);
    const chaletNextStatus = status === "approved" ? "booked" : status === "pending" ? "pending" : "available";
    await db.updateChaletStatus(existing.chaletCode, chaletNextStatus);

    res.json({ message: `Application marked as ${status}.`, trader: updated });
  } catch {
    res.status(500).json({ error: "Failed to update application status." });
  }
});

app.delete("/api/admin/traders/:id", requireAdmin, async (req, res) => {
  try {
    const removed = await db.deleteTrader(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: "Trader record not found." });
    }
    await db.updateChaletStatus(removed.chaletCode, "available");
    res.json({ message: "Trader record permanently deleted and chalet released." });
  } catch {
    res.status(500).json({ error: "Failed to delete trader record." });
  }
});

// 7. GDPR Self-Service Portal (Right of Access & Right to Erasure)
app.post("/api/gdpr/export", async (req, res) => {
  const { email, referenceCode } = req.body;
  if (!email || !referenceCode) {
    return res.status(400).json({ error: "Email and application reference code are required." });
  }
  const trader = await db.findTraderByEmailAndRef(email, referenceCode);
  if (!trader) {
    return res.status(404).json({ error: "No matching record found for that email and reference code." });
  }
  res.json({
    gdprNotice: "Exported under UK GDPR Article 15 (Right of Access).",
    exportedAt: new Date().toISOString(),
    personalData: trader
  });
});

app.delete("/api/gdpr/erase", async (req, res) => {
  const { email, referenceCode } = req.body;
  if (!email || !referenceCode) {
    return res.status(400).json({ error: "Email and application reference code are required." });
  }
  const trader = await db.findTraderByEmailAndRef(email, referenceCode);
  if (!trader) {
    return res.status(404).json({ error: "No matching record found." });
  }
  await db.deleteTrader(trader.id);
  await db.updateChaletStatus(trader.chaletCode, "available");
  res.json({
    message: "Your personal data and application have been permanently erased under UK GDPR Article 17 (Right to Erasure)."
  });
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`[SERVER] Paisley Markets API running on http://localhost:${PORT}`);
  });
});
