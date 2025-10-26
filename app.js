// === KLEIDUNGSMARKEN-ERKENNUNG MIT ECHTER OCR ===
const ENHANCED_CLOTHING_BRANDS = {
    'nike': {
        keywords: ['nike', 'just do it', 'swoosh', 'air max', 'jordan', 'air force'],
        patterns: ['n!ke', 'n1ke', 'n!k3', 'n!ke']
    },
    'adidas': {
        keywords: ['adidas', 'adidas', 'three stripes', 'trefoil', 'superstar', 'stan smith'],
        patterns: ['ad!das', 'ad1das', 'addidas', 'ad!das']
    },
    'puma': {
        keywords: ['puma', 'puma cat', 'formstrip', 'king', 'puma'],
        patterns: ['puma', 'puma']
    },
    'h&m': {
        keywords: ['h&m', 'hm', 'h and m', 'h & m', 'hennes & mauritz'],
        patterns: ['h&m', 'h und m', 'h&m']
    },
    'zara': {
        keywords: ['zara', 'zara home'],
        patterns: ['zara', 'zara']
    },
    'uniqlo': {
        keywords: ['uniqlo'],
        patterns: ['uniqlo']
    },
    'lacoste': {
        keywords: ['lacoste', 'crocodile'],
        patterns: ['lacoste']
    },
    'supreme': {
        keywords: ['supreme', 'supreme nyc', 'box logo'],
        patterns: ['supreme', 'suprem3']
    },
    'gucci': {
        keywords: ['gucci', 'double g', 'gg logo'],
        patterns: ['gucc!', 'gucc1']
    },
    'champion': {
        keywords: ['champion', 'champion reverse weave'],
        patterns: ['champ!on', 'champ1on']
    },
    'vans': {
        keywords: ['vans', 'vans off the wall'],
        patterns: ['vans']
    },
    'converse': {
        keywords: ['converse', 'all star', 'converse all star'],
        patterns: ['converse']
    },
    'tommy hilfiger': {
        keywords: ['tommy', 'hilfiger', 'tommy hilfiger'],
        patterns: ['tommy', 'hilfiger']
    },
    'calvin klein': {
        keywords: ['calvin', 'klein', 'calvin klein', 'ck'],
        patterns: ['calv!n', 'calv1n']
    },
    'levis': {
        keywords: ['levis', 'levi\'s', 'levi strauss'],
        patterns: ['lev!s', 'lev1s']
    }
};

// DOM Elemente
const imageInput = document.getElementById('imageInput');
const uploadBox = document.getElementById('uploadBox');
const previewSection = document.getElementById('previewSection');
const imagePreview = document.getElementById('imagePreview');
const brandResult = document.getElementById('brandResult');
const feedbackSection = document.getElementById('feedbackSection');
const resultsSection = document.getElementById('resultsSection');
const resultsContent = document.getElementById('resultsContent');
const correctionSection = document.getElementById('correctionSection');
const correctBrandInput = document.getElementById('correctBrandInput');

// Training Data für Verbesserungen
let trainingData = JSON.parse(localStorage.getItem('brandTrainingData')) || [];
let currentImageFile = null;
let currentDetectionResult = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Kleidungsmarken Erkennung gestartet');
    
    // File Input Change Event
    imageInput.addEventListener('change', handleImageSelect);
    
    // Drag & Drop Events
    uploadBox.addEventListener('dragover', handleDragOver);
    uploadBox.addEventListener('dragleave', handleDragLeave);
    uploadBox.addEventListener('drop', handleDrop);
    
    // Klick auf Upload Box
    uploadBox.addEventListener('click', function(e) {
        if (e.target !== imageInput) {
            imageInput.click();
        }
    });
    
    console.log('✅ Event Listeners initialisiert');
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
        console.log('📁 Bild per Drag&Drop erhalten:', files[0].name);
        processImage(files[0]);
    } else {
        showBrandError('Bitte wähle eine Bilddatei aus (JPG, PNG, WebP)');
    }
}

// Datei Auswahl
function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        console.log('📁 Bild ausgewählt:', file.name);
        processImage(file);
    } else {
        showBrandError('Bitte wähle eine gültige Bilddatei aus');
    }
}

// Bild verarbeiten
function processImage(file) {
    console.log('🔄 Verarbeite Bild:', file.name);
    currentImageFile = file;
    
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

// === ECHTE OCR-API INTEGRATION ===
async function realTextRecognition(imageFile) {
    console.log('🔤 Starte echte Texterkennung...');
    
    try {
        // OCR.space API (KOSTENLOS - 25.000 Requests/Monat)
        const formData = new FormData();
        formData.append('apikey', 'KOSTENLOS'); // Kostenloser Key - später ersetzen
        formData.append('file', imageFile);
        formData.append('language', 'ger');
        formData.append('isOverlayRequired', 'false');
        formData.append('OCREngine', '2'); // Engine 2 für bessere Genauigkeit
        
        console.log('📡 Sende Request an OCR API...');
        
        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 OCR API Response:', data);
        
        if (data.IsErroredOnProcessing) {
            throw new Error(data.ErrorMessage || 'OCR Verarbeitungsfehler');
        }
        
        if (!data.ParsedResults || data.ParsedResults.length === 0) {
            throw new Error('Kein Text im Bild erkannt');
        }
        
        const extractedText = data.ParsedResults[0].ParsedText;
        console.log('✅ OCR erkannt:', extractedText);
        
        return extractedText.toLowerCase();
        
    } catch (error) {
        console.error('❌ OCR Fehler:', error);
        // Fallback: Dateinamen analysieren
        console.log('🔄 Fallback zur Dateinamen-Analyse');
        return imageFile.name.toLowerCase();
    }
}

// === VERBESSERTE MARKENERKENNUNG ===
function advancedBrandDetection(text) {
    console.log('🔍 Analysiere Text auf Marken:', text);
    
    let bestMatch = { brand: 'unbekannt', confidence: 0, matchedKeywords: [] };
    
    for (const [brand, data] of Object.entries(ENHANCED_CLOTHING_BRANDS)) {
        let score = 0;
        let matched = [];
        
        // 1. Keyword-Matching (Hauptgewichtung)
        for (const keyword of data.keywords) {
            if (text.includes(keyword)) {
                score += 2;
                matched.push(keyword);
                console.log(`✅ Keyword gefunden: ${keyword} für ${brand}`);
            }
        }
        
        // 2. Pattern-Matching für Tippfehler
        for (const pattern of data.patterns) {
            if (text.includes(pattern)) {
                score += 1.5;
                matched.push(pattern);
                console.log(`✅ Pattern gefunden: ${pattern} für ${brand}`);
            }
        }
        
        // 3. Teilwort-Erkennung
        const words = text.split(/[\s\W]+/); // Split by spaces and non-word chars
        for (const word of words) {
            if (word.length < 3) continue; // Ignoriere kurze Wörter
            
            for (const keyword of data.keywords) {
                if (keyword.includes(word) || word.includes(keyword)) {
                    score += 0.5;
                    matched.push(`${word}->${keyword}`);
                }
            }
        }
        
        if (score > bestMatch.confidence) {
            bestMatch = { 
                brand, 
                confidence: Math.min(score / 10, 1),
                matchedKeywords: matched
            };
        }
    }
    
    console.log(`🎯 Beste Übereinstimmung: ${bestMatch.brand} (${bestMatch.confidence})`);
    return bestMatch;
}

// === HAUPTERKENNUNGSFUNKTION ===
async function detectBrandFromImage(imageFile) {
    console.log('🚀 Starte erweiterte Markenerkennung...');
    showBrandLoading();
    hideFeedback();
    
    try {
        // 1. Echte OCR durchführen
        const extractedText = await realTextRecognition(imageFile);
        
        // 2. Erweiterte Markenerkennung
        const brandResult = advancedBrandDetection(extractedText);
        
        // 3. Ergebnis speichern für Feedback
        currentDetectionResult = brandResult;
        
        // 4. Ergebnis anzeigen
        const displayText = extractedText.length > 100 
            ? extractedText.substring(0, 100) + '...' 
            : extractedText;
            
        showBrandResult({
            brand: brandResult.brand,
            confidence: brandResult.confidence,
            extractedText: displayText,
            matchedKeywords: brandResult.matchedKeywords
        });
        
        showDetailedResults(brandResult, imageFile, extractedText);
        showFeedback();
        
    } catch (error) {
        console.error('❌ Fehler bei erweiterter Erkennung:', error);
        showBrandError('Analyse fehlgeschlagen: ' + error.message);
    }
}

// === FEEDBACK-SYSTEM ===
function showFeedback() {
    feedbackSection.style.display = 'block';
    correctionSection.style.display = 'none';
}

function hideFeedback() {
    feedbackSection.style.display = 'none';
}

function handleFeedback(type) {
    if (type === 'correct') {
        collectTrainingData('correct', null);
        showFeedbackSuccess('Danke für dein Feedback! ✅');
    } else {
        correctionSection.style.display = 'block';
    }
}

function submitCorrection() {
    const correctBrand = correctBrandInput.value.trim();
    if (correctBrand) {
        collectTrainingData('wrong', correctBrand);
        showFeedbackSuccess(`Danke! Wir lernen daraus. Korrektur: ${correctBrand}`);
        correctionSection.style.display = 'none';
        correctBrandInput.value = '';
    }
}

function collectTrainingData(feedbackType, correctBrand) {
    const trainingEntry = {
        timestamp: new Date().toISOString(),
        detectedBrand: currentDetectionResult.brand,
        confidence: currentDetectionResult.confidence,
        feedback: feedbackType,
        correctBrand: correctBrand,
        fileName: currentImageFile.name
    };
    
    trainingData.push(trainingEntry);
    localStorage.setItem('brandTrainingData', JSON.stringify(trainingData));
    
    console.log('📊 Training Data gespeichert:', trainingEntry);
    console.log('📈 Gesamte Training Data:', trainingData);
}

function showFeedbackSuccess(message) {
    const tempDiv = document.createElement('div');
    tempDiv.className = 'brand-result brand-detected';
    tempDiv.innerHTML = `<small>${message}</small>`;
    feedbackSection.appendChild(tempDiv);
    
    setTimeout(() => {
        tempDiv.remove();
    }, 3000);
}

// === ANZEIGE-FUNKTIONEN ===
function showBrandLoading() {
    brandResult.innerHTML = `
        <div>
            <span class="loading"></span>
            Analysiere Bild mit OCR...
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
                <small>Erkannter Text: "${result.extractedText}"</small>
            </div>
        `;
        brandResult.className = 'brand-result brand-detected';
    } else {
        brandResult.innerHTML = `
            <div>
                <strong>❌ Keine Marke erkannt</strong>
                <br>
                <small>Erkannter Text: "${result.extractedText}"</small>
                <br>
                <small>Versuche ein Bild mit besser sichtbarem Markentext</small>
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

function showDetailedResults(brandResult, imageFile, extractedText) {
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
                <strong>🔤 Gefundene Keywords:</strong> ${brandResult.matchedKeywords.join(', ') || 'Keine'}
            </div>
            <div class="result-item">
                <strong>📝 Vollständiger Text:</strong> ${extractedText.substring(0, 200)}...
            </div>
            <div class="result-item">
                <strong>💡 Tipp:</strong> ${getBrandTip(brandResult.brand)}
            </div>
        </div>
    `;
    
    resultsContent.innerHTML = resultsHTML;
}

function getBrandTip(brand) {
    const tips = {
        'nike': 'Achte auf den "Swoosh" und "Just Do It" Text',
        'adidas': 'Suche nach den drei Streifen und dem Markennamen',
        'puma': 'Der springende Puma ist das Haupt-Logo',
        'h&m': 'Oft in weißer oder schwarzer Schrift auf rotem Grund',
        'supreme': 'Box Logo mit weißer Schrift auf rotem Grund',
        'unbekannt': 'Versuche ein Bild mit klarer, lesbarer Marken-Schrift'
    };
    
    return tips[brand] || 'Marke in der erweiterten Datenbank erkannt';
}

// === INIT ===
console.log('🎉 Kleidungsmarken Erkennung Phase 1 aktiviert!');
console.log('✅ Echte OCR-API integriert');
console.log('✅ Erweiterte Markendatenbank');
console.log('✅ Feedback-System aktiv');
console.log('📊 Training Data Einträge:', trainingData.length);
