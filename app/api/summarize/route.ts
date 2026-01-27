import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, getResponseText } from "@/lib/gemini";
import type { NewsItem } from "@/lib/types";

export async function POST(request: NextRequest) {
  let news: NewsItem[];
  try {
    const body = await request.json();
    news = Array.isArray(body.news) ? body.news : [];
  } catch {
    return NextResponse.json(
      { error: "요청 본문에 { news: NewsItem[] } 형태의 JSON이 필요합니다." },
      { status: 400 }
    );
  }

  if (news.length === 0) {
    return NextResponse.json({ summary: "요약할 뉴스가 없습니다." });
  }

  try {
    const ai = getGeminiClient();
    const text = news
      .map((n, i) => `[${i + 1}] ${n.title} (${n.source}, ${n.publishedAt})`)
      .join("\n");

    const prompt = `아래는 특정 키워드로 검색한 뉴스 제목 목록입니다. 
이 뉴스들을 종합해 3~5문장 정도로 요약해 주세요. 
핵심 주제, 공통 이슈, 전반적인 흐름을 담아주세요. 한국어로 답변해 주세요.

뉴스 목록:
${text}

요약:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const summary = getResponseText(response, "요약을 생성할 수 없습니다.");
    return NextResponse.json({ summary });
  } catch (e) {
    const message = e instanceof Error ? e.message : "요약 생성 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
