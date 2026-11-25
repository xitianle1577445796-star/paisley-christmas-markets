import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { EVENT_PRESETS, INITIAL_CHALETS, INITIAL_TRADERS } from "./seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_PATH = path.join(__dirname, "..", "data", "local-db.json");

// Mongoose Schemas (used when MONGODB_URI is configured)
const siteConfigSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: "active" },
  presetKey: String,
  brandName: String,
  eventTitle: String,
  tagline: String,
  location: String,
  dates: String,
  openingHours: String,
  heroHeadline: String,
  heroSubheadline: String,
  theme: {
    accent: String,
    secondary: String,
    surfaceDark: String,
    badgeText: String
  }
}, { timestamps: true });

const chaletSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  zone: String,
  category: String,
  size: String,
  fee: Number,
  utilities: [String],
  x: Number,
  y: Number,
  status: { type: String, enum: ["available", "pending", "booked"], default: "available" }
});

const traderSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  referenceCode: { type: String, required: true },
  businessName: { type: String, required: true },
  contactName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  category: String,
  chaletCode: { type: String, required: true },
  description: String,
  signatureItem: String,
  hygieneCertified: Boolean,
  publicLiabilityInsurance: Boolean,
  gdprConsent: Boolean,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const SiteConfigModel = mongoose.models.SiteConfig || mongoose.model("SiteConfig", siteConfigSchema);
const ChaletModel = mongoose.models.Chalet || mongoose.model("Chalet", chaletSchema);
const TraderModel = mongoose.models.Trader || mongoose.model("Trader", traderSchema);

let useMongo = false;

function ensureLocalDb() {
  const dir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const seed = {
      config: { key: "active", ...EVENT_PRESETS.paisley_christmas },
      chalets: INITIAL_CHALETS,
      traders: INITIAL_TRADERS
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(seed, null, 2), "utf-8");
  }
}

function readLocal() {
  ensureLocalDb();
  return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf-8"));
}

function writeLocal(data) {
  ensureLocalDb();
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function initDatabase() {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.trim().length > 0 && !uri.includes("<username>")) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      useMongo = true;
      console.log("[DB] Connected to MongoDB successfully.");
      const configCount = await SiteConfigModel.countDocuments();
      if (configCount === 0) {
        await SiteConfigModel.create({ key: "active", ...EVENT_PRESETS.paisley_christmas });
      }
      const chaletCount = await ChaletModel.countDocuments();
      if (chaletCount === 0) {
        await ChaletModel.insertMany(INITIAL_CHALETS);
      }
      const traderCount = await TraderModel.countDocuments();
      if (traderCount === 0) {
        await TraderModel.insertMany(INITIAL_TRADERS);
      }
      return { mode: "mongodb" };
    } catch (err) {
      console.warn("[DB] MongoDB connection failed, falling back to persistent local JSON store:", err.message);
    }
  }
  useMongo = false;
  ensureLocalDb();
  console.log("[DB] Running in zero-config persistent local JSON store mode (server/data/local-db.json).");
  return { mode: "local-json" };
}

export function getDbMode() {
  return useMongo ? "MongoDB Atlas / Container" : "Local Persistent JSON Store";
}

export const db = {
  async getConfig() {
    if (useMongo) {
      return await SiteConfigModel.findOne({ key: "active" }).lean();
    }
    return readLocal().config;
  },

  async updateConfig(payload) {
    if (useMongo) {
      return await SiteConfigModel.findOneAndUpdate(
        { key: "active" },
        { $set: payload },
        { new: true, upsert: true }
      ).lean();
    }
    const store = readLocal();
    store.config = { ...store.config, ...payload, theme: { ...store.config.theme, ...(payload.theme || {}) } };
    writeLocal(store);
    return store.config;
  },

  async getChalets() {
    if (useMongo) {
      return await ChaletModel.find({}).sort({ code: 1 }).lean();
    }
    return readLocal().chalets;
  },

  async getChaletByCode(code) {
    if (useMongo) {
      return await ChaletModel.findOne({ code }).lean();
    }
    return readLocal().chalets.find((c) => c.code === code) || null;
  },

  async updateChaletStatus(code, status) {
    if (useMongo) {
      return await ChaletModel.findOneAndUpdate({ code }, { $set: { status } }, { new: true }).lean();
    }
    const store = readLocal();
    const chalet = store.chalets.find((c) => c.code === code);
    if (chalet) {
      chalet.status = status;
      writeLocal(store);
    }
    return chalet;
  },

  async getTraders(filter = {}) {
    if (useMongo) {
      return await TraderModel.find(filter).sort({ createdAt: -1 }).lean();
    }
    let list = readLocal().traders;
    if (filter.status) {
      list = list.filter((t) => t.status === filter.status);
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getTraderById(id) {
    if (useMongo) {
      return await TraderModel.findOne({ id }).lean();
    }
    return readLocal().traders.find((t) => t.id === id) || null;
  },

  async createTrader(traderObj) {
    if (useMongo) {
      const created = await TraderModel.create(traderObj);
      return created.toObject();
    }
    const store = readLocal();
    store.traders.unshift(traderObj);
    writeLocal(store);
    return traderObj;
  },

  async updateTraderStatus(id, status) {
    if (useMongo) {
      return await TraderModel.findOneAndUpdate({ id }, { $set: { status } }, { new: true }).lean();
    }
    const store = readLocal();
    const trader = store.traders.find((t) => t.id === id);
    if (trader) {
      trader.status = status;
      writeLocal(store);
    }
    return trader;
  },

  async deleteTrader(id) {
    if (useMongo) {
      return await TraderModel.findOneAndDelete({ id }).lean();
    }
    const store = readLocal();
    const idx = store.traders.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const [removed] = store.traders.splice(idx, 1);
    writeLocal(store);
    return removed;
  },

  async findTraderByEmailAndRef(email, referenceCode) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanRef = referenceCode.trim().toUpperCase();
    if (useMongo) {
      return await TraderModel.findOne({
        email: new RegExp(`^${cleanEmail}$`, "i"),
        referenceCode: cleanRef
      }).lean();
    }
    return (
      readLocal().traders.find(
        (t) => t.email.toLowerCase() === cleanEmail && t.referenceCode.toUpperCase() === cleanRef
      ) || null
    );
  }
};
