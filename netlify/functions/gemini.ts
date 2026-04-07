import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { action, payload } = JSON.parse(event.body);

    if (action === "searchTravelTrends") {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: payload.query,
        config: {
          tools: [{ googleSearch: {} } as any],
        },
      });
      return { statusCode: 200, body: JSON.stringify({ text: response.text }) };
    }

    if (action === "getDestinationDetails") {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide comprehensive travel information for "${payload.destination}". 
        Include:
        1. Flight trends (typical prices from India, airlines).
        2. Visa requirements for Indian citizens.
        3. Top 3 tour packages with prices and durations.
        4. Best time to visit.
        5. A brief description.`,
        config: {
          tools: [{ googleSearch: {} } as any],
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
          } as any
        },
      });
      return { statusCode: 200, body: JSON.stringify(JSON.parse(response.text)) };
    }

    if (action === "analyzeTravelContent") {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following travel content and provide a summary with key highlights and recommendations: ${payload.content}`,
      });
      return { statusCode: 200, body: JSON.stringify({ text: response.text }) };
    }

    if (action === "generateTravelVideo") {
      // Note: Veo generation might take longer than Netlify Function timeout (10s default)
      // This is a simplified proxy.
      const operation = await (ai as any).models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: payload.prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });
      return { statusCode: 200, body: JSON.stringify({ operation }) };
    }

    return { statusCode: 400, body: "Invalid Action" };
  } catch (error: any) {
    console.error("Netlify Function Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
