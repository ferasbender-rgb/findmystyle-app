// === KLEIDUNGSMARKEN-ERKENNUNG MIT DIREKTER GOOGLE SHEETS INTEGRATION ===
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

// === DIREKTE GOOGLE SHEETS KONFIGURATION ===
// 🚀 AKTUELLE WEB-APP URL:
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7nBtTTp88SD-U4hrUeutr0OmLTnOb1nvrOIP3UFEcmsViXnsir9tbkukh3oORZQThhw/exec';

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

// Training Data
let trainingData = JSON.parse(localStorage.getItem('brandTrainingData')) || [];
let currentImageFile = null;
let currentDetectionResult = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Kleidungsmarken Erkennung mit direkter Google Sheets Integration');
    
    imageInput.addEventListener('change', handleImageSelect);
    uploadBox.addEventListener('dragover', handleDragOver);
    uploadBox.addEventListener('dragleave', handleDragLeave);
    uploadBox.addEventListener('drop', handleDrop);
    
    uploadBox.addEventListener('click', function(e) {
        if (e.target !== imageInput) {
            imageInput.click();
        }
    });
});

// Drag & Drop
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
        processImage(files[0]);
    } else {
        showBrandError('Bitte wähle eine Bilddatei aus (JPG, PNG, WebP)');
    }
}

// Datei Auswahl
function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file);
    } else {
        showBrandError('Bitte wähle eine gültige Bilddatei aus');
    }
}

// Bild verarbeiten
function processImage(file) {
    currentImageFile = file;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        previewSection.style.display = 'block';
        detectBrandFromImage(file);
    };
    
    reader.onerror = function() {
        showBrandError('Fehler beim Laden des Bildes');
    };
    
    reader.readAsDataURL(file);
}

// KOSTENLOSE OCR MIT TESSERACT.JS
async function recognizeText(imageFile) {
  try {
    const worker = await Tesseract.createWorker('eng');
    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('OCR Fehler:', error);
    return null;
  }
}

// Markenerkennung
function advancedBrandDetection(text) {
    let bestMatch = { brand: 'unbekannt', confidence: 0, matchedKeywords: [] };
    
    for (const [brand, data] of Object.entries(ENHANCED_CLOTHING_BRANDS)) {
        let score = 0;
        let matched = [];
        
        for (const keyword of data.keywords) {
            if (text.includes(keyword)) {
                score += 2;
                matched.push(keyword);
            }
        }
        
        for (const pattern of data.patterns) {
            if (text.includes(pattern)) {
                score += 1.5;
                matched.push(pattern);
            }
        }
        
        const words = text.split(/[\s\W]+/);
        for (const word of words) {
            if (word.length < 3) continue;
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
    
    return bestMatch;
}

// Hauptfunktion
async function detectBrandFromImage(imageFile) {
    showBrandLoading();
    hideFeedback();
    
    try {
        const extractedText = await realTextRecognition(imageFile);
        const brandResult = advancedBrandDetection(extractedText);
        
        currentDetectionResult = brandResult;
        
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
        console.error('Fehler bei erweiterter Erkennung:', error);
        showBrandError('Analyse fehlgeschlagen: ' + error.message);
    }
}

// === DIREKTE GOOGLE SHEETS INTEGRATION ===
async function saveToGoogleSheets(data) {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwRzO5cpsrrX2YrK2GQmn643Ddc68JXMqBKjK5WSM5P79MGg_vjnQme99Q1WxmQ1m4sGg/exec';
  
  try {
    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    console.log('✅ Google Sheets Erfolg:', result.success);
    return result;
  } catch (error) {
    console.error('❌ Fehler beim Senden an Google Sheets:', error);
    throw error;
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

async function handleFeedback(type) {
    if (type === 'correct') {
        await collectTrainingData('correct', null);
        showFeedbackSuccess('Danke für dein Feedback! ✅');
    } else {
        correctionSection.style.display = 'block';
    }
}

async function submitCorrection() {
    const correctBrand = correctBrandInput.value.trim();
    if (correctBrand) {
        await collectTrainingData('wrong', correctBrand);
        showFeedbackSuccess(`Danke! Wir lernen daraus. Korrektur: ${correctBrand}`);
        correctionSection.style.display = 'none';
        correctBrandInput.value = '';
    }
}

async function collectTrainingData(feedbackType, correctBrand) {
    const feedbackData = {
        timestamp: new Date().toISOString(),
        detectedBrand: currentDetectionResult.brand,
        confidence: currentDetectionResult.confidence,
        feedback: feedbackType,
        correctBrand: correctBrand,
        fileName: currentImageFile.name
    };
    
    // 1. Versuche an Google Sheets zu senden
    const googleSheetsSuccess = await saveToGoogleSheets(feedbackData);
    
    // 2. Immer lokal speichern als Backup
    trainingData.push(feedbackData);
    localStorage.setItem('brandTrainingData', JSON.stringify(trainingData));
    
    console.log('📊 Feedback gespeichert:', feedbackData);
    console.log('🌐 Google Sheets Erfolg:', googleSheetsSuccess);
    
    if (googleSheetsSuccess) {
        showFeedbackSuccess('✅ Feedback gespeichert & gelernt!');
    } else {
        showFeedbackSuccess('💾 Feedback lokal gespeichert');
    }
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

// === ADMIN FUNKTIONEN ===
function exportTrainingData() {
    const data = JSON.parse(localStorage.getItem('brandTrainingData') || '[]');
    const csv = convertToCSV(data);
    downloadCSV(csv, 'marken-feedback.csv');
}

function convertToCSV(data) {
    const headers = ['Timestamp', 'DetectedBrand', 'CorrectBrand', 'Confidence', 'FileName', 'FeedbackType'];
    const csv = [headers.join(',')];
    
    data.forEach(row => {
        const line = [
            `"${row.timestamp}"`,
            `"${row.detectedBrand}"`,
            `"${row.correctBrand || ''}"`,
            row.confidence,
            `"${row.fileName}"`,
            `"${row.feedback}"`
        ];
        csv.push(line.join(','));
    });
    
    return csv.join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
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
                <strong>👕 Erkannte Marke:</strong> ${brandResult.brand.toUpperCase()}
            </div>
            <div class="result-item">
                <strong>📊 Erkennungs-Sicherheit:</strong> ${(brandResult.confidence * 100).toFixed(0)}%
            </div>
            <div class="result-item">
                <strong>🔤 Gefundene Keywords:</strong> ${brandResult.matchedKeywords.join(', ') || 'Keine'}
            </div>
            <div class="result-item">
                <button onclick="exportTrainingData()" class="feedback-btn submit">📥 Lokale Daten exportieren</button>
            </div>
        </div>
    `;
    
    resultsContent.innerHTML = resultsHTML;
}

// Globale Funktionen für HTML onclick
window.handleFeedback = handleFeedback;
window.submitCorrection = submitCorrection;
window.exportTrainingData = exportTrainingData;

console.log('🎉 Kleidungsmarken Erkennung mit direkter Google Sheets Integration ready!');
console.log('🌐 Web-App URL:', GOOGLE_SCRIPT_URL);
