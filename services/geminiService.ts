
import { GoogleGenAI, Type } from "@google/genai";

export const validateAndFormatData = async (name: string, unit: string, phone: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Bạn là trợ lý hành chính chuyên nghiệp của Phòng Giáo dục Việt Nam. 
    Hãy kiểm tra và chuẩn hóa thông tin sau:
    - Họ và tên: ${name}
    - Đơn vị: ${unit}
    - SĐT: ${phone}

    Yêu cầu:
    1. Viết hoa chuẩn tiếng Việt cho Họ tên.
    2. Kiểm tra nếu đơn vị (Trường/Phòng) có vẻ viết tắt sai hoặc thiếu thông tin.
    3. Kiểm tra định dạng số điện thoại Việt Nam (10 số).
    
    Trả về định dạng JSON chính xác.`,
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
    console.warn("Gemini Parse Error:", e);
    return { isValid: true, normalizedName: name, suggestions: ["Không thể phân tích dữ liệu chuyên sâu tại thời điểm này."] };
  }
};
