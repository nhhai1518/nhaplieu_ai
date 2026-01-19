
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const validateAndFormatData = async (name: string, unit: string, phone: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Hãy kiểm tra và chuẩn hóa dữ liệu giáo dục sau đây: 
    Họ tên: ${name}
    Đơn vị: ${unit}
    Số điện thoại: ${phone}
    
    Yêu cầu:
    1. Chuẩn hóa họ tên (viết hoa chữ cái đầu).
    2. Kiểm tra tính hợp lệ của số điện thoại Việt Nam.
    3. Đưa ra gợi ý nếu dữ liệu có vẻ sai sót.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN },
          normalizedName: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["isValid", "normalizedName", "suggestions"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return { isValid: true, normalizedName: name, suggestions: [] };
  }
};
