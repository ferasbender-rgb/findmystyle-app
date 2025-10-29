const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Featured Collections - REDAKTIONELLE INHALTE
const FEATURED_COLLECTIONS = [
  {
    id: 1,
    title: "❄️ Winter-Sale 2024 - Top Deals",
    description: "Die heißesten Winter-Deals handverlesen von unserem Team",
    image: "🎁",
    shops: [1, 2, 4, 6], // IDs von Zalando, About You, H&M, Snipes
    featuredProducts: [
      "Winter-Boots bis 100€",
      "Warme Jacken im Sale", 
      "Winter-Accessoires",
      "Thermo-Kleidung"
    ],
    category: "Sale"
  },
  {
    id: 2,
    title: "🎄 Weihnachtsgeschenke unter 50€",
    description: "Perfekte Geschenkideen die garantiert ankommen",
    image: "✨",
    shops: [3, 5, 12, 14], // Otto, Amazon, Deichmann, Sephora
    featuredProducts: [
      "Designer-Parfum ab 50€",
      "Luxus-Schals im Sale",
      "Beauty-Sets",
      "Stylische Accessoires"
    ],
    category: "Geschenke"
  },
  {
    id: 3,
    title: "🌱 Nachhaltige Mode-Favoriten",
    description: "Bewusst einkaufen mit unseren Nachhaltigkeits-Tipps",
    image: "💚",
    shops: [4, 7, 9], // H&M, Asos, Breuninger
    featuredProducts: [
      "Bio-Baumwolle Basics",
      "Recycelte Materialien",
      "Fair-Trade Mode",
      "Langlebige Qualität"
    ],
    category: "Nachhaltig"
  },
  {
    id: 4,
    title: "👟 Streetwear & Sneaker Hotlist",
    description: "Die angesagtesten Streetwear-Pieces und Sneaker",
    image: "🔥",
    shops: [2, 6, 7, 8], // About You, Snipes, Asos, Urban Outfitters
    featuredProducts: [
      "Limited Sneaker Drops",
      "Urban Streetwear",
      "Trendige Hoodies",
      "Statement Accessoires"
    ],
    category: "Streetwear"
  },
  {
    id: 5,
    title: "💎 Luxus & Designer Highlights",
    description: "Exklusive Designer-Pieces für besondere Anlässe",
    image: "⭐",
    shops: [9, 10, 11, 13], // Breuninger, Mytheresa, Luisaviaroma, Taschen
    featuredProducts: [
      "Designer-Handtaschen",
      "Luxus-Uhren",
      "Premium Beauty",
      "Exklusive Accessoires"
    ],
    category: "Luxus"
  },
  {
    id: 6,
    title: "👔 Business Casual Essentials",
    description: "Perfekte Business-Kleidung für den Office-Alltag",
    image: "💼",
    shops: [1, 3, 9], // Zalando, Otto, Breuninger
    featuredProducts: [
      "Business Hemden",
      "Anzüge & Blazer",
      "Lederschuhe",
      "Elegante Accessoires"
    ],
    category: "Business"
  }
];

// Shops-Datenbank (wie zuvor, aber mit Kategorien erweitert)
const SHOPS_DATA = [
  {
    id: 1,
    name: "Zalando",
    url: "https://www.zalando.de",
    affiliate_link: "https://www.zalando.de/?partner=IHRE_ID",
    categories: ["Allrounder", "Bekleidung", "Schuhe", "Sale", "Business"],
    tags: ["allrounder", "marken", "schuhe", "bekleidung", "sale"],
    rating: 4.8,
    shipping: "Kostenlos ab 29€",
    return_days: 100,
    description: "Größter Online-Shop für Schuhe und Mode in Deutschland",
    collectionMatch: ["Winter-Sale", "Business Casual"]
  },
  {
    id: 2,
    name: "About You",
    url: "https://www.aboutyou.de",
    affiliate_link: "https://www.aboutyou.de/?partner=IHRE_ID",
    categories: ["Allrounder", "Junge Mode", "Streetwear", "Sale"],
    tags: ["junge-mode", "streetwear", "trends", "sale"],
    rating: 4.7,
    shipping: "Kostenlos ab 29€",
    return_days: 30,
    description: "Personalisierte Mode-Empfehlungen für junge Leute",
    collectionMatch: ["Winter-Sale", "Streetwear"]
  },
  // ... Rest der SHOPS_DATA wie zuvor
];

// NEUE API ROUTES FÜR COLLECTIONS
app.get('/api/collections', (req, res) => {
  res.json(FEATURED_COLLECTIONS);
});

app.get('/api/collections/:id', (req, res) => {
  const collectionId = parseInt(req.params.id);
  const collection = FEATURED_COLLECTIONS.find(c => c.id === collectionId);
  
  if (!collection) {
    return res.status(404).json({ error: 'Collection nicht gefunden' });
  }
  
  // Shops für diese Collection finden
  const collectionShops = SHOPS_DATA.filter(shop => 
    collection.shops.includes(shop.id)
  );
  
  res.json({
    ...collection,
    shops: collectionShops
  });
});

// Search redirect zu Collections
app.get('/api/smart-search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  
  // Finde passende Collections für die Suchanfrage
  const matchingCollections = FEATURED_COLLECTIONS.filter(collection => {
    const searchText = (collection.title + ' ' + collection.description + ' ' + collection.featuredProducts.join(' ')).toLowerCase();
    return searchText.includes(query) || 
           collection.featuredProducts.some(product => product.toLowerCase().includes(query));
  });
  
  if (matchingCollections.length > 0) {
    res.json({
      type: "collection_match",
      message: `Wir haben passende Kollektionen für "${query}" gefunden:`,
      results: matchingCollections
    });
  } else {
    // Fallback: Zeige alle Collections
    res.json({
      type: "fallback",
      message: `Entdecke unsere handverlesenen Kollektionen:`,
      results: FEATURED_COLLECTIONS
    });
  }
});

// Bestehende API Routes beibehalten
app.get('/api/shops', (req, res) => {
  res.json(SHOPS_DATA);
});

app.get('/api/shops/category/:category', (req, res) => {
  const category = req.params.category;
  const filteredShops = SHOPS_DATA.filter(shop => 
    shop.categories.some(cat => 
      cat.toLowerCase().includes(category.toLowerCase())
    )
  );
  res.json(filteredShops);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server mit Featured Collections läuft auf http://localhost:${PORT}`);
  console.log('📚 Neue Endpoints:');
  console.log('   GET /api/collections');
  console.log('   GET /api/collections/1');
  console.log('   GET /api/smart-search/winter');
});
