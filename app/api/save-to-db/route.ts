import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import type { NewsItem } from "@/lib/types";

interface SaveRequest {
  keyword: string;
  news: NewsItem[];
  summary: string;
  userId?: string; // 로그인한 사용자 UUID
  userName?: string;
  userEmail?: string;
  userPhone?: string;
}

export async function POST(request: NextRequest) {
  let body: SaveRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문에 JSON이 필요합니다." },
      { status: 400 }
    );
  }

  const { keyword, news, summary, userId, userName, userEmail, userPhone } = body;

  if (!keyword || !news || news.length === 0 || !summary) {
    return NextResponse.json(
      { error: "키워드, 뉴스, 요약이 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseClient();

    // 1. 검색 기록 저장
    const { data: searchData, error: searchError } = await supabase
      .from("searches")
      .insert({
        keyword,
        user_uuid: userId || null,
        user_name: userName || null,
        user_email: userEmail || null,
        user_phone: userPhone || null,
      })
      .select()
      .single();

    if (searchError) {
      console.error("검색 저장 에러:", searchError);
      return NextResponse.json({ error: searchError.message }, { status: 500 });
    }

    const searchId = searchData.id;

    // 2. 뉴스 항목 저장
    const newsInserts = news.map((item) => ({
      search_id: searchId,
      title: item.title,
      link: item.link,
      source: item.source,
      published_at: item.publishedAt,
      content: null, // 현재는 제목만 저장, 추후 본문 크롤링 가능
    }));

    const { error: newsError } = await supabase.from("news_items").insert(newsInserts);

    if (newsError) {
      console.error("뉴스 저장 에러:", newsError);
      return NextResponse.json({ error: newsError.message }, { status: 500 });
    }

    // 3. 요약 저장
    const { error: summaryError } = await supabase.from("summaries").insert({
      search_id: searchId,
      summary_text: summary,
    });

    if (summaryError) {
      console.error("요약 저장 에러:", summaryError);
      return NextResponse.json({ error: summaryError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      searchId,
      message: "데이터가 성공적으로 저장되었습니다.",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "데이터 저장 중 오류가 발생했습니다.";
    console.error("DB 저장 에러:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
