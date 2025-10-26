const express = require('express');
const path = require('path');
const app = express();

// Statische Dateien (dein Frontend)
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Daten speichern
app.post('/save-data', async (req, res) => {
    try {
        const data = req.body;
        console.log('✅ Daten empfangen:', data);
        
        // Erfolg zurückgeben
        res.json({ 
            success: true, 
            message: 'Daten erfolgreich gespeichert',
            data: data
        });
        
    } catch (error) {
        console.error('Fehler:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Frontend ausliefern
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));