document.getElementById('shorten-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const urlInput = document.getElementById('url-input').value;
    const resultDiv = document.getElementById('result');
    
    try {
        const response = await fetch(`${config.API_BASE_URL}/make_url?url=${encodeURIComponent(urlInput)}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const shortCode = await response.json();
            const shortUrl = `${config.API_BASE_URL}/${shortCode}`;
            
            // Clear previous results and safely build DOM elements
            resultDiv.textContent = '';
            const textNode = document.createTextNode('Shortened URL: ');
            const link = document.createElement('a');
            link.href = shortUrl;
            link.textContent = shortUrl;
            link.style.cursor = 'pointer';
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(shortUrl).then(() => {
                    const originalText = link.textContent;
                    link.textContent = 'Copied!';
                    setTimeout(() => {
                        link.textContent = originalText;
                    }, 1500);
                });
            });
            
            resultDiv.appendChild(textNode);
            resultDiv.appendChild(link);
        } else {
            resultDiv.innerText = 'Error shortening URL';
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerText = 'Error connecting to server. Make sure the backend is running and CORS is enabled.';
    }
});