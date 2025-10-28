const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Shops-Datenbank
const SHOPS_DATA = [
  {
    id: 1,
    name: "Zalando",
    url: "https://www.zalando.de",
    affiliate_link: "https://www.zalando.de/?partner=IHRE_ID",
    categories: ["Allrounder", "Bekleidung", "Schuhe"],
    rating: 4.8,
    shipping: "Kostenlos ab 29€",
    return_days: 100,
    logo: "zalando_logo.png",
    description: "Größter Online-Shop für Schuhe und Mode in Deutschland"
  },
  {
    id: 2,
    name: "About You",
    url: "https://www.aboutyou.de",
    affiliate_link: "https://www.aboutyou.de/?partner=IHRE_ID",
    categories: ["Allrounder", "Junge Mode", "Streetwear"],
    rating: 4.7,
    shipping: "Kostenlos ab 29€",
    return_days: 30,
    logo: "aboutyou_logo.png",
    description: "Personalisierte Mode-Empfehlungen für junge Leute"
  },
  {
    id: 3,
    name: "Otto",
    url: "https://www.otto.de",
    affiliate_link: "https://www.otto.de/?partner=IHRE_ID",
    categories: ["Allrounder", "Familie", "Haushalt"],
    rating: 4.5,
    shipping: "Kostenlos ab 50€",
    return_days: 30,
    logo: "otto_logo.png",
    description: "Traditioneller Versandhändler mit großem Sortiment"
  },
  {
    id: 4,
    name: "H&M",
    url: "https://www2.hm.com/de_de",
    affiliate_link: "https://www2.hm.com/de_de/?partner=IHRE_ID",
    categories: ["Allrounder", "Fast Fashion", "Basic"],
    rating: 4.3,
    shipping: "Kostenlos ab 29€",
    return_days: 30,
    logo: "hm_logo.png",
    description: "Internationaler Fast-Fashion-Riese mit günstigen Preisen"
  },
  {
    id: 5,
    name: "Amazon Fashion",
    url: "https://www.amazon.de/fashion",
    affiliate_link: "https://www.amazon.de/fashion/?tag=IHRE_ID",
    categories: ["Allrounder", "Marketplace", "Verschiedene"],
    rating: 4.6,
    shipping: "Prime: Kostenlos 1-Tag",
    return_days: 30,
    logo: "amazon_logo.png",
    description: "Riesige Auswahl über Marketplace-Händler"
  },
  {
    id: 6,
    name: "Snipes",
    url: "https://www.snipes.com",
    affiliate_link: "https://www.snipes.com/?partner=IHRE_ID",
    categories: ["Sport", "Streetwear", "Sneaker"],
    rating: 4.4,
    shipping: "Kostenlos ab 50€",
    return_days: 30,
    logo: "snipes_logo.png",
    description: "Streetwear und Sneaker-Spezialist"
  },
  {
    id: 7,
    name: "Asos",
    url: "https://www.asos.com/de",
    affiliate_link: "https://www.asos.com/de/?partner=IHRE_ID",
    categories: ["Allrounder", "Junge Mode", "International"],
    rating: 4.2,
    shipping: "Kostenlos ab 25€",
    return_days: 28,
    logo: "asos_logo.png",
    description: "Britischer Mode-Onlinehändler mit großer Auswahl"
  },
  {
    id: 8,
    name: "Urban Outfitters",
    url: "https://www.urbanoutfitters.com/de",
    affiliate_link: "https://www.urbanoutfitters.com/de/?partner=IHRE_ID",
    categories: ["Premium", "Hipster", "Lifestyle"],
    rating: 4.1,
    shipping: "Kostenlos ab 50€",
    return_days: 30,
    logo: "urban_logo.png",
    description: "Trendige Mode und Lifestyle-Produkte"
  },
  {
    id: 9,
    name: "Breuninger",
    url: "https://www.breuninger.com",
    affiliate_link: "https://www.breuninger.com/?partner=IHRE_ID",
    categories: ["Premium", "Luxus", "Designer"],
    rating: 4.7,
    shipping: "Kostenlos ab 100€",
    return_days: 30,
    logo: "breuninger_logo.png",
    description: "Premium-Kaufhaus mit Designer-Marken"
  },
  {
    id: 10,
    name: "Mytheresa",
    url: "https://www.mytheresa.com/de-de",
    affiliate_link: "https://www.mytheresa.com/de-de/?partner=IHRE_ID",
    categories: ["Premium", "Luxus", "Designer"],
    rating: 4.8,
    shipping: "Kostenlos",
    return_days: 30,
    logo: "mytheresa_logo.png",
    description: "Luxus-Mode für Damen und Kinder"
  },
  {
    id: 11,
    name: "Luisaviaroma",
    url: "https://www.luisaviaroma.com/de-de",
    affiliate_link: "https://www.luisaviaroma.com/de-de/?partner=IHRE_ID",
    categories: ["Premium", "Luxus", "Designer"],
    rating: 4.6,
    shipping: "Kostenlos ab 500€",
    return_days: 14,
    logo: "luisaviaroma_logo.png",
    description: "Italienischer Luxus-Modehändler"
  },
  {
    id: 12,
    name: "Deichmann",
    url: "https://www.deichmann.com",
    affiliate_link: "https://www.deichmann.com/?partner=IHRE_ID",
    categories: ["Schuhe", "Günstig", "Familie"],
    rating: 4.3,
    shipping: "Kostenlos ab 30€",
    return_days: 30,
    logo: "deichmann_logo.png",
    description: "Europas größter Schuhhändler"
  },
  {
    id: 13,
    name: "Taschen",
    url: "https://www.taschen.com/de",
    affiliate_link: "https://www.taschen.com/de/?partner=IHRE_ID",
    categories: ["Accessoires", "Luxus", "Taschen"],
    rating: 4.5,
    shipping: "Kostenlos ab 200€",
    return_days: 14,
    logo: "taschen_logo.png",
    description: "Luxus-Handtaschen und Accessoires"
  },
  {
    id: 14,
    name: "Sephora",
    url: "https://www.sephora.de",
    affiliate_link: "https://www.sephora.de/?partner=IHRE_ID",
    categories: ["Beauty", "Accessoires", "Pflege"],
    rating: 4.4,
    shipping: "Kostenlos ab 25€",
    return_days: 30,
    logo: "sephora_logo.png",
    description: "Premium-Beauty-Produkte und Kosmetik"
  },
  {
    id: 15,
    name: "Mediamarkt",
    url: "https://www.mediamarkt.de",
    affiliate_link: "https://www.mediamarkt.de/?partner=IHRE_ID",
    categories: ["Elektronik", "Wearables", "Smartwatches"],
    rating: 4.2,
    shipping: "Kostenlos ab 100€",
    return_days: 30,
    logo: "mediamarkt_logo.png",
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
    
    // Name matching
    if (shop.name.toLowerCase().includes(query)) score += 10;
    
    // Category matching
    if (shop.categories.some(cat => cat.toLowerCase().includes(query))) score += 3;
    
    // Description matching
    if (shop.description.toLowerCase().includes(query)) score += 2;
    
    return { shop, score };
  })
  .filter(result => result.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(result => result.shop);
  
  res.json(results);
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
  console.log(`Server läuft auf http://localhost:${PORT}`);
  console.log('Fashion Shop Comparison App ist bereit!');
});
