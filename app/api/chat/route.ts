import { NextRequest, NextResponse } from "next/server";
import { getGeminiClient, getResponseText } from "@/lib/gemini";
import type { NewsItem } from "@/lib/types";
import type { ChatMessage } from "@/lib/types";

interface ChatBody {
  message: string;
  news?: NewsItem[];
  summary?: string;
  history?: ChatMessage[];
}

export async function POST(request: NextRequest) {
  let body: ChatBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문에 JSON이 필요합니다." },
      { status: 400 }
    );
  }

  const { message, news = [], summary = "", history = [] } = body;
  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { error: "message(문자열)가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const ai = getGeminiClient();

    const newsContext =
      news.length > 0
        ? `[참고 뉴스 목록]\n${news.map((n, i) => `[${i + 1}] ${n.title} (${n.source}) - ${n.link}`).join("\n")}`
        : "";
    const summaryBlock = summary ? `[뉴스 요약]\n${summary}` : "";

    const historyBlock =
      history.length > 0
        ? "\n[이전 대화]\n" +
          history
            .slice(-10)
            .map((m) => `${m.role === "user" ? "사용자" : "챗봇"}: ${m.content}`)
            .join("\n")
        : "";

    const prompt = `당신은 아래 뉴스 기사들을 기반으로 대화하는 뉴스 챗봇입니다.
${summaryBlock}
${newsContext}
${historyBlock}

지침: 위 뉴스와 요약을 바탕으로만 답변하세요. 없는 내용은 "해당 뉴스에서는 다루지 않는 것 같습니다" 등으로 정중히 말하세요. 짧고 명확하게 한국어로 답변하세요.

사용자: ${message}
챗봇:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const reply = getResponseText(response, "답변을 생성할 수 없습니다.");
    return NextResponse.json({ reply });
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : "챗 처리 중 오류가 발생했습니다.";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
