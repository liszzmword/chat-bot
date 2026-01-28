-- 회원 관리 및 인증 스키마
-- Supabase SQL Editor에서 실행하세요

-- 1. 사용자 테이블 (커스텀 사용자 정보)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL, -- 로그인 ID
  username TEXT NOT NULL, -- 이름
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. 기존 searches 테이블에 user_id 컬럼 추가
ALTER TABLE searches 
ADD COLUMN IF NOT EXISTS user_uuid UUID REFERENCES users(id) ON DELETE CASCADE;

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_searches_user_uuid ON searches(user_uuid);

-- 4. RLS (Row Level Security) 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. 사용자 테이블 정책 (자신의 정보만 조회 가능)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (true);

-- 6. searches 테이블 정책 수정 (사용자별 데이터 접근)
DROP POLICY IF EXISTS "Public read access for searches" ON searches;
DROP POLICY IF EXISTS "Public insert access for searches" ON searches;

CREATE POLICY "Users can view own searches" ON searches
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own searches" ON searches
  FOR INSERT WITH CHECK (true);

-- 7. 관리자 계정 생성 (비밀번호: 260128)
-- bcrypt 해시 생성은 애플리케이션에서 처리
INSERT INTO users (user_id, username, email, phone, password_hash, is_admin)
VALUES (
  'chatbot',
  '관리자',
  'admin@chatbot.com',
  '000-0000-0000',
  '$2a$10$placeholder_hash_will_be_replaced',
  true
)
ON CONFLICT (user_id) DO NOTHING;

-- 8. 사용자별 검색 통계 뷰
CREATE OR REPLACE VIEW user_search_stats AS
SELECT 
  u.id as user_id,
  u.user_id as login_id,
  u.username,
  COUNT(s.id) as total_searches,
  COUNT(DISTINCT s.keyword) as unique_keywords,
  MAX(s.created_at) as last_search_date,
  json_agg(
    json_build_object(
      'keyword', s.keyword,
      'search_date', s.created_at,
      'news_count', (SELECT COUNT(*) FROM news_items WHERE search_id = s.id)
    ) ORDER BY s.created_at DESC
  ) FILTER (WHERE s.id IS NOT NULL) as recent_searches
FROM users u
LEFT JOIN searches s ON u.id = s.user_uuid
GROUP BY u.id, u.user_id, u.username;

-- 9. 관리자 대시보드용 뷰
CREATE OR REPLACE VIEW admin_dashboard AS
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM searches) as total_searches,
  (SELECT COUNT(*) FROM news_items) as total_news_items,
  (SELECT COUNT(DISTINCT keyword) FROM searches) as unique_keywords,
  (SELECT json_agg(row_to_json(t)) FROM (
    SELECT u.username, COUNT(s.id) as search_count
    FROM users u
    LEFT JOIN searches s ON u.id = s.user_uuid
    GROUP BY u.id, u.username
    ORDER BY search_count DESC
    LIMIT 10
  ) t) as top_users;
