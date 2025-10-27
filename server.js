const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// DEUTSCHE SHOP-DATENBANK
const GERMAN_FASHION_SHOPS = [
  {
    id: 'zalando',
    name: 'Zalando',
    url: 'https://www.zalando.de',
    affiliate: true,
    popularity: 95
  },
  {
    id: 'aboutyou', 
    name: 'About You',
    url: 'https://www.aboutyou.de',
    affiliate: true,
    popularity: 90
  },
  {
    id: 'otto',
    name: 'Otto', 
    url: 'https://www.otto.de',
    affiliate: true,
    popularity: 85
  },
  {
    id: 'amazon',
    name: 'Amazon DE',
    url: 'https://www.amazon.de',
    affiliate: true, 
    popularity: 92
  }
];

// PRODUKT-SUCHE ROUTE
app.post('/api/search-product', async (req, res) => {
  const { productName, category, brand, maxPrice } = req.body;
  
  console.log(`🔍 Suche nach: ${productName}`);

  // Simulierte Suchergebnisse (später mit echten APIs)
  const searchResults = await simulateProductSearch(productName, category, brand);
  
  res.json({
    success: true,
    searchQuery: productName,
    results: searchResults,
    totalResults: searchResults.length,
    shops: ['Zalando', 'About You', 'Otto', 'Amazon'],
    message: `🎯 ${searchResults.length} Angebote für "${productName}" gefunden`
  });
});

// Simulierte Produktsuche (für den Anfang)
async function simulateProductSearch(productName, category, brand) {
  // Basierend auf Suchbegriff verschiedene Ergebnisse
  const searchTerm = productName.toLowerCase();
  
  if (searchTerm.includes('jeans') || searchTerm.includes('hose')) {
    return [
      {
        shop: 'Zalando',
        product: 'Calvin Klein Skinny Jeans',
        price: '€89,99',
        originalPrice: '€119,99',
        shipping: 'Kostenlos',
        delivery: '1-2 Tage',
        inStock: true,
        link: 'https://www.zalando.de/calvin-klein-skinny-jeans/',
        image: 'https://img01.ztat.net/article/spp-media-p1/1b9d52b27c394e678db12592a3c6c93a/af19fa4df1184e6bb5f5bdc3d6c4b5c3.jpg',
        badge: 'Bestseller'
      },
      {
        shop: 'About You',
        product: 'CK Skinny Jeans Schwarz',
        price: '€79,99', 
        originalPrice: '€109,99',
        shipping: 'Kostenlos',
        delivery: '2-3 Tage',
        inStock: true,
        link: 'https://www.aboutyou.de/calvin-klein-skinny-jeans/',
        image: 'https://img01.ztat.net/article/spp-media-p1/f1b7d5a7a9b43eb8915b9b2c2d8e8a7a/0d67cfe49d2f4d7c9c45c8c8c8c8c8c8.jpg',
        badge: 'Sale'
      },
      {
        shop: 'Otto',
        product: 'Calvin Klein Jeans Skinny Fit',
        price: '€94,95',
        originalPrice: null,
        shipping: '€4,95',
        delivery: '2-4 Tage', 
        inStock: true,
        link: 'https://www.otto.de/p/calvin-klein-skinny-jeans/',
        image: 'https://i.otto.de/i/otto/12345678/calvin-klein-skinny-jeans.jpg',
        badge: null
      },
      {
        shop: 'Amazon',
        product: 'Calvin Klein Jeans Herren Skinny',
        price: '€74,99',
        originalPrice: '€129,99',
        shipping: 'Kostenlos',
        delivery: 'Morgen',
        inStock: true,
        link: 'https://www.amazon.de/Calvin-Klein-Skinny-Jeans/dp/...',
        image: 'https://m.media-amazon.com/images/I/71VjS8gKf5L._AC_SX569_.jpg',
        badge: 'Schnellste Lieferung'
      }
    ];
  }
  
  if (searchTerm.includes('nike') || searchTerm.includes('schuh')) {
    return [
      {
        shop: 'Zalando',
        product: 'Nike Air Force 1 Weiß',
        price: '€99,95',
        originalPrice: '€129,99',
        shipping: 'Kostenlos',
        delivery: '1-2 Tage',
        inStock: true,
        link: 'https://www.zalando.de/nike-air-force-1/',
        image: 'https://img01.ztat.net/article/spp-media-p1/1b9d52b27c394e678db12592a3c6c93a/af19fa4df1184e6bb5f5bdc3d6c4b5c3.jpg',
        badge: 'Bestseller'
      }
      // ... mehr Sneaker Ergebnisse
    ];
  }
  
  // Standard Ergebnisse
  return [
    {
      shop: 'Zalando',
      product: productName,
      price: '€69,99',
      originalPrice: '€89,99',
      shipping: 'Kostenlos', 
      delivery: '1-2 Tage',
      inStock: true,
      link: `https://www.zalando.de/suche/?q=${encodeURIComponent(productName)}`,
      image: 'https://via.placeholder.com/300x300/EEE/999?text=Produkt',
      badge: 'Gefunden'
    }
  ];
}

// Shop-Liste Route
app.get('/api/german-shops', (req, res) => {
  res.json({
    success: true,
    shops: GERMAN_FASHION_SHOPS
  });
});

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Deutscher Produkt-Preisvergleich läuft!',
    version: '2.0 - Produktsuche'
  });
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log('🚀 Produkt-Preisvergleich läuft auf Port ' + PORT);
});
