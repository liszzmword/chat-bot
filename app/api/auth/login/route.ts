import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import bcrypt from "bcryptjs";

interface LoginRequest {
  userId: string;
  password: string;
}

export async function POST(request: NextRequest) {
  let body: LoginRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문에 JSON이 필요합니다." },
      { status: 400 }
    );
  }

  const { userId, password } = body;

  if (!userId || !password) {
    return NextResponse.json(
      { error: "ID와 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseClient();

    // 사용자 조회
    const { data: user, error: queryError } = await supabase
      .from("users")
      .select("id, user_id, username, email, phone, password_hash, is_admin")
      .eq("user_id", userId)
      .single();

    if (queryError || !user) {
      return NextResponse.json(
        { error: "ID 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "ID 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 마지막 로그인 시간 업데이트
    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", user.id);

    // 비밀번호 해시 제외하고 반환
    const { password_hash, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "로그인 성공",
    });

    // 쿠키에 사용자 정보 저장 (24시간 유효)
    response.cookies.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24시간
    });

    response.cookies.set("user_login_id", user.user_id, {
      httpOnly: false, // 클라이언트에서 읽을 수 있도록
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (e) {
    const message = e instanceof Error ? e.message : "로그인 중 오류가 발생했습니다.";
    console.error("로그인 에러:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
