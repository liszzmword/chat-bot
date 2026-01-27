import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>주소가 올바른지 확인하거나, 아래에서 홈으로 이동해 보세요.</p>
      <Link href="/" style={{ color: "#0ea5e9" }}>
        홈으로 이동
      </Link>
    </div>
  );
}
