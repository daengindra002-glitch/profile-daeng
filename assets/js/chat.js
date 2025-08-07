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