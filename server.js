const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Einfache Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Test Route - Garantiert funktionierend
app.get('/api/test', (req, res) => {
  console.log('✅ Test Route aufgerufen');
  res.json({ 
    message: '✅ Server funktioniert!',
    status: 'ready',
    timestamp: new Date().toISOString()
  });
});

// Einfache Bildanalyse Route
app.post('/api/analyze-image', (req, res) => {
  console.log('📸 Bildanalyse gestartet');
  
  // SOFORT Antwort mit Test-Daten (keine Fehler möglich)
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
    }
  ];

  res.json({
    success: true,
    results: results,
    message: `🎉 ${results.length} Produkte gefunden!`
  });
});

// Fallback Route
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
  console.log(`✅ Test: http://localhost:${PORT}/api/test`);
});
