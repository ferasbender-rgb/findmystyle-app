// PRODUKT-SUCHE FUNKTION - Für G-Star und andere Shops
async function searchProductByImageUrl(imageUrl) {
    try {
        console.log('Starte Produktsuche für:', imageUrl);
        
        // Zeige Lade-Animation
        const resultDiv = document.getElementById('ocrResult');
        const brandResult = document.getElementById('brandResult');
        resultDiv.textContent = '🔍 Suche Produkt...';
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
                <div style="background: #d4edda; padding: 15px; border-radius: 5px; border: 1px solid #c3e6cb;">
                    <strong style="color: #155724;">✅ Produkt gefunden!</strong><br><br>
                    <a href="${data.productLink}" target="_blank" 
                       style="background: #007bff; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none; display: inline-block;">
                       🛒 Hier klicken zum Produkt
                    </a>
                </div>
            `;
            brandResult.textContent = `📋 Produktcode: ${data.productCode}`;
            
        } else {
            resultDiv.innerHTML = `
                <div style="background: #f8d7da; padding: 15px; border-radius: 5px; border: 1px solid #f5c6cb;">
                    <strong style="color: #721c24;">❌ Produkt nicht gefunden</strong>
                    <p>${data.error || 'Bitte versuche ein anderes Bild'}</p>
                </div>
            `;
            brandResult.textContent = '';
        }
        
    } catch (error) {
        console.error('Suchfehler:', error);
        document.getElementById('ocrResult').innerHTML = `
            <div style="background: #f8d7da; padding: 15px; border-radius: 5px;">
                <strong>❌ Fehler bei der Suche</strong>
                <p>Bitte versuche es später erneut</p>
            </div>
        `;
        document.getElementById('brandResult').textContent = '';
    }
}

// Bild-Upload verarbeiten
document.getElementById('imageUpload').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const preview = document.getElementById('imagePreview');
    const resultDiv = document.getElementById('ocrResult');
    const brandResult = document.getElementById('brandResult');

    // Bildvorschau anzeigen
    preview.innerHTML = '';
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = '300px';
    img.style.borderRadius = '5px';
    preview.appendChild(img);

    // Zeige Upload-Erfolg an
    resultDiv.innerHTML = `
        <div style="background: #d1ecf1; padding: 15px; border-radius: 5px;">
            <strong>✅ Bild erfolgreich hochgeladen!</strong>
            <p>Jetzt Bild-URL eingeben um Produkt zu finden</p>
        </div>
    `;
    brandResult.textContent = '';
    
    // Zeige URL-Eingabefeld an
    showUrlInputSection();
});

// URL-Eingabe Sektion anzeigen
function showUrlInputSection() {
    let urlSection = document.getElementById('urlInputSection');
    
    if (!urlSection) {
        urlSection = document.createElement('div');
        urlSection.id = 'urlInputSection';
        urlSection.style.marginTop = '20px';
        urlSection.style.padding = '20px';
        urlSection.style.border = '2px dashed #dee2e6';
        urlSection.style.borderRadius = '10px';
        urlSection.style.background = '#f8f9fa';
        
        urlSection.innerHTML = `
            <h3 style="margin-top: 0;">🔗 Bild-URL eingeben</h3>
            <p>Füge die URL des Produktbildes ein (z.B. von G-Star):</p>
            <input type="text" id="productImageUrl" 
                   placeholder="https://img1.g-star.com/..." 
                   style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ced4da; border-radius: 5px; font-size: 16px;">
            <button onclick="startProductSearch()" 
                    style="background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                🛍️ Produkt finden
            </button>
        `;
        
        document.querySelector('.container').appendChild(urlSection);
    } else {
        urlSection.style.display = 'block';
    }
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

// App initialisieren
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛍️ Produktsuche App gestartet - Ohne OCR!');
    
    // Verstecke Korrektur-Sektion da nicht benötigt
    document.getElementById('correctionSection').style.display = 'none';
});
