const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000; // WICHTIG: 10000 für Render

app.use(express.json());
app.use(express.static('.'));

// Test Route
app.get('/api/test', (req, res) => {
  console.log('✅ Test Route aufgerufen');
  res.json({ message: '✅ Server funktioniert!', status: 'ok' });
});

// Analyze Route
app.post('/api/analyze-image', (req, res) => {
  console.log('📸 Analyze Route aufgerufen');
  res.json({ 
    success: true, 
    results: [
      {
        title: "G-Star Raw T-Shirt Lash Braun",
        price: "€49,95",
        shop: "G-Star Raw",
        link: "https://www.g-star.com/shop/de_de/men/t-shirts",
        image: "https://img1.g-star.com/product/c_fill,f_auto,h_600,q_80/v1724419128/D16396-B353-B113-M01/g-star-lash-t-shirt-braun.jpg",
        confidence: 0.95,
        type: "exact_match"
      }
    ],
    message: "🎉 1 Produkt gefunden!"
  });
});

// Fallback für Frontend
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log('🚀 Server läuft auf Port ' + PORT);
});
