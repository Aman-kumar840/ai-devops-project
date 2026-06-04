const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const analyzeLogWithAI = async (rawLog) => {
  console.log("Analyzing log with Groq (Llama 3)...");

  const systemPrompt = `You are an expert DevOps and Systems Architect AI Assistant. 
  Analyze the provided CI/CD build log and identify the root cause of the failure.
  
  You MUST respond ONLY with a valid JSON object. 
  The JSON object must strictly follow this exact schema:
  {
    "rootCause": "A short, 1-2 sentence technical summary of the failure.",
    "explanation": "A detailed, human-readable explanation of why this happened and how to resolve it.",
    "suggestedFixes": [
      {
        "type": "COMMAND", 
        "description": "Short description of what the fix does",
        "snippet": "The exact CLI command, code, or configuration block"
      }
    ]
  }
  
  Note: The "type" field MUST be exactly one of: "COMMAND", "CODE", or "CONFIG".`;

  try {
    const response = await groq.chat.completions.create({
      // Llama 3 70B is incredibly smart and supports JSON mode
      model: "llama3-70b-8192", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the failed build log:\n\n${rawLog}` }
      ],
      response_format: { type: "json_object" }, 
      temperature: 0.1, 
    });

    const analysisResult = JSON.parse(response.choices[0].message.content);
    return analysisResult;

  } catch (error) {
    console.error("Groq API Error:", error);
    return {
      rootCause: "AI Analysis Failed",
      explanation: `Could not reach Groq: ${error.message}`,
      suggestedFixes: []
    };
  }
};

module.exports = {
  analyzeLogWithAI
};