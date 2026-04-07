import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  /**
   * Search for real-time travel information using Google Search tool.
   */
  async searchTravelTrends(query: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Search Error:", error);
      throw error;
    }
  },

  /**
   * Get structured destination details including flights, visa, and packages.
   */
  async getDestinationDetails(destination: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide comprehensive travel information for "${destination}". 
        Include:
        1. Flight trends (typical prices from India, airlines).
        2. Visa requirements for Indian citizens.
        3. Top 3 tour packages with prices and durations.
        4. Best time to visit.
        5. A brief description.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              destination: { type: Type.STRING },
              description: { type: Type.STRING },
              bestTimeToVisit: { type: Type.STRING },
              flights: {
                type: Type.OBJECT,
                properties: {
                  averagePrice: { type: Type.STRING },
                  airlines: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tips: { type: Type.STRING }
                }
              },
              visa: {
                type: Type.OBJECT,
                properties: {
                  requirement: { type: Type.STRING },
                  fee: { type: Type.STRING },
                  processingTime: { type: Type.STRING },
                  documents: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              packages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    price: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                }
              }
            },
            required: ["destination", "description", "flights", "visa", "packages"]
          }
        },
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Destination Details Error:", error);
      throw error;
    }
  },

  /**
   * Analyze travel content or provide recommendations.
   */
  async analyzeTravelContent(content: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following travel content and provide a summary with key highlights and recommendations: ${content}`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      throw error;
    }
  },

  /**
   * Generate a video from a prompt (Veo).
   */
  async generateTravelVideo(prompt: string) {
    try {
      const operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      // Polling for completion (simplified for demo)
      let currentOp: any = operation;
      while (!currentOp.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        // In a real app, you'd fetch the operation status. 
        break; 
      }
      
      return currentOp.response?.generatedVideos?.[0]?.video?.uri;
    } catch (error) {
      console.error("Veo Video Generation Error:", error);
      throw error;
    }
  }
};
