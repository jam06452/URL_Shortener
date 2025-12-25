document.getElementById('shorten-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const urlInput = document.getElementById('url-input').value;
    const resultDiv = document.getElementById('result');
    
    try {
        const response = await fetch(`http://localhost:8080/make_url?url=${encodeURIComponent(urlInput)}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const shortCode = await response.json();
            const shortUrl = `http://localhost:8080/${shortCode}`;
            resultDiv.innerHTML = `Shortened URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
        } else {
            resultDiv.innerText = 'Error shortening URL';
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerText = 'Error connecting to server. Make sure the backend is running and CORS is enabled.';
    }
});