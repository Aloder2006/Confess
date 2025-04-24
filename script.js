const messageInput = document.getElementById('message');
const senderInput = document.getElementById('sender');
const status = document.getElementById('status');
const charCount = document.getElementById('charCount');
const loading = document.getElementById('loading');
const sendBtn = document.getElementById('sendBtn');

function updateCharCount() {
    const count = messageInput.value.length;
    charCount.textContent = `${count}/500`;
}

function clearMessage() {
    messageInput.value = '';
    senderInput.value = '';
    updateCharCount();
}

async function getUserInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const browser = navigator.appName || 'Unknown';
    const screen = `${window.screen.width}x${window.screen.height}`;
    const timestamp = new Date().toISOString();

    return {
        userAgent,
        platform,
        browser,
        screen,
        timestamp
    };
}



async function sendMessage() {
    const message = messageInput.value.trim();
    const sender = senderInput.value.trim();
    const userInfo = await getUserInfo();

    
    if (!message) {
        status.textContent = 'Please enter a message! ⚠️';
        status.style.display = 'block';
        setTimeout(() => status.style.display = 'none', 3000);
        return;
    }

    loading.classList.add('active');

    // Replace with your Telegram Bot Token and Chat ID
    const botToken = '8179260298:AAECPoAzoyCu3l3vK4Uxeg3qdVlMO4wJfwE';
    const chatId = '1987268737';
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const text = `
📨 New Message${sender ? ` from ${sender}` : ''}

📝 Message: 
${message}


📱 Device: ${userInfo.userAgent}
💻 Platform: ${userInfo.platform}
🌍 Browser: ${userInfo.browser}
🖥️ Screen: ${userInfo.screen}
⏰ Time: ${userInfo.timestamp}
                `;

    try {
        const response = await axios.post(url, {
            chat_id: chatId,
            text: text
        });

        if (response.data.ok) {
            status.textContent = 'Message sent successfully! ✅';
            status.classList.add('success');
            clearMessage();
        } else {
            status.textContent = 'Failed to send message! ❌';
        }
    } catch (error) {
        status.textContent = 'Error sending message! ⚠️';
        console.error('Error:', error);
    }

    loading.classList.remove('active');
    status.style.display = 'block';
    setTimeout(() => {
        status.style.display = 'none';
        status.classList.remove('success');
    }, 3000);
}


messageInput.addEventListener('input', updateCharCount);
updateCharCount();