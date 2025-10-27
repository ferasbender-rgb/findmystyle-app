const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// Größere Limits für Bilder
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.'));

// DEUTSCHE SHOP-DATENBANK
const GERMAN_FASHION_SHOPS = [
  {
    id: 'zalando',
    name: 'Zalando',
    url: 'https://www.zalando.de',
    logo: 'https://about.zalando.com/sites/default/files/2020-09/Zalando_Logo_2014.svg',
    categories: ['Bekleidung', 'Schuhe', 'Accessoires'],
    shipping: 'Kostenlos ab €20',
    delivery: '1-2 Tage',
    return: '100 Tage',
    affiliate: true,
    popularity: 95
  },
  {
    id: 'aboutyou',
    name: 'About You',
    url: 'https://www.aboutyou.de',
    logo: 'https://cdn.aboutyou.de/assets/header/images/logo-aboutyou.svg',
    categories: ['Young Fashion', 'Streetwear', 'Designer'],
    shipping: 'Kostenlos ab €20',
    delivery: '2-3 Tage',
    return: '30 Tage',
    affiliate: true,
    popularity: 90
  },
  {
    id: 'otto',
    name: 'Otto',
    url: 'https://www.otto.de',
    logo: 'https://www.otto.de/assets/images/otto-logo.svg',
    categories: ['Bekleidung', 'Schuhe', 'Home'],
    shipping: 'Kostenlos ab €50',
    delivery: '2-4 Tage',
    return: '30 Tage',
    affiliate: true,
    popularity: 85
  },
  {
    id: 'hm',
    name: 'H&M',
    url: 'https://www2.hm.com/de_de',
    logo: 'https://logo.clearbit.com/hm.com',
    categories: ['Fast Fashion', 'Basic', 'Sustainable'],
    shipping: '€4,95',
    delivery: '2-3 Tage',
    return: '30 Tage',
    affiliate: false,
    popularity: 88
  },
  {
    id: 'asos',
    name: 'ASOS Deutschland',
    url: 'https://www.asos.de',
    logo: 'https://logo.clearbit.com/asos.com',
    categories: ['Young Fashion', 'International Brands'],
    shipping: '€4,95',
    delivery: '3-5 Tage',
    return: '28 Tage',
    affiliate: true,
    popularity: 80
  },
  {
    id: 'breuninger',
    name: 'Breuninger',
    url: 'https://www.breuninger.de',
    logo: 'https://www.breuninger.com/static/version1698930532/frontend/Breuninger/default/de_DE/images/logo.svg',
    categories: ['Luxury', 'Designer', 'Premium'],
    shipping: '€5,95',
    delivery: '1-2 Tage',
    return: '30 Tage',
    affiliate: true,
    popularity: 75
  }
];

// SHOP-ÜBERSICHT ROUTE
app.get('/api/german-shops', (req, res) => {
  const { category, minPopularity, freeShipping } = req.query;
  
  let shops = GERMAN_FASHION_SHOPS;
  
  // Filter nach Kategorie
  if (category) {
    shops = shops.filter(shop => 
      shop.categories.some(cat => 
        cat.toLowerCase().includes(category.toLowerCase())
      )
    );
  }
  
  // Filter nach Popularität
  if (minPopularity) {
    shops = shops.filter(shop => shop.popularity >= parseInt(minPopularity));
  }
  
  // Filter nach kostenlosem Versand
  if (freeShipping === 'true') {
    shops = shops.filter(shop => shop.shipping.includes('Kostenlos'));
  }
  
  res.json({
    success: true,
    totalShops: shops.length,
    shops: shops.sort((a, b) => b.popularity - a.popularity)
  });
});

// PREISVERGLEICH ROUTE (simuliert)
app.post('/api/price-comparison', (req, res) => {
  const { productName, imageData } = req.body;
  
  console.log(`🔍 Preisvergleich für: ${productName}`);
  
  // Simulierte Preisvergleichsdaten
  const priceComparison = [
    {
      shop: 'Zalando',
      price: '€89,99',
      originalPrice: '€119,99',
      shipping: 'Kostenlos',
      delivery: '1-2 Tage',
      inStock: true,
      link: 'https://www.zalando.de/nike-air-force-1-weiß/',
      badge: 'Bestseller'
    },
    {
      shop: 'About You',
      price: '€84,99',
      originalPrice: '€119,99',
      shipping: 'Kostenlos',
      delivery: '2-3 Tage',
      inStock: true,
      link: 'https://www.aboutyou.de/nike/air-force-1/',
      badge: 'Sale'
    },
    {
      shop: 'Otto',
      price: '€94,95',
      originalPrice: null,
      shipping: '€4,95',
      delivery: '2-4 Tage',
      inStock: true,
      link: 'https://www.otto.de/p/nike-air-force-1/',
      badge: null
    },
    {
      shop: 'Amazon',
      price: '€79,99',
      originalPrice: '€129,99',
      shipping: 'Kostenlos',
      delivery: 'Morgen',
      inStock: true,
      link: 'https://www.amazon.de/Nike-Air-Force-Sneaker/dp/...',
      badge: 'Schnellste Lieferung'
    }
  ];
  
  // Best Deal berechnen
  const bestDeal = priceComparison
    .filter(item => item.inStock)
    .sort((a, b) => {
      const priceA = parseFloat(a.price.replace('€', '').replace(',', '.'));
      const priceB = parseFloat(b.price.replace('€', '').replace(',', '.'));
      return priceA - priceB;
    })[0];
  
  res.json({
    success: true,
    product: productName || 'Ähnliches Produkt',
    searchType: 'preisvergleich',
    priceComparison: priceComparison,
    bestDeal: bestDeal,
    summary: {
      cheapest: priceComparison.reduce((min, item) => 
        parseFloat(item.price.replace('€', '').replace(',', '.')) < 
        parseFloat(min.price.replace('€', '').replace(',', '.')) ? item : min
      ),
      fastest: priceComparison.find(item => item.delivery === 'Morgen') || 
               priceComparison.find(item => item.delivery.includes('1-2'))
    }
  });
});

// BILDANALYSE ROUTE (erweitert)
app.post('/api/analyze-image', (req, res) => {
  console.log('📸 Bildanalyse für deutschen Markt');
  
  res.json({
    success: true,
    results: [
      {
        title: "Nike Air Force 1 '07 Weiß",
        brand: "Nike",
        category: "Sneaker",
        priceComparison: [
          { shop: "Zalando", price: "€89,99", shipping: "Kostenlos" },
          { shop: "About You", price: "€84,99", shipping: "Kostenlos" },
          { shop: "Amazon", price: "€79,99", shipping: "Kostenlos" }
        ],
        bestDeal: { shop: "Amazon", price: "€79,99" },
        image: "https://img01.ztat.net/article/spp-media-p1/1b9d52b27c394e678db12592a3c6c93a/af19fa4df1184e6bb5f5bdc3d6c4b5c3.jpg",
        type: "price_comparison"
      }
    ],
    message: "🎯 Preisvergleich für 3 deutsche Shops"
  });
});

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Deutscher Shop-Preisvergleich läuft!',
    version: '1.0 - German Market Focus',
    features: ['Shop-Datenbank', 'Preisvergleich', 'Bildanalyse']
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'Deutscher Mode-Preisvergleich',
    germanShops: GERMAN_FASHION_SHOPS.length,
    timestamp: new Date().toISOString()
  });
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log('🚀 Deutscher Mode-Preisvergleich läuft auf Port ' + PORT);
  console.log('🛍️  Shop-Datenbank: ' + GERMAN_FASHION_SHOPS.length + ' deutsche Shops');
  console.log('✅ Test: /api/test');
  console.log('🛒 Shop-Liste: /api/german-shops');
});
