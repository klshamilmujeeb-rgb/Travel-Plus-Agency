export const geminiService = {
  /**
   * Helper to call the Netlify Function proxy.
   */
  async callProxy(action: string, payload: any) {
    const response = await fetch("/.netlify/functions/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to fetch from proxy");
    }

    return await response.json();
  },

  /**
   * Search for real-time travel information using Google Search tool.
   */
  async searchTravelTrends(query: string) {
    const data = await this.callProxy("searchTravelTrends", { query });
    return data.text;
  },

  /**
   * Get structured destination details including flights, visa, and packages.
   */
  async getDestinationDetails(destination: string) {
    return await this.callProxy("getDestinationDetails", { destination });
  },

  /**
   * Analyze travel content or provide recommendations.
   */
  async analyzeTravelContent(content: string) {
    const data = await this.callProxy("analyzeTravelContent", { content });
    return data.text;
  },

  /**
   * Generate a video from a prompt (Veo).
   */
  async generateTravelVideo(prompt: string) {
    const data = await this.callProxy("generateTravelVideo", { prompt });
    return data.operation?.response?.generatedVideos?.[0]?.video?.uri;
  }
};
