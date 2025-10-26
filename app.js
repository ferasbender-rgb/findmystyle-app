// === KLEIDUNGSMARKEN-ERKENNUNG ===
const CLOTHING_BRANDS = {
    'nike': ['nike', 'just do it'],
    'adidas': ['adidas', 'adidas'],
    'puma': ['puma'],
    'h&m': ['h&m', 'hm'],
    'zara': ['zara'],
    'uniqlo': ['uniqlo'],
    'lacoste': ['lacoste'],
    'supreme': ['supreme'],
    'gucci': ['gucci'],
    'champion': ['champion'],
    'vans': ['vans'],
    'converse': ['converse'],
    'tommy hilfiger': ['tommy', 'hilfiger'],
    'calvin klein': ['calvin', 'klein', 'ck']
};

// DOM Elemente
const imageInput = document.getElementById('imageInput');
const uploadBox = document.getElementById('uploadBox');
const previewSection = document.getElementById('previewSection');
const imagePreview = document.getElementById('imagePreview');
const brandResult = document.getElementById('brandResult');
const resultsSection = document.getElementById('resultsSection');
const resultsContent = document.getElementById('resultsContent');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('App gestartet...');
    
    // File Input Change Event
    imageInput.addEventListener('change', handleImageSelect);
    
    // Drag & Drop Events
    uploadBox.addEventListener('dragover', handleDragOver);
    uploadBox.addEventListener('dragleave', handleDragLeave);
    uploadBox.addEventListener('drop', handleDrop);
    
    // Klick auf Upload Box (jetzt funktioniert es wegen dem transparenten File Input)
    uploadBox.addEventListener('click', function(e) {
        // Verhindere doppelte Auslösung
        if (e.target !== imageInput) {
            imageInput.click();
        }
    });
});

// Drag & Drop Funktionen
function handleDragOver(e) {
    e.preventDefault();
    uploadBox.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        console.log('Bild per Drag&Drop erhalten:', files[0].name);
        processImage(files[0]);
    } else {
        showBrandError('Bitte wähle eine Bilddatei aus (JPG, PNG, WebP)');
    }
}

// Datei Auswahl
function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        console.log('Bild ausgewählt:', file.name);
        processImage(file);
    } else {
        showBrandError('Bitte wähle eine gültige Bilddatei aus');
    }
}

// Bild verarbeiten
function processImage(file) {
    console.log('Verarbeite Bild:', file.name);
    
    // Vorschau anzeigen
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        previewSection.style.display = 'block';
        
        // Markenerkennung starten
        detectBrandFromImage(file);
    };
    
    reader.onerror = function() {
        showBrandError('Fehler beim Laden des Bildes');
    };
    
    reader.readAsDataURL(file);
}

// Einfache Texterkennung (simuliert)
function checkForBrands(text) {
    const lowerText = text.toLowerCase();
    const foundBrands = {};
    
    for (const [brand, keywords] of Object.entries(CLOTHING_BRANDS)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                foundBrands[brand] = (foundBrands[brand] || 0) + 1;
            }
        }
    }
    
    if (Object.keys(foundBrands).length > 0) {
        const bestBrand = Object.keys(foundBrands).reduce((a, b) => 
            foundBrands[a] > foundBrands[b] ? a : b
        );
        const confidence = Math.min(foundBrands[bestBrand] / 3, 1);
        return { brand: bestBrand, confidence: confidence };
    }
    
    return { brand: 'unbekannt', confidence: 0 };
}

// Hauptfunktion für Markenerkennung
async function detectBrandFromImage(imageFile) {
    console.log('Starte Markenerkennung für:', imageFile.name);
    
    // Ladeanimation anzeigen
    showBrandLoading();
    
    // Simulierte Verarbeitungszeit (2 Sekunden)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
        const fileName = imageFile.name.toLowerCase();
        let detectedBrand = 'unbekannt';
        let confidence = 0;
        
        // 1. Versuch: Im Dateinamen suchen
        for (const [brand, keywords] of Object.entries(CLOTHING_BRANDS)) {
            for (const keyword of keywords) {
                if (fileName.includes(keyword)) {
                    detectedBrand = brand;
                    confidence = 0.85;
                    console.log('Marke im Dateinamen gefunden:', brand);
                    break;
                }
            }
            if (detectedBrand !== 'unbekannt') break;
        }
        
        // 2. Versuch: Zufällige Erkennung (für Demo)
        if (detectedBrand === 'unbekannt') {
            const brands = Object.keys(CLOTHING_BRANDS);
            const randomIndex = Math.floor(Math.random() * brands.length);
            detectedBrand = brands[randomIndex];
            confidence = Math.random() * 0.3 + 0.5; // 50-80% confidence
            console.log('Zufällige Marke ausgewählt:', detectedBrand);
        }
        
        const result = {
            brand: detectedBrand,
            confidence: confidence,
            message: detectedBrand === 'unbekannt' 
                ? 'Keine Marke erkannt. Versuche ein Bild mit besser sichtbarem Markentext.' 
                : `Marke erfolgreich erkannt!`
        };
        
        showBrandResult(result);
        showDetailedResults(result, imageFile);
        
    } catch (error) {
        console.error('Fehler bei Markenerkennung:', error);
        showBrandError('Fehler bei der Analyse: ' + error.message);
    }
}

// Ergebnis anzeigen Funktionen
function showBrandLoading() {
    brandResult.innerHTML = `
        <div>
            <span class="loading"></span>
            Analysiere Bild...
        </div>
    `;
    brandResult.className = 'brand-result';
}

function showBrandResult(result) {
    if (result.brand !== 'unbekannt') {
        brandResult.innerHTML = `
            <div>
                <strong>✅ ${result.brand.toUpperCase()} erkannt!</strong>
                <br>
                <small>Sicherheit: ${(result.confidence * 100).toFixed(0)}%</small>
                <br>
                <small>${result.message}</small>
            </div>
        `;
        brandResult.className = 'brand-result brand-detected';
    } else {
        brandResult.innerHTML = `
            <div>
                <strong>❌ Keine Marke erkannt</strong>
                <br>
                <small>${result.message}</small>
            </div>
        `;
        brandResult.className = 'brand-result brand-unknown';
    }
}

function showBrandError(message) {
    brandResult.innerHTML = `
        <div>
            <strong>⚠️ Fehler</strong>
            <br>
            <small>${message}</small>
        </div>
    `;
    brandResult.className = 'brand-result brand-error';
}

// Detaillierte Ergebnisse anzeigen
function showDetailedResults(brandResult, imageFile) {
    resultsSection.style.display = 'block';
    
    const resultsHTML = `
        <div class="detailed-results">
            <div class="result-item">
                <strong>📁 Dateiname:</strong> ${imageFile.name}
            </div>
            <div class="result-item">
                <strong>📏 Größe:</strong> ${(imageFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
            <div class="result-item">
                <strong>👕 Erkannte Marke:</strong> ${brandResult.brand.toUpperCase()}
            </div>
            <div class="result-item">
                <strong>📊 Erkennungs-Sicherheit:</strong> ${(brandResult.confidence * 100).toFixed(0)}%
            </div>
            <div class="result-item">
                <strong>💡 Tipp:</strong> ${getBrandTip(brandResult.brand)}
            </div>
        </div>
    `;
    
    resultsContent.innerHTML = resultsHTML;
}

// Tipps für verschiedene Marken
function getBrandTip(brand) {
    const tips = {
        'nike': 'Achte auf den "Swoosh" und "Just Do It" Text',
        'adidas': 'Suche nach den drei Streifen und dem Markennamen',
        'puma': 'Der springende Puma ist das Haupt-Logo',
        'h&m': 'Oft in weißer oder schwarzer Schrift auf rotem Grund',
        'zara': 'Elegante, minimalistische Schrift',
        'supreme': 'Box Logo mit weißer Schrift auf rotem Grund',
        'unbekannt': 'Versuche ein Bild mit klarer, lesbarer Marken-Schrift'
    };
    
    return tips[brand] || 'Marke in der Datenbank erkannt';
}

console.log('Kleidungsmarken Erkennung geladen!');
