const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service to interact with Google Gemini AI.
 */
class GeminiService {
  constructor() {
    // Initialize the AI client using the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } else {
      console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
    }
  }

  /**
   * Generates a response from the AI based on the user prompt.
   * @param {string} prompt - The user's query or instruction.
   * @param {Object} context - Contextual data (tasks, subjects) to feed the AI.
   * @returns {Promise<string>} The AI's generated response.
   */
  async generateResponse(prompt, context = {}) {
    if (!this.model) {
      throw new Error("AI service is not configured properly.");
    }

    try {
      // Create a system prompt providing context about the user's data
      const systemPrompt = `
You are the StudyAI Assistant. 
Here is the user's current context:
Tasks: ${JSON.stringify(context.tasks || [])}
Subjects: ${JSON.stringify(context.subjects || [])}

User says: ${prompt}

Provide a helpful, concise response focusing on productivity and study habits.
      `;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini Service Error:", error);
      throw new Error("Failed to generate AI response.");
    }
  }
}

module.exports = new GeminiService();
