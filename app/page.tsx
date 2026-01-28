"use client";

import { useState, useCallback } from "react";
import type { NewsItem, ChatMessage } from "@/lib/types";

interface SearchHistory {
  id: string;
  keyword: string;
  news: NewsItem[];
  summary: string;
  chatHistory: ChatMessage[];
  timestamp: number;
}

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [currentSearchId, setCurrentSearchId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState<"idle" | "search" | "summarize" | "chat" | "email">("idle");
  const [error, setError] = useState("");
  
  // 이메일 전송 모달 상태
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // 현재 선택된 검색 가져오기
  const currentSearch = searchHistory.find((s) => s.id === currentSearchId);
  const news = currentSearch?.news || [];
  const summary = currentSearch?.summary || "";
  const chatHistory = currentSearch?.chatHistory || [];

  const search = useCallback(async () => {
    const k = keyword.trim();
    if (!k) {
      setError("키워드를 입력하세요.");
      return;
    }
    setError("");
    setLoading("search");
    
    const newId = Date.now().toString();
    
    try {
      const r = await fetch(`/api/news?keyword=${encodeURIComponent(k)}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "뉴스 검색 실패");
      
      if ((j.news || []).length === 0) {
        setError("이 키워드로 검색된 뉴스가 없습니다. 다른 키워드를 시도해 보세요.");
        setLoading("idle");
        return;
      }
      
      setLoading("summarize");
      const sr = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ news: j.news }),
      });
      const sj = await sr.json();
      if (!sr.ok) throw new Error(sj.error || "요약 실패");
      
      // 새 검색 기록 추가
      const newSearch: SearchHistory = {
        id: newId,
        keyword: k,
        news: j.news || [],
        summary: sj.summary || "",
        chatHistory: [],
        timestamp: Date.now(),
      };
      
      setSearchHistory((prev) => [newSearch, ...prev]);
      setCurrentSearchId(newId);
      setKeyword("");
      
      // Supabase DB에 저장 (백그라운드)
      fetch("/api/save-to-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: k,
          news: j.news,
          summary: sj.summary,
        }),
      }).catch((err) => {
        console.error("DB 저장 실패:", err);
        // DB 저장 실패해도 앱은 계속 동작
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading("idle");
    }
  }, [keyword]);

  const sendChat = useCallback(async () => {
    const m = chatInput.trim();
    if (!m || loading === "chat" || !currentSearchId) return;
    setError("");
    
    // 현재 검색에 사용자 메시지 추가
    setSearchHistory((prev) =>
      prev.map((s) =>
        s.id === currentSearchId
          ? { ...s, chatHistory: [...s.chatHistory, { role: "user" as const, content: m }] }
          : s
      )
    );
    setChatInput("");
    setLoading("chat");
    
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: m,
          news,
          summary,
          history: chatHistory,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "챗 실패");
      
      // 챗봇 응답 추가
      setSearchHistory((prev) =>
        prev.map((s) =>
          s.id === currentSearchId
            ? { ...s, chatHistory: [...s.chatHistory, { role: "assistant" as const, content: j.reply }] }
            : s
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "챗 오류");
      // 에러 시 사용자 메시지 제거
      setSearchHistory((prev) =>
        prev.map((s) =>
          s.id === currentSearchId
            ? { ...s, chatHistory: s.chatHistory.slice(0, -1) }
            : s
        )
      );
    } finally {
      setLoading("idle");
    }
  }, [chatInput, loading, currentSearchId, news, summary, chatHistory]);
  
  const deleteSearch = useCallback((id: string) => {
    setSearchHistory((prev) => prev.filter((s) => s.id !== id));
    if (currentSearchId === id) {
      setCurrentSearchId(null);
    }
  }, [currentSearchId]);

  const shareViaEmail = useCallback(() => {
    if (!currentSearch) return;
    setShowEmailModal(true);
  }, [currentSearch]);

  const sendEmail = useCallback(async () => {
    if (!currentSearch) return;
    if (!userName.trim() || !userPhone.trim() || !userEmail.trim()) {
      setError("이름, 전화번호, 이메일을 모두 입력해주세요.");
      return;
    }

    setError("");
    setLoading("email");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: userName.trim(),
          userPhone: userPhone.trim(),
          userEmail: userEmail.trim(),
          keyword: currentSearch.keyword,
          summary: currentSearch.summary,
          news: currentSearch.news,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "이메일 전송 실패");

      alert("이메일이 성공적으로 전송되었습니다!");
      setShowEmailModal(false);
      setUserName("");
      setUserPhone("");
      setUserEmail("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "이메일 전송 오류");
    } finally {
      setLoading("idle");
    }
  }, [currentSearch, userName, userPhone, userEmail]);

  const copyToClipboard = useCallback(async () => {
    if (!currentSearch) return;
    
    const newsLinks = currentSearch.news
      .map((n, i) => `${i + 1}. ${n.title}\n   ${n.link}`)
      .join("\n\n");
    
    const text =
      `키워드: ${currentSearch.keyword}\n\n` +
      `=== AI 요약 ===\n${currentSearch.summary}\n\n` +
      `=== 뉴스 목록 (${currentSearch.news.length}건) ===\n${newsLinks}\n\n` +
      `---\n뉴스 챗봇으로 생성됨`;
    
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 복사되었습니다!");
    } catch (err) {
      alert("복사 실패: " + (err instanceof Error ? err.message : "알 수 없는 오류"));
    }
  }, [currentSearch]);

  return (
    <main className="container">
      <header className="header">
        <h1>뉴스 챗봇</h1>
        <p>키워드를 입력하면 Google 뉴스를 검색하고, AI가 요약한 뒤 뉴스 기반으로 대화할 수 있습니다.</p>
      </header>

      {searchHistory.length > 0 && (
        <aside className="historyPanel">
          <h3>📚 검색 기록 ({searchHistory.length})</h3>
          <ul className="historyList">
            {searchHistory.map((search) => (
              <li
                key={search.id}
                className={`historyItem ${currentSearchId === search.id ? "active" : ""}`}
              >
                <button
                  onClick={() => setCurrentSearchId(search.id)}
                  className="historyBtn"
                >
                  <span className="historyKeyword">{search.keyword}</span>
                  <span className="historyTime">
                    {new Date(search.timestamp).toLocaleString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </button>
                <button
                  onClick={() => deleteSearch(search.id)}
                  className="historyDelete"
                  title="삭제"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <section className="search">
        <div className="searchRow">
          <input
            type="text"
            placeholder="예: 인공지능, 삼성전자, 기후변화"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            disabled={loading !== "idle"}
            className="input"
          />
          <button
            onClick={search}
            disabled={loading === "search" || loading === "summarize"}
            className="btn btnPrimary"
          >
            {loading === "search" || loading === "summarize" ? "검색 중…" : "뉴스 검색"}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </section>

      {news.length > 0 && (
        <>
          <section className="section">
            <h2>📰 뉴스 10건</h2>
            <ul className="newsList">
              {news.map((n, i) => (
                <li key={i} className="newsItem">
                  <a href={n.link} target="_blank" rel="noopener noreferrer" className="newsTitle">
                    {n.title}
                  </a>
                  <span className="newsMeta">{n.source} · {n.publishedAt}</span>
                </li>
              ))}
            </ul>
          </section>

          {summary && (
            <section className="section summarySection">
              <div className="summaryHeader">
                <h2>📋 AI 요약</h2>
                <div className="shareButtons">
                  <button
                    onClick={shareViaEmail}
                    className="btn btnShare"
                    title="이메일로 공유"
                  >
                    ✉️ 이메일
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="btn btnShare"
                    title="클립보드에 복사"
                  >
                    📋 복사
                  </button>
                </div>
              </div>
              <p className="summary">{summary}</p>
            </section>
          )}

          <section className="section chatSection">
            <h2>💬 뉴스 기반 대화</h2>
            <div className="chatArea">
              {chatHistory.length === 0 && (
                <p className="chatPlaceholder">위 뉴스에 대해 궁금한 점을 물어보세요.</p>
              )}
              <div className="chatMessages">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`chatBubble ${msg.role}`}>
                    <span className="chatRole">{msg.role === "user" ? "나" : "챗봇"}</span>
                    <p>{msg.content}</p>
                  </div>
                ))}
                {loading === "chat" && (
                  <div className="chatBubble assistant">
                    <span className="chatRole">챗봇</span>
                    <p>입력 중…</p>
                  </div>
                )}
              </div>
              <div className="chatInputRow">
                <textarea
                  placeholder="메시지 입력…"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendChat();
                    }
                  }}
                  disabled={loading === "chat"}
                  rows={2}
                  className="input chatInput"
                />
                <button
                  onClick={sendChat}
                  disabled={!chatInput.trim() || loading === "chat"}
                  className="btn btnPrimary chatSend"
                >
                  전송
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      <footer className="footer">
        <p>Google News RSS + Gemini API · API 키는 서버 환경변수로만 사용됩니다.</p>
      </footer>

      {/* 이메일 전송 모달 */}
      {showEmailModal && (
        <div className="modalOverlay" onClick={() => setShowEmailModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3>📧 이메일로 전송</h3>
              <button
                className="modalClose"
                onClick={() => setShowEmailModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modalBody">
              <p className="modalDescription">
                요약 내용을 이메일로 받으시려면 정보를 입력해주세요.
              </p>
              <div className="formGroup">
                <label htmlFor="userName">이름 *</label>
                <input
                  id="userName"
                  type="text"
                  placeholder="홍길동"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="input"
                  disabled={loading === "email"}
                />
              </div>
              <div className="formGroup">
                <label htmlFor="userPhone">전화번호 *</label>
                <input
                  id="userPhone"
                  type="tel"
                  placeholder="010-1234-5678"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="input"
                  disabled={loading === "email"}
                />
              </div>
              <div className="formGroup">
                <label htmlFor="userEmail">이메일 *</label>
                <input
                  id="userEmail"
                  type="email"
                  placeholder="example@email.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="input"
                  disabled={loading === "email"}
                />
              </div>
              {error && <p className="error">{error}</p>}
            </div>
            <div className="modalFooter">
              <button
                className="btn btnSecondary"
                onClick={() => setShowEmailModal(false)}
                disabled={loading === "email"}
              >
                취소
              </button>
              <button
                className="btn btnPrimary"
                onClick={sendEmail}
                disabled={loading === "email"}
              >
                {loading === "email" ? "전송 중..." : "전송"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
