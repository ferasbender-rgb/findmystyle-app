const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

// WICHTIG: Größere Limits für Bilder
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.'));

// Test Route
app.get('/api/test', (req, res) => {
  console.log('✅ Test Route aufgerufen');
  res.json({ 
    message: '✅ Server funktioniert!', 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Analyze Route - Automatische Bildanalyse
app.post('/api/analyze-image', (req, res) => {
  console.log('📸 Analyze Route aufgerufen - Bild erhalten!');
  
  // Simulierte Produktergebnisse
  const results = [
    {
      title: "G-Star Raw T-Shirt Lash Braun",
      price: "€49,95",
      shop: "G-Star Raw",
      link: "https://www.g-star.com/shop/de_de/men/t-shirts",
      image: "https://img1.g-star.com/product/c_fill,f_auto,h_600,q_80/v1724419128/D16396-B353-B113-M01/g-star-lash-t-shirt-braun.jpg",
      confidence: 0.95,
      type: "exact_match"
    },
    {
      title: "Ähnliches T-Shirt bei Zalando",
      price: "€29,99",
      shop: "Zalando",
      link: "https://www.zalando.de/herren-oberteile-t-shirts/",
      image: "https://img01.ztat.net/article/spp-media-p1/1b9d52b27c394e678db12592a3c6c93a/af19fa4df1184e6bb5f5bdc3d6c4b5c3.jpg",
      confidence: 0.82,
      type: "similar"
    },
    {
      title: "Basic T-Shirt Braun bei Amazon",
      price: "€24,99",
      shop: "Amazon",
      link: "https://www.amazon.de/fashion-herren-t-shirt-braun/",
      image: "https://m.media-amazon.com/images/I/71VjS8gKf5L._AC_SX569_.jpg",
      confidence: 0.75,
      type: "similar"
    },
    {
      title: "G-Star Kollektion bei About You",
      price: "€45,00",
      shop: "About You",
      link: "https://www.aboutyou.de/p/g-star-raw/t-shirt-76445726",
      image: "https://img01.ztat.net/article/spp-media-p1/f1b7d5a7a9b43eb8915b9b2c2d8e8a7a/0d67cfe49d2f4d7c9c45c8c8c8c8c8c8.jpg",
      confidence: 0.88,
      type: "similar"
    }
  ];

  res.json({ 
    success: true, 
    results: results,
    message: `🎉 ${results.length} Produkte gefunden!`,
    searchType: "automatic_image_analysis"
  });
});

// Zusätzliche Route für direkte URL-Suche
app.post('/api/find-product', (req, res) => {
  const { imageUrl } = req.body;
  console.log('🔗 Direkte URL-Suche:', imageUrl);
  
  if (imageUrl && imageUrl.includes('g-star.com')) {
    const productCodeMatch = imageUrl.match(/D\d{5}-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+/);
    if (productCodeMatch) {
      const productCode = productCodeMatch[0];
      const directUrl = `https://www.g-star.com/shop/de_de/men/t-shirts/${productCode}`;
      
      res.json({
        success: true,
        productLink: directUrl,
        productCode: productCode,
        source: 'direct_match'
      });
      return;
    }
  }
  
  res.json({
    success: false,
    error: 'Kein G-Star Produktcode gefunden'
  });
});

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'Al-Qamar Fashion Finder',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Fallback für Frontend
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);
  res.status(500).json({
    success: false,
    error: 'Interner Serverfehler'
  });
});

// Server starten
app.listen(PORT, () => {
  console.log('🚀 Server läuft auf Port ' + PORT);
  console.log('✅ Test URL: https://al-qamar-fashion-finder.onrender.com/api/test');
  console.log('📸 Analyze URL: https://al-qamar-fashion-finder.onrender.com/api/analyze-image');
  console.log('❤️  Health Check: https://al-qamar-fashion-finder.onrender.com/health');
});
