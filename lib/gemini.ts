import { GoogleGenAI } from "@google/genai";

/**
 * 환경변수에서 API 키를 읽어 Gemini 클라이언트를 반환합니다.
 * Vercel: GEMINI_API_KEY 환경변수 설정
 * 로컬: .env.local 에 GEMINI_API_KEY 설정
 */
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY가 설정되지 않았습니다. .env.local 또는 Vercel 환경변수를 확인하세요."
    );
  }
  return new GoogleGenAI({ apiKey });
}

/** generateContent 응답에서 텍스트 추출 (response.text fallback 포함) */
export function getResponseText(
  response: { text?: string; candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> },
  fallback = ""
): string {
  const raw =
    response.text ??
    response.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join("") ??
    "";
  return raw.trim() || fallback;
}
