import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "20");
  const keyword = searchParams.get("keyword");

  try {
    const supabase = getSupabaseClient();

    let query = supabase
      .from("searches")
      .select(`
        id,
        keyword,
        created_at,
        user_name,
        news_items (
          id,
          title,
          link,
          source,
          published_at
        ),
        summaries (
          summary_text
        )
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    // 키워드 필터링
    if (keyword) {
      query = query.ilike("keyword", `%${keyword}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("검색 조회 에러:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ searches: data || [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "데이터 조회 중 오류가 발생했습니다.";
    console.error("DB 조회 에러:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
