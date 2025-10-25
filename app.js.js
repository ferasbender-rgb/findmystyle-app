// Hier deinen NEUEN API Key eintragen
const API_KEY = 'DEIN_NEUER_API_SCHLUESSEL_HIER';

// Elemente
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const cameraBtn = document.getElementById('cameraBtn');
const loadingElement = document.getElementById('loading');
const resultsContent = document.getElementById('resultsContent');

// Event Listener
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#f0ebff';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.background = '#f8f7ff';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#f8f7ff';
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
});

cameraBtn.addEventListener('click', () => {
    alert('Kamera-Funktion kommt in der nächsten Version! 📸');
});

// Bild verarbeiten
async function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        showError('Bitte wähle eine Bilddatei aus');
        return;
    }

    showLoading();
    
    try {
        const base64Image = await convertToBase64(file);
        const analysisResults = await analyzeImageWithGoogleVision(base64Image);
        displayResults(analysisResults);
    } catch (error) {
        console.error('Fehler:', error);
        showError('Fehler bei der Bildanalyse. Bitte versuche es erneut.');
    } finally {
        hideLoading();
    }
}

// Bild zu Base64 konvertieren
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}

// Google Vision API aufrufen
async function analyzeImageWithGoogleVision(base64Image) {
    const requestData = {
        requests: [
            {
                image: { content: base64Image },
                features: [
                    { type: 'LABEL_DETECTION', maxResults: 8 },
                    { type: 'OBJECT_LOCALIZATION', maxResults: 5 }
                ]
            }
        ]
    };

    const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        }
    );

    if (!response.ok) {
        throw new Error(`API Fehler: ${response.status}`);
    }

    return await response.json();
}

// Ergebnisse anzeigen
function displayResults(data) {
    const labels = data.responses[0]?.labelAnnotations || [];
    const objects = data.responses[0]?.localizedObjectAnnotations || [];
    
    let html = '';

    // Erkannte Objekte anzeigen
    if (objects.length > 0) {
        html += '<h3>👕 Erkannte Kleidungsstücke:</h3>';
        html += '<div class="results-grid">';
        
        objects.forEach(obj => {
            const confidence = Math.round(obj.score * 100);
            if (confidence > 50) { // Nur Ergebnisse mit hoher Genauigkeit
                html += `
                    <div class="result-item">
                        <strong>${obj.name}</strong>
                        <div class="result-confidence">${confidence}% Übereinstimmung</div>
                    </div>
                `;
            }
        });
        html += '</div>';
    }

    // Labels als Fallback
    if (html === '' && labels.length > 0) {
        html += '<h3>🔍 Erkannte Elemente:</h3>';
        html += '<div class="results-grid">';
        
        labels.forEach(label => {
            const confidence = Math.round(label.score * 100);
            if (confidence > 70) {
                html += `
                    <div class="result-item">
                        <strong>${label.description}</strong>
                        <div class="result-confidence">${confidence}% sicher</div>
                    </div>
                `;
            }
        });
        html += '</div>';
    }

    // Shop Vorschläge
    html += `
        <div class="shop-suggestions">
            <h3>🛍️ Verfügbar in diesen Shops:</h3>
            <div class="shop-item">
                <div class="shop-icon">👕</div>
                <div>
                    <strong>Zalando</strong>
                    <p>Ähnliche Styles verfügbar</p>
                </div>
            </div>
            <div class="shop-item">
                <div class="shop-icon">👖</div>
                <div>
                    <strong>About You</strong>
                    <p>Vergleichbare Modelle</p>
                </div>
            </div>
            <div class="shop-item">
                <div class="shop-icon">👗</div>
                <div>
                    <strong>H&M</strong>
                    <p>Budget-freundliche Alternativen</p>
                </div>
            </div>
        </div>
    `;

    resultsContent.innerHTML = html;
}

// Loading States
function showLoading() {
    loadingElement.style.display = 'block';
    resultsContent.innerHTML = '';
}

function hideLoading() {
    loadingElement.style.display = 'none';
}

function showError(message) {
    resultsContent.innerHTML = `<div class="error">${message}</div>`;
}