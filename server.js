const express = require('express');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Hauptroute
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// PRODUKT-SUCH FUNKTION - DAS BRAUCHST DU!
app.post('/api/find-product', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    console.log('Suche Produkt für URL:', imageUrl);
    
    // Produktcode aus G-Star URL extrahieren
    const productCodeMatch = imageUrl.match(/D\d{5}-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+/);
    
    if (!productCodeMatch) {
      return res.status(400).json({ 
        success: false, 
        error: 'Kein G-Star Produktcode in der URL gefunden' 
      });
    }

    const productCode = productCodeMatch[0];
    console.log('Gefundener Produktcode:', productCode);
    
    // Versuch 1: Direkte G-Star URL konstruieren
    const directUrl = `https://www.g-star.com/shop/de_de/men/t-shirts/${productCode}`;
    
    // Versuch 2: Über Suche
    const searchUrl = `https://www.g-star.com/de_de/search?q=${productCode}`;
    
    // Prüfe ob direkte URL existiert
    try {
      const directResponse = await axios.get(directUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
      
      if (directResponse.status === 200) {
        console.log('Direkter Link gefunden:', directUrl);
        return res.json({ 
          success: true, 
          productLink: directUrl,
          productCode: productCode,
          source: 'direct'
        });
      }
    } catch (directError) {
      console.log('Direkter Link nicht verfügbar, versuche Suche...');
    }
    
    // Fallback: Über Suche
    try {
      const searchResponse = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const dom = new JSDOM(searchResponse.data);
      const document = dom.window.document;

      // Suche nach Produktlinks
      const productLinks = document.querySelectorAll('a[href*="/shop/"]');
      
      for (let link of productLinks) {
        const href = link.getAttribute('href');
        if (href && href.includes(productCode)) {
          const fullLink = 'https://www.g-star.com' + href;
          console.log('Produktlink über Suche gefunden:', fullLink);
          return res.json({ 
            success: true, 
            productLink: fullLink,
            productCode: productCode,
            source: 'search'
          });
        }
      }
    } catch (searchError) {
      console.log('Suche fehlgeschlagen:', searchError.message);
    }

    // Fallback: Konstruiere generischen Link
    const fallbackLink = `https://www.g-star.com/de_de/search?q=${productCode}`;
    console.log('Nutze Fallback-Link:', fallbackLink);
    
    res.json({ 
      success: true, 
      productLink: fallbackLink,
      productCode: productCode,
      source: 'fallback'
    });

  } catch (error) {
    console.error('Fehler bei der Produktsuche:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Interner Serverfehler: ' + error.message 
    });
  }
});

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server funktioniert! Produktsuche ist bereit.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
  console.log(`📦 Produktsuche ist aktiv!`);
});
