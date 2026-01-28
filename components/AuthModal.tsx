"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface AuthModalProps {
  onClose?: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 로그인 폼
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 회원가입 폼
  const [regId, setRegId] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");

  const { login, register } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(loginId, loginPassword);
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (regPassword !== regPasswordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      await register(regId, regUsername, regEmail, regPhone, regPassword);
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent authModal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h3>{mode === "login" ? "🔐 로그인" : "✨ 회원가입"}</h3>
          {onClose && (
            <button className="modalClose" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        <div className="modalBody">
          {mode === "login" ? (
            <form onSubmit={handleLogin}>
              <div className="formGroup">
                <label htmlFor="loginId">아이디</label>
                <input
                  id="loginId"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="input"
                  disabled={loading}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="loginPassword">비밀번호</label>
                <input
                  id="loginPassword"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="input"
                  disabled={loading}
                  required
                />
              </div>

              {error && <p className="error">{error}</p>}

              <button type="submit" className="btn btnPrimary authBtn" disabled={loading}>
                {loading ? "로그인 중..." : "로그인"}
              </button>

              <p className="authSwitch">
                계정이 없으신가요?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                  className="authSwitchBtn"
                  disabled={loading}
                >
                  회원가입
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="formGroup">
                <label htmlFor="regId">아이디 *</label>
                <input
                  id="regId"
                  type="text"
                  placeholder="4자 이상"
                  value={regId}
                  onChange={(e) => setRegId(e.target.value)}
                  className="input"
                  disabled={loading}
                  required
                  minLength={4}
                />
              </div>

              <div className="formGroup">
                <label htmlFor="regUsername">이름 *</label>
                <input
                  id="regUsername"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="input"
                  disabled={loading}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="regEmail">이메일 *</label>
                <input
                  id="regEmail"
                  type="email"
                  placeholder="example@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="input"
                  disabled={loading}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="regPhone">핸드폰번호 *</label>
                <input
                  id="regPhone"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="input"
                  disabled={loading}
                  required
                />
              </div>

              <div className="formGroup">
                <label htmlFor="regPassword">비밀번호 *</label>
                <input
                  id="regPassword"
                  type="password"
                  placeholder="6자 이상"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="input"
                  disabled={loading}
                  required
                  minLength={6}
                />
              </div>

              <div className="formGroup">
                <label htmlFor="regPasswordConfirm">비밀번호 확인 *</label>
                <input
                  id="regPasswordConfirm"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  className="input"
                  disabled={loading}
                  required
                />
              </div>

              {error && <p className="error">{error}</p>}

              <button type="submit" className="btn btnPrimary authBtn" disabled={loading}>
                {loading ? "가입 중..." : "회원가입"}
              </button>

              <p className="authSwitch">
                이미 계정이 있으신가요?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="authSwitchBtn"
                  disabled={loading}
                >
                  로그인
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
