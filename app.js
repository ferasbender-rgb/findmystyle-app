// Tesseract.js Worker
let worker;

// Initialisiere Tesseract OCR
async function initializeOCR() {
    try {
        console.log('Starte Tesseract OCR...');
        worker = await Tesseract.createWorker('eng');
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        console.log('Tesseract OCR initialisiert');
    } catch (error) {
        console.error('Fehler bei OCR-Initialisierung:', error);
    }
}

// Texterkennung durchführen
async function recognizeText(imageFile) {
    try {
        if (!worker) {
            await initializeOCR();
        }
        const { data: { text } } = await worker.recognize(imageFile);
        return text.trim();
    } catch (error) {
        console.error('OCR Fehler:', error);
        return null;
    }
}

// Marken aus erkanntem Text extrahieren
function extractBrands(text) {
    const brands = ['Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'G-Star', 'Tommy Hilfiger', 'Calvin Klein'];
    const foundBrands = brands.filter(brand => 
        text.toLowerCase().includes(brand.toLowerCase())
    );
    return foundBrands.length > 0 ? foundBrands[0] : 'unbekannt';
}

// Daten an Google Sheets senden (Formular-Methode)
async function saveToGoogleSheets(data) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwRzO5cpsrrX2YrK2GQmn643Ddc68JXMqBKjK5WSM5P79MGg_vjnQme99Q1WxmQ1m4sGg/exec';
    
    console.log('📧 Sende an Google Sheets:', data);
    
    // Erstelle ein versteckes Formular für den POST Request
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = scriptURL;
    form.target = '_blank'; // Öffnet in neuem Tab (vermeidet CORS)
    form.style.display = 'none';
    
    // Füge Daten als hidden inputs hinzu
    Object.keys(data).forEach(key => {
        const input = document.createElement('input');
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
    });
    
    // Füge Formular zum DOM hinzu und sende ab
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    console.log('✅ Daten gesendet via Formular');
    return { success: true };
}

// Training Data sammeln
async function collectTrainingData(originalData, userCorrection) {
    const trainingData = {
        timestamp: new Date().toISOString(),
        detectedBrand: originalData.detectedBrand,
        correctBrand: userCorrection,
        confidence: originalData.confidence || 0.8,
        fileName: originalData.fileName || 'unknown',
        feedback: originalData.detectedBrand === userCorrection ? 'correct' : 'wrong'
    };
    
    console.log('📧 Feedback gespeichert:', trainingData);
    
    // Sende Daten (kein await nötig)
    saveToGoogleSheets(trainingData);
    
    // Erfolgsmeldung sofort anzeigen
    alert('✅ Feedback erfolgreich gespeichert! Die Daten werden an Google Sheets übertragen.');
    
    // UI zurücksetzen
    document.getElementById('correctionSection').style.display = 'none';
    document.getElementById('brandCorrection').value = '';
    
    return true;
}

// Bild-Upload verarbeiten
document.getElementById('imageUpload').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const preview = document.getElementById('imagePreview');
    const resultDiv = document.getElementById('ocrResult');
    const brandResult = document.getElementById('brandResult');
    const correctionSection = document.getElementById('correctionSection');
    const correctionInput = document.getElementById('brandCorrection');

    // Bildvorschau anzeigen
    preview.innerHTML = '';
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = '300px';
    preview.appendChild(img);

    // OCR durchführen
    resultDiv.textContent = 'Erkenne Text...';
    brandResult.textContent = 'Analysiere Marke...';

    try {
        const text = await recognizeText(file);
        resultDiv.textContent = text || 'Kein Text erkannt';
        
        const detectedBrand = text ? extractBrands(text) : 'unbekannt';
        brandResult.textContent = `Erkannte Marke: ${detectedBrand}`;
        
        // Korrektur-Sektion anzeigen
        correctionSection.style.display = 'block';
        correctionInput.value = detectedBrand !== 'unbekannt' ? detectedBrand : '';
        
        // Aktuelle Daten speichern für spätere Korrektur
        window.currentOCRData = {
            detectedBrand: detectedBrand,
            confidence: text ? 0.8 : 0,
            fileName: file.name,
            originalText: text
        };
        
    } catch (error) {
        resultDiv.textContent = 'Fehler bei der Texterkennung';
        brandResult.textContent = 'Markenerkennung fehlgeschlagen';
        console.error('Verarbeitungsfehler:', error);
    }
});

// Korrektur abschicken
function submitCorrection() {
    const correctionInput = document.getElementById('brandCorrection');
    const userBrand = correctionInput.value.trim();
    
    if (!userBrand) {
        alert('Bitte gib eine Marke ein');
        return;
    }
    
    if (!window.currentOCRData) {
        alert('Keine OCR-Daten verfügbar');
        return;
    }
    
    collectTrainingData(window.currentOCRData, userBrand);
}

// App initialisieren
document.addEventListener('DOMContentLoaded', function() {
    initializeOCR();
    
    // Event Listener für Korrektur-Button
    document.getElementById('submitCorrection').addEventListener('click', submitCorrection);
    
    // Enter-Taste für Korrektur-Eingabe
    document.getElementById('brandCorrection').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitCorrection();
        }
    });
});
