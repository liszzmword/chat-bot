import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import bcrypt from "bcryptjs";

interface RegisterRequest {
  userId: string; // 로그인 ID
  username: string; // 이름
  email: string;
  phone: string;
  password: string;
}

export async function POST(request: NextRequest) {
  let body: RegisterRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "요청 본문에 JSON이 필요합니다." },
      { status: 400 }
    );
  }

  const { userId, username, email, phone, password } = body;

  // 필수 필드 검증
  if (!userId || !username || !email || !phone || !password) {
    return NextResponse.json(
      { error: "ID, 이름, 이메일, 핸드폰번호, 비밀번호를 모두 입력해주세요." },
      { status: 400 }
    );
  }

  // ID 길이 검증
  if (userId.length < 4) {
    return NextResponse.json(
      { error: "ID는 4자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  // 비밀번호 길이 검증
  if (password.length < 6) {
    return NextResponse.json(
      { error: "비밀번호는 6자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseClient();

    // 중복 확인
    const { data: existingUser } = await supabase
      .from("users")
      .select("user_id, email")
      .or(`user_id.eq.${userId},email.eq.${email}`)
      .single();

    if (existingUser) {
      if (existingUser.user_id === userId) {
        return NextResponse.json({ error: "이미 사용 중인 ID입니다." }, { status: 409 });
      }
      if (existingUser.email === email) {
        return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 409 });
      }
    }

    // 비밀번호 해싱
    const passwordHash = await bcrypt.hash(password, 10);

    // 사용자 생성
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        user_id: userId,
        username,
        email,
        phone,
        password_hash: passwordHash,
        is_admin: false,
      })
      .select("id, user_id, username, email, is_admin")
      .single();

    if (insertError) {
      console.error("회원가입 에러:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: "회원가입이 완료되었습니다.",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "회원가입 중 오류가 발생했습니다.";
    console.error("회원가입 에러:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
