import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import type { NewsItem } from "@/lib/types";

interface EmailBody {
  userName: string;
  userPhone: string;
  userEmail: string;
  keyword: string;
  summary: string;
  news: NewsItem[];
}

export async function POST(request: NextRequest) {
  let body: EmailBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문에 JSON이 필요합니다." },
      { status: 400 }
    );
  }

  const { userName, userPhone, userEmail, keyword, summary, news } = body;

  if (!userName || !userPhone || !userEmail) {
    return NextResponse.json(
      { error: "이름, 전화번호, 이메일을 모두 입력해주세요." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const resend = new Resend(apiKey);

    const newsLinks = news
      .map((n, i) => `${i + 1}. ${n.title}\n   링크: ${n.link}\n   출처: ${n.source}`)
      .join("\n\n");

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .section { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    .section h3 { margin-top: 0; color: #0ea5e9; }
    .user-info { background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .news-item { padding: 10px 0; border-bottom: 1px solid #ddd; }
    .news-item:last-child { border-bottom: none; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📰 뉴스 챗봇 요약 리포트</h2>
      <p>키워드: <strong>${keyword}</strong></p>
    </div>
    
    <div class="user-info">
      <h3>👤 요청자 정보</h3>
      <p><strong>이름:</strong> ${userName}</p>
      <p><strong>전화번호:</strong> ${userPhone}</p>
      <p><strong>이메일:</strong> ${userEmail}</p>
    </div>
    
    <div class="section">
      <h3>📋 AI 요약</h3>
      <p>${summary.replace(/\n/g, "<br>")}</p>
    </div>
    
    <div class="section">
      <h3>📰 뉴스 목록 (${news.length}건)</h3>
      ${news
        .map(
          (n, i) => `
        <div class="news-item">
          <strong>${i + 1}. ${n.title}</strong><br>
          <a href="${n.link}" target="_blank">${n.link}</a><br>
          <small>출처: ${n.source} · ${n.publishedAt}</small>
        </div>
      `
        )
        .join("")}
    </div>
    
    <div class="footer">
      <p>뉴스 챗봇으로 생성됨 · ${new Date().toLocaleString("ko-KR")}</p>
    </div>
  </div>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      from: "뉴스챗봇 <onboarding@resend.dev>",
      to: ["liszzmword@gmail.com"],
      subject: `[뉴스 요약] ${keyword} - ${userName}`,
      html: emailContent,
    });

    if (error) {
      console.error("Resend 에러:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "이메일 전송 중 오류가 발생했습니다.";
    console.error("이메일 전송 에러:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
