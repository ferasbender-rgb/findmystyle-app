const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Featured Collections
const FEATURED_COLLECTIONS = [
  {
    id: 1,
    title: "❄️ Winter-Sale 2024 - Top Deals",
    description: "Die heißesten Winter-Deals handverlesen von unserem Team",
    image: "🎁",
    shops: [1, 2, 4, 6],
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
    shops: [3, 5, 12, 14],
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
    shops: [4, 7, 9],
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
    shops: [2, 6, 7, 8],
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
    shops: [9, 10, 11, 13],
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
    shops: [1, 3, 9],
    featuredProducts: [
      "Business Hemden",
      "Anzüge & Blazer",
      "Lederschuhe",
      "Elegante Accessoires"
    ],
    category: "Business"
  }
];

// Shops-Datenbank
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
  {
    id: 3,
    name: "Otto",
    url: "https://www.otto.de",
    affiliate_link: "https://www.otto.de/?partner=IHRE_ID",
    categories: ["Allrounder", "Familie", "Haushalt"],
    tags: ["familie", "haushalt", "tradition", "versandhaus", "allrounder"],
    rating: 4.5,
    shipping: "Kostenlos ab 50€",
    return_days: 30,
    description: "Traditioneller Versandhändler mit großem Sortiment"
  },
  {
    id: 4,
    name: "H&M",
    url: "https://www2.hm.com/de_de",
    affiliate_link: "https://www2.hm.com/de_de/?partner=IHRE_ID",
    categories: ["Allrounder", "Fast Fashion", "Basic"],
    tags: ["fast-fashion", "günstig", "basic", "nachhaltig", "family"],
    rating: 4.3,
    shipping: "Kostenlos ab 29€",
    return_days: 30,
    description: "Internationaler Fast-Fashion-Riese mit günstigen Preisen"
  },
  {
    id: 5,
    name: "Amazon Fashion",
    url: "https://www.amazon.de/fashion",
    affiliate_link: "https://www.amazon.de/fashion/?tag=IHRE_ID",
    categories: ["Allrounder", "Marketplace", "Verschiedene"],
    tags: ["marketplace", "schnell-lieferung", "prime", "vielfalt", "allrounder"],
    rating: 4.6,
    shipping: "Prime: Kostenlos 1-Tag",
    return_days: 30,
    description: "Riesige Auswahl über Marketplace-Händler"
  },
  {
    id: 6,
    name: "Snipes",
    url: "https://www.snipes.com",
    affiliate_link: "https://www.snipes.com/?partner=IHRE_ID",
    categories: ["Sport", "Streetwear", "Sneaker"],
    tags: ["sneaker", "streetwear", "sport", "marken", "urban"],
    rating: 4.4,
    shipping: "Kostenlos ab 50€",
    return_days: 30,
    description: "Streetwear und Sneaker-Spezialist"
  },
  {
    id: 7,
    name: "Asos",
    url: "https://www.asos.com/de",
    affiliate_link: "https://www.asos.com/de/?partner=IHRE_ID",
    categories: ["Allrounder", "Junge Mode", "International"],
    tags: ["british", "junge-mode", "international", "trends", "plus-size"],
    rating: 4.2,
    shipping: "Kostenlos ab 25€",
    return_days: 28,
    description: "Britischer Mode-Onlinehändler mit großer Auswahl"
  },
  {
    id: 8,
    name: "Urban Outfitters",
    url: "https://www.urbanoutfitters.com/de",
    affiliate_link: "https://www.urbanoutfitters.com/de/?partner=IHRE_ID",
    categories: ["Premium", "Hipster", "Lifestyle"],
    tags: ["hipster", "lifestyle", "design", "wohnen", "premium"],
    rating: 4.1,
    shipping: "Kostenlos ab 50€",
    return_days: 30,
    description: "Trendige Mode und Lifestyle-Produkte"
  },
  {
    id: 9,
    name: "Breuninger",
    url: "https://www.breuninger.com",
    affiliate_link: "https://www.breuninger.com/?partner=IHRE_ID",
    categories: ["Premium", "Luxus", "Designer"],
    tags: ["luxus", "designer", "premium", "kaufhaus", "exklusiv"],
    rating: 4.7,
    shipping: "Kostenlos ab 100€",
    return_days: 30,
    description: "Premium-Kaufhaus mit Designer-Marken"
  },
  {
    id: 10,
    name: "Mytheresa",
    url: "https://www.mytheresa.com/de-de",
    affiliate_link: "https://www.mytheresa.com/de-de/?partner=IHRE_ID",
    categories: ["Premium", "Luxus", "Designer"],
    tags: ["luxus", "designer", "high-fashion", "damen", "exklusiv"],
    rating: 4.8,
    shipping: "Kostenlos",
    return_days: 30,
    description: "Luxus-Mode für Damen und Kinder"
  },
  {
    id: 11,
    name: "Luisaviaroma",
    url: "https://www.luisaviaroma.com/de-de",
    affiliate_link: "https://www.luisaviaroma.com/de-de/?partner=IHRE_ID",
    categories: ["Premium", "Luxus", "Designer"],
    tags: ["luxus", "italienisch", "designer", "high-end", "international"],
    rating: 4.6,
    shipping: "Kostenlos ab 500€",
    return_days: 14,
    description: "Italienischer Luxus-Modehändler"
  },
  {
    id: 12,
    name: "Deichmann",
    url: "https://www.deichmann.com",
    affiliate_link: "https://www.deichmann.com/?partner=IHRE_ID",
    categories: ["Schuhe", "Günstig", "Familie"],
    tags: ["schuhe", "günstig", "familie", "sport", "accessoires"],
    rating: 4.3,
    shipping: "Kostenlos ab 30€",
    return_days: 30,
    description: "Europas größter Schuhhändler"
  },
  {
    id: 13,
    name: "Taschen",
    url: "https://www.taschen.com/de",
    affiliate_link: "https://www.taschen.com/de/?partner=IHRE_ID",
    categories: ["Accessoires", "Luxus", "Taschen"],
    tags: ["accessoires", "luxus", "leder", "marken", "qualität"],
    rating: 4.5,
    shipping: "Kostenlos ab 200€",
    return_days: 14,
    description: "Luxus-Handtaschen und Accessoires"
  },
  {
    id: 14,
    name: "Sephora",
    url: "https://www.sephora.de",
    affiliate_link: "https://www.sephora.de/?partner=IHRE_ID",
    categories: ["Beauty", "Accessoires", "Pflege"],
    tags: ["beauty", "kosmetik", "pflege", "luxus", "marken"],
    rating: 4.4,
    shipping: "Kostenlos ab 25€",
    return_days: 30,
    description: "Premium-Beauty-Produkte und Kosmetik"
  },
  {
    id: 15,
    name: "Mediamarkt",
    url: "https://www.mediamarkt.de",
    affiliate_link: "https://www.mediamarkt.de/?partner=IHRE_ID",
    categories: ["Elektronik", "Wearables", "Smartwatches"],
    tags: ["elektronik", "wearables", "smartwatch", "technik", "schnell-lieferung"],
    rating: 4.2,
    shipping: "Kostenlos ab 100€",
    return_days: 30,
    description: "Elektronik-Händler mit Smartwatches & Wearables"
  }
];

// API Routes
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

app.get('/api/shops/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  
  const results = SHOPS_DATA.map(shop => {
    let score = 0;
    
    if (shop.name.toLowerCase().includes(query)) score += 10;
    if (shop.categories.some(cat => cat.toLowerCase().includes(query))) score += 3;
    if (shop.tags.some(tag => tag.toLowerCase().includes(query))) score += 2;
    
    return { shop, score };
  })
  .filter(result => result.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(result => result.shop);
  
  res.json(results);
});

app.get('/api/collections', (req, res) => {
  res.json(FEATURED_COLLECTIONS);
});

app.get('/api/collections/:id', (req, res) => {
  const collectionId = parseInt(req.params.id);
  const collection = FEATURED_COLLECTIONS.find(c => c.id === collectionId);
  
  if (!collection) {
    return res.status(404).json({ error: 'Collection nicht gefunden' });
  }
  
  const collectionShops = SHOPS_DATA.filter(shop => 
    collection.shops.includes(shop.id)
  );
  
  res.json({
    ...collection,
    shops: collectionShops
  });
});

app.get('/api/smart-search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  
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
    res.json({
      type: "fallback",
      message: `Entdecke unsere handverlesenen Kollektionen:`,
      results: FEATURED_COLLECTIONS
    });
  }
});

// FEEDBACK ROUTE
app.post('/api/feedback', (req, res) => {
  const { rating, comment, page } = req.body;
  
  console.log('📝 NEUES FEEDBACK:');
  console.log('   Bewertung:', rating + '/4');
  console.log('   Kommentar:', comment || 'Kein Kommentar');
  console.log('   Seite:', page);
  console.log('   Zeit:', new Date().toISOString());
  console.log('---');
  
  res.json({ 
    success: true, 
    message: 'Feedback gespeichert!',
    feedbackId: Date.now()
  });
});

app.get('/api/shops/:id', (req, res) => {
  const shopId = parseInt(req.params.id);
  const shop = SHOPS_DATA.find(s => s.id === shopId);
  
  if (!shop) {
    return res.status(404).json({ error: 'Shop nicht gefunden' });
  }
  
  res.json(shop);
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server mit Feedback-System läuft auf http://localhost:${PORT}`);
});
