// PRODUKT-SUCHE FUNKTION - Für G-Star und andere Shops
async function searchProductByImageUrl(imageUrl) {
    try {
        console.log('Starte Produktsuche für:', imageUrl);
        
        // Zeige Lade-Animation
        const resultDiv = document.getElementById('ocrResult');
        const brandResult = document.getElementById('brandResult');
        resultDiv.textContent = 'Suche Produkt...';
        brandResult.textContent = 'Analysiere Bild-URL...';

        // Sende Request an dein Backend
        const response = await fetch('/api/find-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl: imageUrl })
        });

        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `
                <strong>Produkt gefunden!</strong><br>
                <a href="${data.productLink}" target="_blank" style="color: blue; text-decoration: underline;">
                    Hier klicken zum Produkt
                </a>
            `;
            brandResult.textContent = `Produktcode: ${data.productCode}`;
            
            // Speichere Daten für Feedback
            window.currentProductData = {
                imageUrl: imageUrl,
                productCode: data.productCode,
                productLink: data.productLink,
                source: data.source
            };
            
        } else {
            resultDiv.textContent = '❌ Produkt nicht gefunden';
            brandResult.textContent = `Fehler: ${data.error}`;
        }
        
    } catch (error) {
        console.error('Suchfehler:', error);
        document.getElementById('ocrResult').textContent = '❌ Fehler bei der Suche';
        document.getElementById('brandResult').textContent = 'Bitte versuche es später erneut';
    }
}

// Bild-Upload verarbeiten (NEUE VERSION)
document.getElementById('imageUpload').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const preview = document.getElementById('imagePreview');
    const resultDiv = document.getElementById('ocrResult');
    const brandResult = document.getElementById('brandResult');
    const correctionSection = document.getElementById('correctionSection');

    // Bildvorschau anzeigen
    preview.innerHTML = '';
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = '300px';
    preview.appendChild(img);

    // Zeige Upload-Erfolg an
    resultDiv.textContent = '✅ Bild hochgeladen!';
    brandResult.textContent = 'Bereit für URL-Eingabe...';
    
    // Zeige URL-Eingabefeld an
    showUrlInputSection();
});

// URL-Eingabe Sektion anzeigen
function showUrlInputSection() {
    const urlSection = document.getElementById('urlInputSection');
    if (!urlSection) {
        createUrlInputSection();
    } else {
        urlSection.style.display = 'block';
    }
}

// URL-Eingabe Sektion erstellen
function createUrlInputSection() {
    const container = document.querySelector('.container');
    
    const urlSection = document.createElement('div');
    urlSection.id = 'urlInputSection';
    urlSection.style.marginTop = '20px';
    urlSection.style.padding = '15px';
    urlSection.style.border = '1px solid #ddd';
    urlSection.style.borderRadius = '5px';
    
    urlSection.innerHTML = `
        <h3>🔗 Bild-URL eingeben</h3>
        <p>Füge die URL des Produktbildes ein (z.B. von G-Star):</p>
        <input type="text" id="productImageUrl" placeholder="https://img1.g-star.com/..." style="width: 100%; padding: 10px; margin-bottom: 10px;">
        <button onclick="startProductSearch()" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px;">
            🛍️ Produkt finden
        </button>
    `;
    
    container.appendChild(urlSection);
}

// Produktsuche starten
function startProductSearch() {
    const urlInput = document.getElementById('productImageUrl');
    const imageUrl = urlInput.value.trim();
    
    if (!imageUrl) {
        alert('Bitte gib eine Bild-URL ein');
        return;
    }
    
    if (!imageUrl.startsWith('http')) {
        alert('Bitte gib eine gültige URL ein (beginnt mit http:// oder https://)');
        return;
    }
    
    searchProductByImageUrl(imageUrl);
}

// Feedback für Produktsuche
function submitProductFeedback() {
    const correctionInput = document.getElementById('brandCorrection');
    const userFeedback = correctionInput.value.trim();
    
    if (!userFeedback) {
        alert('Bitte gib Feedback ein');
        return;
    }
    
    if (!window.currentProductData) {
        alert('Keine Produktdaten verfügbar');
        return;
    }
    
    // Hier kannst du Feedback speichern
    console.log('User Feedback:', {
        productData: window.currentProductData,
        userFeedback: userFeedback
    });
    
    alert('✅ Feedback gespeichert! Danke für deine Rückmeldung.');
    
    // UI zurücksetzen
    document.getElementById('correctionSection').style.display = 'none';
    document.getElementById('brandCorrection').value = '';
}

// App initialisieren (OHNE OCR!)
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛍️ Produktsuche App gestartet');
    
    // Event Listener für Korrektur-Button
    document.getElementById('submitCorrection').addEventListener('click', submitProductFeedback);
    
    // Enter-Taste für Feedback-Eingabe
    document.getElementById('brandCorrection').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitProductFeedback();
        }
    });
});
