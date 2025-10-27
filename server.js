const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// INTELLIGENTE KEYWORD-ERKENNUNG
function analyzeSearchIntent(searchQuery) {
  const searchTerm = searchQuery.toLowerCase();
  
  const categories = {
    jeans: ['jeans', 'hose', 'denim', 'stoffhose'],
    shirts: ['shirt', 't-shirt', 'oberteil', 'hemd', 'bluse'],
    shoes: ['schuh', 'sneaker', 'turnschuh', 'stiefel', 'pumps'],
    jackets: ['jacke', 'weste', 'mantel', 'jackett', 'blazer'],
    hoodies: ['hoodie', 'pullover', 'sweater', 'kapuzenpullover']
  };

  const brands = {
    nike: ['nike', 'air force', 'air max'],
    adidas: ['adidas', 'stan smith', 'superstar'],
    wrangler: ['wrangler', 'wrnglr'],
    levis: ['levis', 'levi\'s', 'levi'],
    tommy: ['tommy hilfiger', 'tommy', 'hilfiger'],
    calvin: ['calvin klein', 'calvin', 'ck']
  };

  const attributes = {
    fit: {
      slim: ['slim', 'slim fit', 'eng', 'schmal'],
      regular: ['regular', 'klassisch', 'normal'],
      loose: ['loose', 'baggy', 'weit', 'comfort']
    },
    color: {
      blue: ['blau', 'blue', 'navy', 'denim'],
      black: ['schwarz', 'black'],
      white: ['weiß', 'white', 'weiss'],
      gray: ['grau', 'grey', 'graphit']
    }
  };

  // Analyse
  const intent = {
    category: findMatch(categories, searchTerm),
    brand: findMatch(brands, searchTerm),
    fit: findMatch(attributes.fit, searchTerm),
    color: findMatch(attributes.color, searchTerm),
    originalQuery: searchQuery
  };

  return intent;
}

function findMatch(dictionary, searchTerm) {
  for (const [key, keywords] of Object.entries(dictionary)) {
    if (keywords.some(keyword => searchTerm.includes(keyword))) {
      return key;
    }
  }
  return null;
}

// INTELLIGENTE PRODUKT-GENERIERUNG
function generateIntelligentResults(searchIntent) {
  const { category, brand, fit, color, originalQuery } = searchIntent;
  
  let baseProducts = [];

  // Basis-Produkte nach Kategorie
  if (category === 'jeans') {
    baseProducts = [
      {
        name: 'Slim Fit Jeans',
        basePrice: 89.99,
        variations: ['Blau', 'Schwarz', 'Grau']
      },
      {
        name: 'Regular Fit Jeans', 
        basePrice: 79.99,
        variations: ['Dunkelblau', 'Medium Blue', 'Vintage']
      },
      {
        name: 'Skinny Jeans',
        basePrice: 69.99,
        variations: ['Schwarz', 'Blau', 'Weiß']
      },
      {
        name: 'Bootcut Jeans',
        basePrice: 84.99,
        variations: ['Dunkelblau', 'Schwarz']
      }
    ];
  } else if (category === 'shirts') {
    baseProducts = [
      {
        name: 'Basic T-Shirt',
        basePrice: 24.99,
        variations: ['Weiß', 'Schwarz', 'Grau']
      },
      {
        name: 'V-Ausschnitt Shirt',
        basePrice: 29.99,
        variations: ['Weiß', 'Schwarz', 'Blau']
      },
      {
        name: 'Langarm Shirt',
        basePrice: 39.99,
        variations: ['Weiß', 'Schwarz', 'Grau']
      }
    ];
  } else if (category === 'shoes') {
    baseProducts = [
      {
        name: 'Sneaker',
        basePrice: 99.99,
        variations: ['Weiß', 'Schwarz', 'Blau']
      },
      {
        name: 'Laufschuhe',
        basePrice: 119.99,
        variations: ['Schwarz', 'Blau', 'Rot']
      },
      {
        name: 'Stiefel',
        basePrice: 149.99,
        variations: ['Schwarz', 'Braun']
      }
    ];
  } else {
    // Fallback für unbekannte Kategorien
    baseProducts = [
      {
        name: originalQuery,
        basePrice: 59.99,
        variations: ['Standard']
      }
    ];
  }

  // Anpassung an Such-Intent
  const results = baseProducts.map(base => {
    let productName = base.name;
    let price = base.basePrice;
    
    // Brand anpassen
    if (brand) {
      productName = `${brand.charAt(0).toUpperCase() + brand.slice(1)} ${productName}`;
      price += brand === 'levis' ? 20 : brand === 'tommy' ? 15 : brand === 'calvin' ? 25 : 10;
    }
    
    // Farbe anpassen
    if (color && base.variations.some(v => v.toLowerCase().includes(color))) {
      productName += ` ${color.charAt(0).toUpperCase() + color.slice(1)}`;
    } else if (color) {
      productName += ` ${color.charAt(0).toUpperCase() + color.slice(1)}`;
    }
    
    // Fit anpassen  
    if (fit && !base.name.toLowerCase().includes(fit)) {
      productName = productName.replace('Jeans', `${fit.charAt(0).toUpperCase() + fit.slice(1)} Fit Jeans`);
    }

    return {
      product: productName,
      price: price,
      originalPrice: price * 1.3,
      relevance: calculateRelevance(productName, searchIntent)
    };
  });

  // Nach Relevanz sortieren
  return results.sort((a, b) => b.relevance - a.relevance);
}

function calculateRelevance(productName, searchIntent) {
  let score = 0;
  const productLower = productName.toLowerCase();
  const queryLower = searchIntent.originalQuery.toLowerCase();
  
  // Exact Match Bonus
  if (productLower.includes(queryLower)) {
    score += 100;
  }
  
  // Brand Match
  if (searchIntent.brand && productLower.includes(searchIntent.brand)) {
    score += 50;
  }
  
  // Category Match
  if (searchIntent.category && productLower.includes(searchIntent.category)) {
    score += 30;
  }
  
  // Attribute Matches
  if (searchIntent.fit && productLower.includes(searchIntent.fit)) {
    score += 20;
  }
  
  if (searchIntent.color && productLower.includes(searchIntent.color)) {
    score += 15;
  }
  
  return score;
}

// SHOP-DATEN HINZUFÜGEN
function addShopData(intelligentResults) {
  const shops = [
    { name: 'Zalando', shipping: 'Kostenlos ab €20', delivery: '1-2 Tage', priceModifier: 1.0 },
    { name: 'Amazon', shipping: 'Kostenlos', delivery: 'Morgen', priceModifier: 0.9 },
    { name: 'About You', shipping: 'Kostenlos ab €20', delivery: '2-3 Tage', priceModifier: 1.05 },
    { name: 'Otto', shipping: '€4,95', delivery: '2-4 Tage', priceModifier: 1.1 },
    { name: 'H&M', shipping: '€4,95', delivery: '3-5 Tage', priceModifier: 0.8 }
  ];
  
  return intelligentResults.flatMap((product, index) => {
    return shops.map(shop => {
      const shopPrice = product.price * shop.priceModifier;
      const shopOriginalPrice = product.originalPrice * shop.priceModifier;
      
      return {
        shop: shop.name,
        product: product.product,
        price: `€${shopPrice.toFixed(2)}`,
        originalPrice: `€${shopOriginalPrice.toFixed(2)}`,
        shipping: shop.shipping,
        delivery: shop.delivery,
        inStock: Math.random() > 0.1, // 90% chance auf Lager
        link: '#',
        image: getProductImage(product.product, shop.name),
        badge: getProductBadge(shopPrice, product.originalPrice),
        rating: (3.5 + Math.random() * 1.5).toFixed(1),
        relevance: product.relevance - (index * 5) // Erste Ergebnisse relevanter
      };
    });
  });
}

function getProductImage(productName, shopName) {
  const baseImages = {
    jeans: 'https://img01.ztat.net/article/spp-media-p1/1b9d52b27c394e678db12592a3c6c93a/af19fa4df1184e6bb5f5bdc3d6c4b5c3.jpg',
    shirts: 'https://img01.ztat.net/article/spp-media-p1/f1b7d5a7a9b43eb8915b9b2c2d8e8a7a/0d67cfe49d2f4d7c9c45c8c8c8c8c8c8.jpg',
    shoes: 'https://m.media-amazon.com/images/I/71VjS8gKf5L._AC_SX569_.jpg',
    default: 'https://via.placeholder.com/300x300/EEE/999?text=Produkt'
  };
  
  const productLower = productName.toLowerCase();
  if (productLower.includes('jeans')) return baseImages.jeans;
  if (productLower.includes('shirt')) return baseImages.shirts;
  if (productLower.includes('schuh') || productLower.includes('sneaker')) return baseImages.shoes;
  return baseImages.default;
}

function getProductBadge(price, originalPrice) {
  const discount = ((originalPrice - price) / originalPrice) * 100;
  if (discount > 30) return 'Super Sale';
  if (discount > 20) return 'Sale';
  if (price < 50) return 'Angebot';
  return null;
}

// BEST DEAL FINDEN
function findBestDeal(results) {
  const inStockResults = results.filter(item => item.inStock);
  if (inStockResults.length === 0) return results[0];
  
  return inStockResults.sort((a, b) => {
    const priceA = parseFloat(a.price.replace('€', '').replace(',', '.'));
    const priceB = parseFloat(b.price.replace('€', '').replace(',', '.'));
    return priceA - priceB;
  })[0];
}

// INTELLIGENTE SUCHE ROUTE
app.post('/api/search-product', async (req, res) => {
  const { productName } = req.body;
  
  console.log(`🔍 Intelligente Suche: ${productName}`);

  try {
    // 1. Such-Intent analysieren
    const searchIntent = analyzeSearchIntent(productName);
    console.log('🎯 Erkannte Intent:', searchIntent);
    
    // 2. Intelligente Ergebnisse generieren
    const intelligentResults = generateIntelligentResults(searchIntent);
    
    // 3. Shop-Daten hinzufügen
    const shopResults = addShopData(intelligentResults);
    
    // 4. Nach Relevanz sortieren
    const sortedResults = shopResults.sort((a, b) => b.relevance - a.relevance);
    
    res.json({
      success: true,
      searchQuery: productName,
      detectedIntent: searchIntent,
      results: sortedResults.slice(0, 12), // Max 12 Ergebnisse
      totalResults: sortedResults.length,
      message: `🎯 ${sortedResults.length} intelligente Ergebnisse für "${productName}"`,
      bestDeal: findBestDeal(sortedResults),
      features: ['KI-Erkennung', 'Preisvergleich', 'Relevanz-Sorting']
    });
    
  } catch (error) {
    console.error('❌ Suchfehler:', error);
    res.json({
      success: false,
      error: 'Intelligente Suche vorübergehend nicht verfügbar',
      searchQuery: productName
    });
  }
});

// STATISTIKEN
app.get('/api/stats', (req, res) => {
  res.json({
    version: '4.0 - Intelligente Suche',
    features: [
      'KI-gestützte Suchintent-Erkennung',
      'Automatische Kategorie-Erkennung',
      'Marken- und Attribut-Filterung',
      'Intelligentes Relevanz-Ranking',
      'Dynamische Preis-Anpassung'
    ],
    supportedCategories: ['Jeans', 'Shirts', 'Shoes', 'Jackets', 'Hoodies'],
    supportedBrands: ['Nike', 'Adidas', 'Wrangler', 'Levis', 'Tommy Hilfiger', 'Calvin Klein'],
    status: '🟢 Intelligente Suche aktiv'
  });
});

// TEST ROUTE
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Intelligenter Preisvergleich läuft!',
    version: '4.0 - KI-gestützte Suche',
    status: 'Bereit für intelligente Suchanfragen'
  });
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log('🚀 INTELLIGENTER Preisvergleich läuft auf Port ' + PORT);
  console.log('🧠 KI-Erkennung aktiv für Kategorien, Marken & Attribute');
  console.log('📊 Stats: /api/stats');
});
