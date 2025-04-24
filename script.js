const messageInput = document.getElementById('message');
const senderInput = document.getElementById('sender');
const status = document.getElementById('status');
const charCount = document.getElementById('charCount');
const loading = document.getElementById('loading');
const historyList = document.getElementById('historyList');
let messageHistory = [];

function updateCharCount() {
    const count = messageInput.value.length;
    charCount.textContent = `${count}/500`;
}

function clearMessage() {
    messageInput.value = '';
    senderInput.value = '';
    updateCharCount();
}

function updateHistory(message, sender) {
    messageHistory.unshift({ message, sender, timestamp: new Date() });
    if (messageHistory.length > 5) messageHistory.pop();
    
    historyList.innerHTML = messageHistory.map(item => `
        <div class="history-item">
            📝 ${item.sender ? `From: ${item.sender} - ` : ''}Message: 
            ${item.message.substring(0, 20)}${item.message.length > 20 ? '...' : ''} 
            (${new Date(item.timestamp).toLocaleTimeString()})
        </div>
    `).join('');
}

async function sendMessage() {
    const message = messageInput.value.trim();
    const sender = senderInput.value.trim();
    
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

    try {
        const response = await axios.post(url, {
            chat_id: chatId,
            text: `📨 New Message${sender ? ` from ${sender}` : ''}:\n${message}`
        });

        if (response.data.ok) {
            status.textContent = 'Message sent successfully! ✅';
            status.classList.add('success');
            clearMessage();
            updateHistory(message, sender);
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