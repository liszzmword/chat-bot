import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const supabase = getSupabaseClient();

    const { data: user, error } = await supabase
      .from("users")
      .select("id, user_id, username, email, phone, is_admin, created_at, last_login")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user });
  } catch (e) {
    console.error("사용자 조회 에러:", e);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
