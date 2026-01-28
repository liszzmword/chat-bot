import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "뉴스 챗봇 | 키워드 검색 & AI 요약",
  description: "키워드로 뉴스를 검색하고, AI가 요약해 드립니다. 뉴스 기반 대화도 가능합니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
