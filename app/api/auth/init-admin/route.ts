import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import bcrypt from "bcryptjs";

// 관리자 계정 초기화 (최초 1회만 실행)
export async function POST() {
  try {
    const supabase = getSupabaseClient();

    // 관리자 계정이 이미 존재하는지 확인
    const { data: existingAdmin } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_id", "chatbot")
      .single();

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: "관리자 계정이 이미 존재합니다.",
      });
    }

    // 비밀번호 해싱 (260128)
    const passwordHash = await bcrypt.hash("260128", 10);

    // 관리자 계정 생성
    const { data: admin, error } = await supabase
      .from("users")
      .insert({
        user_id: "chatbot",
        username: "관리자",
        email: "admin@chatbot.com",
        phone: "000-0000-0000",
        password_hash: passwordHash,
        is_admin: true,
      })
      .select("user_id, username, email, is_admin")
      .single();

    if (error) {
      console.error("관리자 계정 생성 에러:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      admin,
      message: "관리자 계정이 생성되었습니다. (ID: chatbot, PW: 260128)",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "관리자 계정 생성 중 오류가 발생했습니다.";
    console.error("관리자 초기화 에러:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
