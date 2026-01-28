-- 뉴스 챗봇 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- 1. 검색 기록 테이블
CREATE TABLE IF NOT EXISTS searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT
);

-- 2. 뉴스 항목 테이블
CREATE TABLE IF NOT EXISTS news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID REFERENCES searches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  source TEXT,
  published_at TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. AI 요약 테이블
CREATE TABLE IF NOT EXISTS summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID REFERENCES searches(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_searches_keyword ON searches(keyword);
CREATE INDEX IF NOT EXISTS idx_searches_created_at ON searches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_search_id ON news_items(search_id);
CREATE INDEX IF NOT EXISTS idx_summaries_search_id ON summaries(search_id);

-- 5. RLS (Row Level Security) 활성화
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- 6. 공개 읽기 정책 (누구나 읽을 수 있음)
CREATE POLICY "Public read access for searches" ON searches
  FOR SELECT USING (true);

CREATE POLICY "Public read access for news_items" ON news_items
  FOR SELECT USING (true);

CREATE POLICY "Public read access for summaries" ON summaries
  FOR SELECT USING (true);

-- 7. 공개 쓰기 정책 (누구나 삽입 가능)
CREATE POLICY "Public insert access for searches" ON searches
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert access for news_items" ON news_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert access for summaries" ON summaries
  FOR INSERT WITH CHECK (true);

-- 8. 뷰 생성: 검색과 뉴스를 함께 조회
CREATE OR REPLACE VIEW search_with_news AS
SELECT 
  s.id as search_id,
  s.keyword,
  s.created_at as search_date,
  s.user_name,
  s.user_email,
  COUNT(n.id) as news_count,
  json_agg(
    json_build_object(
      'id', n.id,
      'title', n.title,
      'link', n.link,
      'source', n.source,
      'published_at', n.published_at
    ) ORDER BY n.created_at
  ) as news_items
FROM searches s
LEFT JOIN news_items n ON s.id = n.search_id
GROUP BY s.id, s.keyword, s.created_at, s.user_name, s.user_email
ORDER BY s.created_at DESC;

-- 9. 최근 검색 통계 함수
CREATE OR REPLACE FUNCTION get_search_stats()
RETURNS TABLE (
  total_searches BIGINT,
  total_news BIGINT,
  recent_keywords TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM searches) as total_searches,
    (SELECT COUNT(*) FROM news_items) as total_news,
    ARRAY(
      SELECT keyword FROM searches 
      ORDER BY created_at DESC 
      LIMIT 10
    ) as recent_keywords;
END;
$$ LANGUAGE plpgsql;
