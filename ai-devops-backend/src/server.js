const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const Groq = require('groq-sdk');
const embeddingService = require('./services/embeddingService');

const app = express();
const prisma = new PrismaClient();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

// ==========================================
// THE AI MEMORY PIPELINE
// ==========================================
async function analyzeLogWithMemory(rawLog, buildName) {
    console.log(`\n🤖 Analyzing new log for build: ${buildName}`);
    
    // 1. Generate embedding for the new error
    console.log("-> Generating vector embedding for the error...");
    const currentErrorEmbedding = await embeddingService.generateEmbedding(rawLog);

    // 2. Search Postgres for similar past errors
    console.log("-> Searching vector database for similar past fixes...");
    const similarPastErrors = await prisma.$queryRaw`
        SELECT "rootCause", "explanation", "status",
        1 - (embedding <=> ${currentErrorEmbedding}::vector) as similarity
        FROM "LogAnalysis"
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> ${currentErrorEmbedding}::vector
        LIMIT 3;
    `;

    // 3. Inject past context into Groq if we find a high-quality match
    let memoryContext = "";
    if (similarPastErrors.length > 0 && similarPastErrors[0].similarity > 0.85) {
        console.log(`-> 🧠 MEMORY TRIGGERED! Found a past fix with ${Math.round(similarPastErrors[0].similarity * 100)}% match.`);
        memoryContext = `
        IMPORTANT SYSTEM MEMORY:
        I have seen similar errors in the past. Here is how they were solved:
        ${JSON.stringify(similarPastErrors)}
        
        Use this historical context to help formulate your current answer. If the past fix applies here, heavily reference it.
        `;
    } else {
        console.log("-> No highly similar past fixes found. Analyzing from scratch.");
    }

    // 4. Send to Groq for analysis
    console.log("-> Sending context to Groq (Llama 3)...");
    const systemPrompt = `You are a Senior DevOps Engineer analyzing Jenkins CI/CD logs.
    ${memoryContext}
    
    Analyze the following raw log and return a JSON object with strictly these two keys:
    1. "rootCause": A short, 1-sentence summary of what broke.
    2. "explanation": A detailed, step-by-step explanation of why it broke and how to fix it.
    
    Do not include any markdown formatting or text outside the JSON object.`;

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Log: ${rawLog}` }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.2, // Keep it low for analytical consistency
        response_format: { type: "json_object" }
    });

    // 🚨 Extract and parse the response from Groq
    const groqResponse = JSON.parse(chatCompletion.choices[0].message.content);

    // Ensure explanation is a string (flatten array if necessary)
    const formattedExplanation = Array.isArray(groqResponse.explanation) 
        ? groqResponse.explanation.join('\n') 
        : groqResponse.explanation;

    // 5. Save to database
    console.log("-> Saving analysis to database...");
    const savedLog = await prisma.logAnalysis.create({
        data: {
            buildName: buildName,
            rawLog: rawLog,
            rootCause: groqResponse.rootCause,
            explanation: formattedExplanation, // <-- Formatted string used here!
            status: 'COMPLETED'
        }
    });

    // 6. Save the Vector Embedding to the new row using Raw SQL
    console.log("-> Committing vector memory to Postgres...");
    await prisma.$executeRaw`
        UPDATE "LogAnalysis"
        SET embedding = ${currentErrorEmbedding}::vector
        WHERE id = ${savedLog.id};
    `;

    console.log("✅ Analysis complete and memory saved!\n");
    return savedLog;
}

// ==========================================
// ROUTES
// ==========================================

// The Webhook Endpoint that Jenkins will hit
app.post('/api/webhook', async (req, res) => {
    try {
        const { buildName, logOutput } = req.body;

        if (!buildName || !logOutput) {
            return res.status(400).json({ error: "Missing buildName or logOutput" });
        }

        // Acknowledge receipt immediately so Jenkins doesn't time out
        res.status(202).json({ message: "Log received, AI analysis started in background." });

        // Run the heavy AI pipeline in the background
        analyzeLogWithMemory(logOutput, buildName).catch(err => {
            console.error("❌ Background Analysis Failed:", err);
        });

    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Endpoint for your React Dashboard to fetch all logs
app.get('/api/logs', async (req, res) => {
    try {
        const logs = await prisma.logAnalysis.findMany({
            orderBy: { createdAt: 'desc' },
            select: { id: true, buildName: true, status: true, rootCause: true, createdAt: true }
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch logs" });
    }
});

// Endpoint for your React BuildDetails page
app.get('/api/logs/:id', async (req, res) => {
    try {
        const log = await prisma.logAnalysis.findUnique({
            where: { id: req.params.id }
        });
        if (!log) return res.status(404).json({ error: "Log not found" });
        res.json(log);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch log details" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 AI DevOps Backend running on port ${PORT}`);
});