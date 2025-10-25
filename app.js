// Demo-KI für Fashion-Erkennung - AL QAMAR STYLE Version
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const startBtn = document.getElementById('startBtn');
const resultsContent = document.getElementById('resultsContent');
const loadingElement = document.getElementById('loading');

// Event Listener
uploadArea.addEventListener('click', () => fileInput.click());
startBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
});

// Bild "analysieren" - Demo Version
async function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        showError('Please select an image file');
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
        'Blouse', 'Shirt', 'Dress', 'Jeans', 'Pants', 'Jacket', 
        'Sweater', 'Skirt', 'Shorts', 'Blazer', 'Coat', 'Shoes'
    ];
    
    const colors = ['White', 'Black', 'Blue', 'Red', 'Green', 'Gray', 'Brown', 'Beige'];
    const materials = ['Cotton', 'Denim', 'Wool', 'Silk', 'Linen', 'Polyester'];
    
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

// Ergebnisse im neuen Design anzeigen
function displayResults(items) {
    let html = '';
    
    // Haupt-Ergebnis (erstes Item prominent)
    if (items.length > 0) {
        const mainItem = items[0];
        html += `
            <div class="result-item">
                <div class="result-header">
                    <div class="result-title">${mainItem.color} ${mainItem.type}</div>
                    <div class="result-type">Exact match</div>
                </div>
                <div class="result-matches">
                    <div class="match-item">
                        <span class="match-company">Zalando</span>
                        <span class="match-price">€${Math.floor(Math.random() * 30) + 30}</span>
                    </div>
                    <div class="match-item">
                        <span class="match-company">H&M</span>
                        <span class="match-price">€${Math.floor(Math.random() * 20) + 20}</span>
                    </div>
                    <div class="match-item">
                        <span class="match-company">About You</span>
                        <span class="match-price">€${Math.floor(Math.random() * 40) + 25}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Weitere Ergebnisse
    if (items.length > 1) {
        html += '<h3 style="margin: 25px 0 15px; font-size: 18px;">Similar items</h3>';
        
        for (let i = 1; i < items.length; i++) {
            const item = items[i];
            html += `
                <div class="result-item">
                    <div class="result-header">
                        <div class="result-title">${item.color} ${item.type}</div>
                        <div class="result-type">${item.confidence}% match</div>
                    </div>
                </div>
            `;
        }
    }
    
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

// Drag & Drop Funktion
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#f0ebff';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.background = '#fafafa';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.background = '#fafafa';
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
});
