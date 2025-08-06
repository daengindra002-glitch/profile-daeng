// Koneksi Database
const Database = require('better-sqlite3');
const db = new Database('./database/otak.db');

// Class Utama
class DAISystem {
    constructor() {
        this.initDatabase();
    }
    
    initDatabase() {
        db.exec(`
            CREATE TABLE IF NOT EXISTS pengetahuan (
                id INTEGER PRIMARY KEY,
                topik TEXT,
                konten TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS interaksi (
                id INTEGER PRIMARY KEY,
                input TEXT,
                response TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }
}

// Class untuk Chat Publik
class DAIChatSystem extends DAISystem {
    processUserInput(input) {
        // Logika chat publik
        if(this.isDeveloperQuery(input)) {
            return this.getDeveloperResponse();
        }
        return this.generateResponse(input);
    }
    
    isDeveloperQuery(input) {
        return input.toLowerCase().includes('pengembang') || 
               input.toLowerCase().includes('pembuat');
    }
    
    getDeveloperResponse() {
        return "Sistem ini dikembangkan oleh Daeng sebagai proyek AI berbahasa Indonesia.";
    }
}

// Class untuk Mode Pelatihan
class DAITrainingSystem extends DAISystem {
    startTrainingSession() {
        setInterval(() => {
            this.runDebateSession();
        }, 30000); // Debat setiap 30 detik
    }
    
    runDebateSession() {
        const topics = ['AI', 'Teknologi', 'Filsafat', 'Sains'];
        const topic = topics[Math.floor(Math.random() * topics.length)];
        this.simulateDebate(topic);
    }
}

// Inisialisasi berdasarkan halaman
if(window.location.pathname.includes('secure.html')) {
    window.DAITrainingSystem = DAITrainingSystem;
} else {
    window.DAIChatSystem = DAIChatSystem;
}
