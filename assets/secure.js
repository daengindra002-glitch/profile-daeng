document.addEventListener('DOMContentLoaded', () => {
    const ai1Console = document.getElementById('ai1Console');
    const ai2Console = document.getElementById('ai2Console');
    const knowledgeLog = document.getElementById('knowledgeLog');
    const conceptCount = document.getElementById('conceptCount');
    const connectionCount = document.getElementById('connectionCount');
    const vocabCount = document.getElementById('vocabCount');
    const speedUpBtn = document.getElementById('speedUpBtn');
    const addTopicBtn = document.getElementById('addTopicBtn');

    let debateSpeed = 3000; // Default 3 seconds per turn
    let activeTopics = [
        "Artificial Intelligence", 
        "Machine Learning", 
        "Natural Language Processing"
    ];

    // Start AI debate
    startDebate();

    // Speed control
    speedUpBtn.addEventListener('click', () => {
        debateSpeed = Math.max(500, debateSpeed - 500);
        toastMessage(`Debate speed increased to ${(1000/debateSpeed).toFixed(1)} turns/sec`);
    });

    // Add new topic
    addTopicBtn.addEventListener('click', () => {
        const newTopic = prompt("Enter new debate topic:");
        if (newTopic) {
            activeTopics.push(newTopic);
            toastMessage(`Added new topic: ${newTopic}`);
        }
    });

    async function startDebate() {
        while (true) {
            const topic = getRandomTopic();
            await runDebateCycle(topic);
            await new Promise(resolve => setTimeout(resolve, debateSpeed));
        }
    }

    function getRandomTopic() {
        return activeTopics[Math.floor(Math.random() * activeTopics.length)];
    }

    async function runDebateCycle(topic) {
        // AI 1 presents initial argument
        const ai1Argument = await aiSystem.generateDebateArgument(topic, 'initial');
        addDebateMessage('ai1', `[${topic}] ${ai1Argument}`);
        
        // AI 2 responds
        await new Promise(resolve => setTimeout(resolve, debateSpeed/2));
        const ai2Response = await aiSystem.generateDebateArgument(topic, 'rebuttal', ai1Argument);
        addDebateMessage('ai2', ai2Response);
        
        // AI 1 counters
        await new Promise(resolve => setTimeout(resolve, debateSpeed/2));
        const ai1Counter = await aiSystem.generateDebateArgument(topic, 'counter', ai2Response);
        addDebateMessage('ai1', ai1Counter);
        
        // Update knowledge metrics
        updateKnowledgeMetrics();
    }

    function addDebateMessage(ai, message) {
        const consoleElement = ai === 'ai1' ? ai1Console : ai2Console;
        const messageDiv = document.createElement('div');
        messageDiv.className = `debate-message ${ai}-message`;
        
        const timestamp = new Date().toLocaleTimeString();
        messageDiv.innerHTML = `
            <span class="message-time">[${timestamp}]</span>
            <span class="message-content">${message}</span>
        `;
        
        consoleElement.appendChild(messageDiv);
        consoleElement.scrollTop = consoleElement.scrollHeight;
        
        // Also log significant knowledge updates
        if (message.includes("learned") || message.includes("new concept")) {
            addKnowledgeLog(message);
        }
    }

    function addKnowledgeLog(message) {
        const logEntry = document.createElement('div');
        logEntry.className = 'knowledge-entry';
        
        const timestamp = new Date().toLocaleTimeString();
        logEntry.innerHTML = `
            <span class="log-time">[${timestamp}]</span>
            <span class="log-content">${message}</span>
        `;
        
        knowledgeLog.appendChild(logEntry);
        knowledgeLog.scrollTop = knowledgeLog.scrollHeight;
    }

    function updateKnowledgeMetrics() {
        // Get counts from database
        aiSystem.db.all(`
            SELECT 
                (SELECT COUNT(*) FROM knowledge) as concepts,
                (SELECT COUNT(*) FROM vocabulary) as vocabulary,
                (SELECT COUNT(*) FROM knowledge WHERE weight > 0.5) as strong_connections
        `, [], (err, rows) => {
            if (rows && rows.length > 0) {
                const data = rows[0];
                conceptCount.textContent = data.concepts.toLocaleString();
                vocabCount.textContent = data.vocabulary.toLocaleString();
                connectionCount.textContent = (data.strong_connections * 3).toLocaleString();
            }
        });
    }

    function toastMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
});
