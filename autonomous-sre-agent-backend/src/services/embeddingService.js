const { pipeline } = require('@xenova/transformers');

class EmbeddingService {
    constructor() {
        this.extractor = null;
    }

    // 1. Load the AI model into your Mac's memory
    async init() {
        if (!this.extractor) {
            console.log("Loading embedding model...");
            // We use all-MiniLM-L6-v2 because it is incredibly fast and highly accurate for code
            this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log("Model loaded successfully!");
        }
    }

    // 2. Convert text (like an error log) into a 384-dimensional mathematical array
    async generateEmbedding(text) {
        await this.init();
        
        // We truncate the log to avoid overloading the model with massive text dumps
        const cleanText = text.substring(0, 1000); 
        
        const output = await this.extractor(cleanText, { pooling: 'mean', normalize: true });
        
        // Convert the Float32Array to a standard JavaScript array so Prisma can read it
        return Array.from(output.data);
    }
}

module.exports = new EmbeddingService();