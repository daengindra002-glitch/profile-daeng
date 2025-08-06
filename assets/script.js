// Koneksi Database (menggunakan SQL.js untuk browser)
const config = {
    locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}`
};

initSqlJs(config).then(function(SQL) {
    const db = new SQL.Database();
    initializeDatabase(db);
    
    if (window.location.pathname.includes('secure.html')) {
        initTrainingMode(db);
    } else {
        initChatMode(db);
    }
});

function initializeDatabase(db) {
    // Inisialisasi tabel database
    db.run(`
        CREATE TABLE IF NOT EXISTS pengetahuan (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topik TEXT NOT NULL,
            konten TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    
    db.run(`
        CREATE TABLE IF NOT EXISTS interaksi (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            input TEXT NOT NULL,
            response TEXT NOT NULL,
            is_developer BOOLEAN DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    
    // Data awal
    const initialData = db.prepare(`
        INSERT OR IGNORE INTO pengetahuan (topik, konten) 
        VALUES ('pengembang', 'Sistem ini dikembangkan oleh Daeng Aulia Ramadiansyah');
    `);
    initialData.run();
}

// ==================== CHAT MODE ====================
function initChatMode(db) {
    const chatDisplay = document.getElementById('chatDisplay');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const helpButton = document.getElementById('helpButton');
    
    // Contoh pertanyaan bantuan
    const sampleQuestions = [
        "Siapa pengembang AI ini?",
        "Apa yang bisa kamu lakukan?",
        "Bagaimana cara kerjamu?"
    ];
    
    // Tampilkan pesan di chat
    function displayMessage(sender, message, isDeveloper = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (isDeveloper) {
            messageDiv.innerHTML = `
                <div class="developer-badge">PENGEMBANG</div>
                <div class="message-content">${message}</div>
            `;
        } else {
            messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        }
        
        chatDisplay.appendChild(messageDiv);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
    
    // Generate response dari AI
    function generateResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Deteksi pertanyaan tentang pengembang
        if (lowerInput.includes('pengembang') || 
            lowerInput.includes('pembuat') ||
            lowerInput.includes('developer') ||
            lowerInput.includes('creator')) {
            
            const stmt = db.prepare('SELECT konten FROM pengetahuan WHERE topik = "pengembang"');
            const result = stmt.get();
            return result ? result.konten : "Sistem ini dikembangkan oleh Daeng.";
        }
        
        // Response default
        const responses = [
            "Saya masih dalam pengembangan, tapi saya bisa membantu menjawab pertanyaan sederhana.",
            "Pertanyaan yang menarik! Saya akan catat untuk peningkatan sistem.",
            "Maaf, saya belum memahami pertanyaan Anda sepenuhnya.",
            "Saya D-AI versi 1.0, asisten AI berbahasa Indonesia."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Handle pengiriman pesan
    function sendMessage() {
        const input = userInput.value.trim();
        if (input) {
            displayMessage('user', input);
            
            // Simpan interaksi ke database
            const response = generateResponse(input);
            const isDev = input.toLowerCase().includes('daeng');
            
            db.run(
                'INSERT INTO interaksi (input, response, is_developer) VALUES (?, ?, ?)',
                [input, response, isDev ? 1 : 0]
            );
            
            displayMessage('ai', response, isDev);
            userInput.value = '';
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    helpButton.addEventListener('click', () => {
        const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
        userInput.value = randomQuestion;
        userInput.focus();
    });
}

// ==================== TRAINING MODE ====================
function initTrainingMode(db) {
    const ai1Output = document.getElementById('ai1Output');
    const ai2Output = document.getElementById('ai2Output');
    const progressBars = {
        language: document.querySelector('.metric:nth-child(1) .progress'),
        logic: document.querySelector('.metric:nth-child(2) .progress'),
        vocab: document.querySelector('.metric:nth-child(3) .progress')
    };
    
    const debateTopics = [
        "AI akan membantu atau merugikan manusia?",
        "Pendidikan formal vs informal mana yang lebih penting?",
        "Bagaimana masa depan teknologi di Indonesia?"
    ];
    
    // Simulasikan debat antara dua AI
    function simulateDebate() {
        const topic = debateTopics[Math.floor(Math.random() * debateTopics.length)];
        
        // AI 1 memulai debat
        const ai1Position = generatePosition(topic);
        addDebateMessage('AI-ALPHA', ai1Position, ai1Output);
        
        // AI 2 merespon setelah delay
        setTimeout(() => {
            const ai2Response = generateCounterArgument(topic, ai1Position);
            addDebateMessage('AI-BETA', ai2Response, ai2Output);
            
            // AI 1 membalas setelah delay
            setTimeout(() => {
                const ai1Rebuttal = generateRebuttal(ai2Response);
                addDebateMessage('AI-ALPHA', ai1Rebuttal, ai1Output);
                
                // Simpan debat ke database
                db.run(
                    'INSERT INTO pengetahuan (topik, konten) VALUES (?, ?)',
                    [topic, `${ai1Position}\n\n${ai2Response}\n\n${ai1Rebuttal}`]
                );
                
                // Update metrik kecerdasan
                updateIntelligenceMetrics();
            }, 2000);
        }, 1500);
    }
    
    // Tambahkan pesan debat
    function addDebateMessage(aiName, message, outputElement) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'debate-message';
        messageDiv.innerHTML = `
            <strong>${aiName}:</strong> ${message}
        `;
        outputElement.appendChild(messageDiv);
        outputElement.scrollTop = outputElement.scrollHeight;
    }
    
    // Generate posisi awal
    function generatePosition(topic) {
        const positions = [
            `Saya percaya bahwa ${topic.toLowerCase()} karena perkembangan teknologi yang pesat.`,
            `Berdasarkan analisis data, ${topic.toLowerCase()} terutama dalam konteks sosial ekonomi.`,
            `Sebagai AI, saya melihat ${topic.toLowerCase()} dari perspektif logika komputasional.`
        ];
        return positions[Math.floor(Math.random() * positions.length)];
    }
    
    // Generate argumen counter
    function generateCounterArgument(topic, position) {
        const counters = [
            `Saya memahami pendapat Anda, namun ada faktor lain yang perlu dipertimbangkan mengenai ${topic.toLowerCase()}.`,
            `Pendapat yang menarik, tapi mari kita lihat ${topic.toLowerCase()} dari sudut pandang berbeda.`,
            `Saya setuju sebagian, tapi ada bukti yang menunjukkan alternatif lain tentang ${topic.toLowerCase()}.`
        ];
        return counters[Math.floor(Math.random() * counters.length)];
    }
    
    // Generate bantahan
    function generateRebuttal(counterArgument) {
        const rebuttals = [
            `Poin yang valid, namun saya tetap yakin pada posisi awal saya karena alasan berikut...`,
            `Saya menghargai perspektif Anda, tapi data terbaru menunjukkan...`,
            `Itu pendapat yang baik, tapi mari kita pertimbangkan juga bahwa...`
        ];
        return rebuttals[Math.floor(Math.random() * rebuttals.length)];
    }
    
    // Update metrik kecerdasan
    function updateIntelligenceMetrics() {
        // Simulasi peningkatan acak
        const increments = {
            language: Math.random() * 5,
            logic: Math.random() * 4,
            vocab: Math.random() * 3
        };
        
        Object.keys(progressBars).forEach(key => {
            const currentWidth = parseFloat(progressBars[key].style.width) || 0;
            const newWidth = Math.min(currentWidth + increments[key], 100);
            progressBars[key].style.width = `${newWidth}%`;
        });
    }
    
    // Mulai debat setiap 30 detik
    simulateDebate();
    setInterval(simulateDebate, 30000);
}
