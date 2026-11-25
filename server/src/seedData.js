export const EVENT_PRESETS = {
  paisley_christmas: {
    presetKey: "paisley_christmas",
    brandName: "Paisley Winter Fair",
    eventTitle: "Paisley Christmas Markets",
    tagline: "Artisan Craft, Mulled Spice & Heritage Beneath the Abbey",
    location: "Paisley Abbey & County Square, Renfrewshire",
    dates: "27 Nov — 24 Dec 2026",
    openingHours: "Daily 11:00 — 21:00 (Fri–Sat until 22:00)",
    heroHeadline: "Winter Magic Woven in Paisley",
    heroSubheadline: "Discover 12 curated timber chalets of Scottish gastronomy, handcrafted woollens, and festive music framed by the historic 12th-century Paisley Abbey.",
    theme: {
      accent: "#C9A66B",
      secondary: "#6B1D2A",
      surfaceDark: "#0D1F1A",
      badgeText: "2026 Heritage Edition"
    }
  },
  glasgow_autumn: {
    presetKey: "glasgow_autumn",
    brandName: "Clyde Harvest Collective",
    eventTitle: "Glasgow Autumn Food Fair",
    tagline: "Small-Batch Roasters, Highland Produce & Craft Cider",
    location: "Kelvingrove Bandstand & West End Esplanade",
    dates: "09 Oct — 25 Oct 2026",
    openingHours: "Daily 10:00 — 20:00",
    heroHeadline: "A Celebration of Scottish Harvest",
    heroSubheadline: "Demonstrating our white-label platform architecture: instant brand, theme, and venue reconfiguration for seasonal food & drink festivals.",
    theme: {
      accent: "#D4884A",
      secondary: "#5C2C16",
      surfaceDark: "#1B1410",
      badgeText: "White-Label Demo · Autumn"
    }
  },
  edinburgh_fringe: {
    presetKey: "edinburgh_fringe",
    brandName: "Lothian Makers Guild",
    eventTitle: "Edinburgh Summer Makers Market",
    tagline: "Independent Design, Vinyl, Street Food & Live Acoustic Sets",
    location: "George Square Gardens, Edinburgh",
    dates: "07 Aug — 31 Aug 2026",
    openingHours: "Daily 10:00 — 22:00",
    heroHeadline: "Curated Makers in the Festival City",
    heroSubheadline: "Powered by the same core multi-tenant codebase — tailored for high-footfall summer cultural markets with zero redeployment.",
    theme: {
      accent: "#D9B45B",
      secondary: "#2C3566",
      surfaceDark: "#101626",
      badgeText: "White-Label Demo · Summer"
    }
  }
};

export const INITIAL_CHALETS = [
  { code: "A1", zone: "Abbey Gastronomy Row", category: "Food & Drink", size: "4m x 3m", fee: 650, utilities: ["32A Power", "Fresh Water", "Waste"], x: 115, y: 120, status: "booked" },
  { code: "A2", zone: "Abbey Gastronomy Row", category: "Food & Drink", size: "4m x 3m", fee: 650, utilities: ["32A Power", "Fresh Water"], x: 235, y: 120, status: "booked" },
  { code: "A3", zone: "Abbey Gastronomy Row", category: "Food & Drink", size: "4m x 3m", fee: 650, utilities: ["32A Power", "Fresh Water"], x: 355, y: 120, status: "available" },
  { code: "A4", zone: "Abbey Gastronomy Row", category: "Food & Drink", size: "4m x 3m", fee: 680, utilities: ["32A Power", "Fresh Water", "Corner Pitch"], x: 475, y: 120, status: "pending" },

  { code: "B1", zone: "Paisley Loom Artisan Quarter", category: "Artisan & Crafts", size: "3m x 3m", fee: 450, utilities: ["16A Power", "Ambient Lighting"], x: 115, y: 270, status: "booked" },
  { code: "B2", zone: "Paisley Loom Artisan Quarter", category: "Artisan & Crafts", size: "3m x 3m", fee: 450, utilities: ["16A Power", "Ambient Lighting"], x: 235, y: 270, status: "available" },
  { code: "B3", zone: "Paisley Loom Artisan Quarter", category: "Artisan & Crafts", size: "3m x 3m", fee: 450, utilities: ["16A Power", "Ambient Lighting"], x: 355, y: 270, status: "booked" },
  { code: "B4", zone: "Paisley Loom Artisan Quarter", category: "Artisan & Crafts", size: "3m x 3m", fee: 450, utilities: ["16A Power", "Ambient Lighting"], x: 475, y: 270, status: "available" },

  { code: "C1", zone: "County Square Promenade", category: "Gifts & Heritage", size: "3m x 2.5m", fee: 520, utilities: ["16A Power", "High Footfall"], x: 155, y: 405, status: "booked" },
  { code: "C2", zone: "County Square Promenade", category: "Gifts & Heritage", size: "3m x 2.5m", fee: 520, utilities: ["16A Power", "High Footfall"], x: 295, y: 405, status: "available" },
  { code: "C3", zone: "County Square Promenade", category: "Seasonal & Floristry", size: "3m x 2.5m", fee: 520, utilities: ["16A Power", "High Footfall"], x: 435, y: 405, status: "available" }
];

export const INITIAL_TRADERS = [
  {
    id: "TRD-2026-101",
    referenceCode: "PCM-8841",
    businessName: "Clyde & Clove Glühwein House",
    contactName: "Callum MacLeod",
    email: "callum@clydeclove.co.uk",
    phone: "+44 7700 900112",
    category: "Food & Drink",
    chaletCode: "A1",
    description: "Small-batch spiced Scottish berry glühwein, non-alcoholic orchard punch, and warm buttered shortbread baked hourly.",
    signatureItem: "Highland Bramble Mulled Wine (£6.50)",
    hygieneCertified: true,
    publicLiabilityInsurance: true,
    gdprConsent: true,
    status: "approved",
    createdAt: "2026-11-02T10:15:00.000Z"
  },
  {
    id: "TRD-2026-102",
    referenceCode: "PCM-8842",
    businessName: "Abbey Hearth Bratwurst & Venison",
    contactName: "Hannah Weber",
    email: "hannah@abbeyhearth.co.uk",
    phone: "+44 7700 900245",
    category: "Food & Drink",
    chaletCode: "A2",
    description: "Nuremberg-style charcoal-grilled bratwurst paired with Argyll venison sliders and homemade juniper sauerkraut.",
    signatureItem: "Smoked Argyll Venison Brioche (£8.50)",
    hygieneCertified: true,
    publicLiabilityInsurance: true,
    gdprConsent: true,
    status: "approved",
    createdAt: "2026-11-04T14:20:00.000Z"
  },
  {
    id: "TRD-2026-103",
    referenceCode: "PCM-8843",
    businessName: "Thread & Teardrop Cashmere",
    contactName: "Fiona Henderson",
    email: "fiona@threadteardrop.co.uk",
    phone: "+44 7700 900399",
    category: "Artisan & Crafts",
    chaletCode: "B1",
    description: "Contemporary jacquard scarves and winter wraps inspired by the historic 19th-century Paisley shawl archives.",
    signatureItem: "Heritage Paisley Lambswool Scarf (£48)",
    hygieneCertified: false,
    publicLiabilityInsurance: true,
    gdprConsent: true,
    status: "approved",
    createdAt: "2026-11-05T09:30:00.000Z"
  },
  {
    id: "TRD-2026-104",
    referenceCode: "PCM-8844",
    businessName: "Renfrewshire Beeswax & Pine",
    contactName: "Ewan Kerr",
    email: "ewan@beeswaxpine.co.uk",
    phone: "+44 7700 900418",
    category: "Artisan & Crafts",
    chaletCode: "B3",
    description: "Hand-poured Scottish heather beeswax candles, cedarwood diffusers, and hand-turned ash wood candle holders.",
    signatureItem: "Winter Pine & Clove Vessel (£22)",
    hygieneCertified: false,
    publicLiabilityInsurance: true,
    gdprConsent: true,
    status: "approved",
    createdAt: "2026-11-08T16:45:00.000Z"
  },
  {
    id: "TRD-2026-105",
    referenceCode: "PCM-8845",
    businessName: "Lochside Copper & Slate Studio",
    contactName: "Maeve Gallagher",
    email: "maeve@lochsidecopper.co.uk",
    phone: "+44 7700 900512",
    category: "Gifts & Heritage",
    chaletCode: "C1",
    description: "Hand-engraved Scottish slate coasters, hammered copper ornaments, and bespoke calligraphy baubles.",
    signatureItem: "Paisley Abbey Etched Slate Set (£28)",
    hygieneCertified: false,
    publicLiabilityInsurance: true,
    gdprConsent: true,
    status: "approved",
    createdAt: "2026-11-10T11:10:00.000Z"
  },
  {
    id: "TRD-2026-106",
    referenceCode: "PCM-9001",
    businessName: "Stollen & Sourdough Bakery",
    contactName: "Lukas Bauer",
    email: "lukas@stollensourdough.co.uk",
    phone: "+44 7700 900677",
    category: "Food & Drink",
    chaletCode: "A4",
    description: "Traditional Dresden marzipan stollen, cardamom knots, and organic dark rye sourdough loaves baked fresh each morning.",
    signatureItem: "Artisan Marzipan Stollen Loaf (£14)",
    hygieneCertified: true,
    publicLiabilityInsurance: true,
    gdprConsent: true,
    status: "pending",
    createdAt: "2026-11-22T18:05:00.000Z"
  }
];
