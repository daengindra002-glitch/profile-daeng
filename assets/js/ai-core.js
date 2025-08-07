// Initialize SQL.js properly
async function initDatabase() {
    try {
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        
        return new SQL.Database();
    } catch (error) {
        console.error("Database initialization failed:", error);
        throw error;
    }
}

class AICore {
    constructor() {
        this.db = null;
        this.initialize();
    }

    async initialize() {
        try {
            this.db = await initDatabase();
            this.createTables();
            console.log("AI Core initialized successfully");
        } catch (error) {
            console.error("AI Core initialization failed:", error);
            // Fallback to in-memory storage if SQL fails
            this.db = {
                exec: () => {},
                prepare: () => ({ all: () => [], run: () => {} }),
                run: () => {}
            };
        }
    }

    createTables() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS knowledge (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                concept TEXT NOT NULL,
                context TEXT,
                weight REAL DEFAULT 1.0,
                last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                input TEXT NOT NULL,
                response TEXT NOT NULL,
                context_hash TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS vocabulary (
                word TEXT PRIMARY KEY,
                usage_count INTEGER DEFAULT 1,
                last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    // Rest of your AICore methods...
}

// Initialize with proper error handling
let aiSystem;
try {
    aiSystem = new AICore();
} catch (error) {
    console.error("Failed to create AI system:", error);
    // Provide fallback behavior
    aiSystem = {
        processInput: (input) => "System is initializing, please try again later"
    };
}