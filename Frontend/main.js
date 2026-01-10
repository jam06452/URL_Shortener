const form = document.getElementById('shorten-form');
const resultDiv = document.getElementById('result');
const urlInput = document.getElementById('url-input');

// Clear result when user types in the input
urlInput.addEventListener('input', () => {
    if (resultDiv.innerHTML) {
        resultDiv.innerHTML = '';
    }
});

async function performShortening(urlInputValue, isMessage = false) {
    resultDiv.textContent = 'Compressing...';
    
    try {
        const messageParam = isMessage ? '&message=true' : '';
        const response = await fetch(`${config.API_BASE_URL}/make_url?url=${encodeURIComponent(urlInputValue)}${messageParam}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const data = await response.json();
            const shortCode = Object.values(data)[0];
            const shortUrl = `https://url.jam06452.uk/${shortCode}`;
            
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
}

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    let urlInputValue = urlInput.value.trim();
    
    // Check if input has a dot - if not, treat as message
    if (!urlInputValue.includes('.')) {
        showSendAsTextPrompt('Would you like to send this as a message?');
        return;
    }
    
    // URL mode - apply URL validation and formatting
    // Basic Protocol Auto-fix
    if (!/^https?:\/\//i.test(urlInputValue)) {
        urlInputValue = 'https://' + urlInputValue;
    }

    // Remove www. and trailing slash
    urlInputValue = urlInputValue.replace(/^(https?:\/\/)(www\.)/, '$1');
    if (urlInputValue.endsWith('/')) {
        urlInputValue = urlInputValue.slice(0, -1);
    }

    // URL Syntax Validation
    try {
        new URL(urlInputValue);
    } catch (err) {
        resultDiv.innerText = 'Invalid URL format. Please include http:// or https://';
        return;
    }

    resultDiv.innerText = 'Verifying site reachability...';

    // Verify availability (Ping)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        await fetch(urlInputValue, { 
            method: 'HEAD', 
            mode: 'no-cors', 
            signal: controller.signal 
        });
        clearTimeout(timeoutId);
        
        // If successful (or opaque response), proceed
        performShortening(urlInputValue);
        
    } catch (error) {
        console.warn('Ping check failed', error);
        showSendAsTextPrompt('Site not reachable. Send as text instead?');
    }
});

function showSendAsTextPrompt(messageText = 'Send as text instead?') {
    // Build error UI instantly all at once
    const msg = document.createElement('div');
    msg.textContent = messageText;
    msg.style.color = '#ff4444';
    msg.style.marginBottom = '1rem';
    msg.style.fontWeight = '900';
    msg.style.letterSpacing = '0.05em';
    
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '1rem';
    btnContainer.style.marginTop = '1rem';
    
    const sendBtn = document.createElement('button');
    sendBtn.type = 'button';
    sendBtn.textContent = 'SEND AS MESSAGE';
    sendBtn.style.flex = '1';
    sendBtn.style.padding = '1rem';
    sendBtn.style.background = 'var(--magenta)';
    sendBtn.style.color = 'var(--bg-deep)';
    sendBtn.style.border = '3px solid var(--magenta)';
    sendBtn.style.fontFamily = "'Arial Black', sans-serif";
    sendBtn.style.fontSize = '0.9rem';
    sendBtn.style.fontWeight = '900';
    sendBtn.style.textTransform = 'uppercase';
    sendBtn.style.letterSpacing = '0.1em';
    sendBtn.style.cursor = 'pointer';
    sendBtn.style.transition = 'all 0.15s ease-out';
    sendBtn.style.boxShadow = '3px 3px 0 var(--yellow)';
    
    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const originalInput = urlInput.value.trim();
        performShortening(originalInput, true);
    });
    
    sendBtn.addEventListener('mouseenter', () => {
        sendBtn.style.background = 'var(--yellow)';
        sendBtn.style.borderColor = 'var(--yellow)';
        sendBtn.style.transform = 'translate(-2px, -2px)';
        sendBtn.style.boxShadow = '5px 5px 0 var(--magenta)';
    });
    
    sendBtn.addEventListener('mouseleave', () => {
        sendBtn.style.background = 'var(--magenta)';
        sendBtn.style.borderColor = 'var(--magenta)';
        sendBtn.style.transform = 'translate(0, 0)';
        sendBtn.style.boxShadow = '3px 3px 0 var(--yellow)';
    });
    
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'CANCEL';
    cancelBtn.style.flex = '1';
    cancelBtn.style.padding = '1rem';
    cancelBtn.style.background = 'transparent';
    cancelBtn.style.color = 'var(--text-secondary)';
    cancelBtn.style.border = '2px solid var(--text-secondary)';
    cancelBtn.style.fontFamily = "'Arial Black', sans-serif";
    cancelBtn.style.fontSize = '0.9rem';
    cancelBtn.style.fontWeight = '900';
    cancelBtn.style.textTransform = 'uppercase';
    cancelBtn.style.letterSpacing = '0.1em';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.style.transition = 'all 0.15s ease-out';
    
    cancelBtn.addEventListener('click', () => {
        resultDiv.style.animation = 'slideUp 0.25s ease-out';
        setTimeout(() => {
            resultDiv.innerHTML = '';
            resultDiv.style.animation = '';
        }, 250);
    });
    
    cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.color = 'var(--white)';
        cancelBtn.style.borderColor = 'var(--white)';
    });
    
    cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.color = 'var(--text-secondary)';
        cancelBtn.style.borderColor = 'var(--text-secondary)';
    });
    
    btnContainer.appendChild(sendBtn);
    btnContainer.appendChild(cancelBtn);
    
    // Clear and build all elements at once, THEN animate
    resultDiv.innerHTML = '';
    resultDiv.appendChild(msg);
    resultDiv.appendChild(btnContainer);
    resultDiv.style.animation = 'slideDown 0.25s ease-out';
}