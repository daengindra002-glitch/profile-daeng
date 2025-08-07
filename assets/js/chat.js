<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for AI system to initialize
    while (!aiSystem || !aiSystem.db) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const chatDisplay = document.getElementById('chatDisplay');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    async function sendMessage() {
        const input = userInput.value.trim();
        if (!input) return;
        
        addMessage('user', input);
        userInput.value = '';
        
        try {
            const response = await aiSystem.processInput(input);
            addMessage('ai', response);
            saveToHistory(input, response);
        } catch (error) {
            console.error("Error processing message:", error);
            addMessage('ai', "I encountered an error processing your request");
        }
    }

    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        chatDisplay.appendChild(messageDiv);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    // Event listeners with error handling
    sendBtn.addEventListener('click', () => {
        sendMessage().catch(console.error);
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage().catch(console.error);
        }
    });
});
=======
document.addEventListener('DOMContentLoaded', () => {
    const chatDisplay = document.getElementById('chatDisplay');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const micBtn = document.getElementById('micBtn');
    const historyBtn = document.getElementById('historyBtn');
    const historyModal = document.getElementById('historyModal');
    const closeModal = document.getElementById('closeModal');
    const historyList = document.getElementById('historyList');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Load conversation history
    loadHistory();

    // Send message handler
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Suggestion buttons
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            userInput.value = btn.dataset.prompt;
            userInput.focus();
        });
    });

    // History modal
    historyBtn.addEventListener('click', () => {
        historyModal.classList.remove('hidden');
        loadHistoryList();
    });
    
    closeModal.addEventListener('click', () => {
        historyModal.classList.add('hidden');
    });

    async function sendMessage() {
        const input = userInput.value.trim();
        if (!input) return;
        
        // Add user message to display
        addMessage('user', input);
        userInput.value = '';
        
        // Get AI response
        const response = await aiSystem.processInput(input);
        
        // Add AI response to display
        addMessage('ai', response);
        
        // Save to history
        saveToHistory(input, response);
    }

    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">${text}</div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">${text}</div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            `;
        }
        
        chatDisplay.appendChild(messageDiv);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    function saveToHistory(input, response) {
        const conversation = {
            input,
            response,
            timestamp: new Date().toISOString()
        };
        
        // Save to IndexedDB
        const request = indexedDB.open('AIConversations', 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('conversations')) {
                db.createObjectStore('conversations', { keyPath: 'timestamp' });
            }
        };
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['conversations'], 'readwrite');
            const store = transaction.objectStore('conversations');
            store.add(conversation);
        };
    }

    function loadHistoryList() {
        historyList.innerHTML = '';
        
        const request = indexedDB.open('AIConversations', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['conversations'], 'readonly');
            const store = transaction.objectStore('conversations');
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => {
                const conversations = getAllRequest.result.reverse();
                
                if (conversations.length === 0) {
                    historyList.innerHTML = '<p class="empty-history">No conversation history yet</p>';
                    return;
                }
                
                conversations.forEach(conv => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.innerHTML = `
                        <div class="history-input">${conv.input}</div>
                        <div class="history-response">${conv.response.substring(0, 50)}...</div>
                        <div class="history-time">${new Date(conv.timestamp).toLocaleString()}</div>
                    `;
                    historyList.appendChild(historyItem);
                });
            };
        };
    }
});
>>>>>>> 02e1d492883e69c4b52722bee7592834a198903a
