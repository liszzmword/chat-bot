"use client";

import { useState, useCallback } from "react";
import type { NewsItem, ChatMessage } from "@/lib/types";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [summary, setSummary] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState<"idle" | "search" | "summarize" | "chat">("idle");
  const [error, setError] = useState("");

  const search = useCallback(async () => {
    const k = keyword.trim();
    if (!k) {
      setError("키워드를 입력하세요.");
      return;
    }
    setError("");
    setLoading("search");
    setNews([]);
    setSummary("");
    setChatHistory([]);
    try {
      const r = await fetch(`/api/news?keyword=${encodeURIComponent(k)}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "뉴스 검색 실패");
      setNews(j.news || []);
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
      setSummary(sj.summary || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading("idle");
    }
  }, [keyword]);

  const sendChat = useCallback(async () => {
    const m = chatInput.trim();
    if (!m || loading === "chat") return;
    setError("");
    setChatHistory((h) => [...h, { role: "user", content: m }]);
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
      setChatHistory((h) => [...h, { role: "assistant", content: j.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "챗 오류");
      setChatHistory((h) => h.slice(0, -1));
    } finally {
      setLoading("idle");
    }
  }, [chatInput, loading, news, summary, chatHistory]);

  return (
    <main className="container">
      <header className="header">
        <h1>뉴스 챗봇</h1>
        <p>키워드를 입력하면 Google 뉴스를 검색하고, AI가 요약한 뒤 뉴스 기반으로 대화할 수 있습니다.</p>
      </header>

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
              <h2>📋 AI 요약</h2>
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
    </main>
  );
}
