import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image using Gemini 2.5 Flash Image.
 * 
 * @param base64Image The source image in base64 format (data URL or raw base64)
 * @param prompt The user's editing instruction
 * @param mimeType The mime type of the image (default image/jpeg)
 * @returns The edited image as a base64 string (raw data, no prefix)
 */
export const editImageWithGemini = async (
  base64Image: string,
  prompt: string,
  mimeType: string = 'image/jpeg'
): Promise<string> => {
  try {
    // Strip the data URL prefix if present to get raw base64
    const rawBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: rawBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // Config is optional but can help if we need specific safety settings or generation config
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("No content generated from Gemini.");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return part.inlineData.data;
      }
    }

    // If we only got text back (sometimes happens if the model refuses or just chats)
    const textPart = parts.find(p => p.text);
    if (textPart) {
      throw new Error(`The model returned text instead of an image: "${textPart.text}"`);
    }

    throw new Error("No image data found in the response.");

  } catch (error: any) {
    console.error("Gemini Edit Error:", error);
    throw new Error(error.message || "Failed to edit image.");
  }
};
