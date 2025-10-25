// Demo-KI für Fashion-Erkennung
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const resultsContent = document.getElementById('resultsContent');
const loadingElement = document.getElementById('loading');

// Event Listener
uploadArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
});

// Bild "analysieren" - Demo Version
async function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        showError('Bitte wähle eine Bilddatei aus');
        return;
    }

    showLoading();
    
    // 2 Sekunden warten für realistische Demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Zufällige Kleidungs-Erkennung
    const detectedItems = generateFashionDetection();
    displayResults(detectedItems);
    hideLoading();
}

// Demo-KI: Generiert zufällige Fashion-Ergebnisse
function generateFashionDetection() {
    const clothingTypes = [
        'T-Shirt', 'Jeans', 'Kleid', 'Bluse', 'Hose', 'Jacke', 
        'Pullover', 'Rock', 'Shorts', 'Blazer', 'Hemd', 'Schuhe'
    ];
    
    const colors = ['Schwarz', 'Weiß', 'Blau', 'Rot', 'Grün', 'Grau', 'Braun', 'Beige'];
    const materials = ['Baumwolle', 'Denim', 'Wolle', 'Seide', 'Leinen', 'Polyester'];
    
    const results = [];
    const numItems = Math.floor(Math.random() * 3) + 2; // 2-4 Items
    
    for (let i = 0; i < numItems; i++) {
        const type = clothingTypes[Math.floor(Math.random() * clothingTypes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const confidence = Math.floor(Math.random() * 30) + 70; // 70-99%
        
        results.push({
            type: type,
            color: color,
            material: material,
            confidence: confidence
        });
    }
    
    return results;
}

// Ergebnisse anzeigen
function displayResults(items) {
    let html = '<h3>👕 Erkannte Kleidungsstücke:</h3>';
    html += '<div class="results-grid">';
    
    items.forEach(item => {
        html += `
            <div class="result-item">
                <strong>${item.type}</strong>
                <div class="result-details">
                    Farbe: ${item.color} | Material: ${item.material}
                </div>
                <div class="result-confidence">${item.confidence}% Übereinstimmung</div>
            </div>
        `;
    });
    
    html += '</div>';
    html += generateShopSuggestions();
    
    resultsContent.innerHTML = html;
}

// Shop-Vorschläge generieren
function generateShopSuggestions() {
    const shops = [
        { name: 'Zalando', icon: '👕', description: 'Ähnliche Styles verfügbar' },
        { name: 'About You', icon: '👖', description: 'Vergleichbare Modelle' },
        { name: 'H&M', icon: '👗', description: 'Budget-freundliche Alternativen' },
        { name: 'ASOS', icon: '🛍️', description: 'Internationale Trends' }
    ];
    
    let html = '<div class="shop-suggestions"><h3>🛍️ Verfügbar in diesen Shops:</h3>';
    
    shops.forEach(shop => {
        html += `
            <div class="shop-item">
                <div class="shop-icon">${shop.icon}</div>
                <div>
                    <strong>${shop.name}</strong>
                    <p>${shop.description}</p>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
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

// Drag & Drop Funktion
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
