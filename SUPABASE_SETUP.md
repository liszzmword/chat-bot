# Supabase 데이터베이스 설정 가이드

## 1. Supabase 프로젝트 생성

### 1.1 계정 가입
1. **[https://supabase.com](https://supabase.com)** 접속
2. **"Start your project"** 클릭
3. GitHub 계정으로 로그인

### 1.2 새 프로젝트 생성
1. **"New Project"** 클릭
2. 프로젝트 정보 입력:
   - **Name**: `news-chatbot` (원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (저장해두세요!)
   - **Region**: `Northeast Asia (Tokyo)` 선택 (한국과 가까움)
   - **Pricing Plan**: `Free` 선택
3. **"Create new project"** 클릭
4. 프로젝트 생성 대기 (1-2분 소요)

---

## 2. 데이터베이스 스키마 생성

### 2.1 SQL Editor 접속
1. 왼쪽 메뉴에서 **"SQL Editor"** 클릭
2. **"New query"** 클릭

### 2.2 스키마 실행
1. 프로젝트 루트의 **`supabase-schema.sql`** 파일 내용 복사
2. SQL Editor에 붙여넣기
3. **"Run"** 버튼 클릭 (또는 Ctrl + Enter)
4. 성공 메시지 확인: `Success. No rows returned`

### 2.3 테이블 확인
1. 왼쪽 메뉴에서 **"Table Editor"** 클릭
2. 다음 테이블이 생성되었는지 확인:
   - ✅ `searches` (검색 기록)
   - ✅ `news_items` (뉴스 항목)
   - ✅ `summaries` (AI 요약)

---

## 3. API 키 발급

### 3.1 Settings 접속
1. 왼쪽 메뉴에서 **⚙️ Settings** 클릭
2. **"API"** 탭 클릭

### 3.2 API 키 복사
다음 정보를 복사하여 저장하세요:

#### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```

#### anon public (공개 키)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### service_role (서비스 키) - 선택사항
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 4. 로컬 환경변수 설정

### 4.1 `.env.local` 파일 수정
프로젝트 루트의 `.env.local` 파일을 열고 다음을 수정하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**주의**: 실제 값으로 교체하세요!

### 4.2 저장 및 재시작
1. 파일 저장
2. 개발 서버 재시작:
   ```bash
   # Ctrl + C로 기존 서버 중지 후
   run-dev.cmd
   ```

---

## 5. Vercel 환경변수 설정

### 5.1 Vercel Dashboard 접속
1. **[https://vercel.com/dashboard](https://vercel.com/dashboard)** 접속
2. `chat-bot` 프로젝트 선택
3. **Settings** → **Environment Variables** 클릭

### 5.2 환경변수 추가
다음 3개의 환경변수를 추가하세요:

#### 1) NEXT_PUBLIC_SUPABASE_URL
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://xxxxxxxxxxxxx.supabase.co`
- **Environment**: Production, Preview, Development 모두 체크
- **Save**

#### 2) NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Environment**: Production, Preview, Development 모두 체크
- **Save**

#### 3) SUPABASE_SERVICE_ROLE_KEY (선택사항)
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Environment**: Production만 체크 (보안상 중요)
- **Save**

### 5.3 재배포
1. **Deployments** 탭으로 이동
2. 최신 배포 찾기
3. **⋯** 메뉴 → **"Redeploy"** 클릭

---

## 6. 데이터베이스 확인

### 6.1 테스트
1. 애플리케이션에서 키워드 검색 실행
2. 뉴스와 요약 확인

### 6.2 DB 확인
1. Supabase Dashboard → **Table Editor**
2. `searches` 테이블 선택
3. 방금 검색한 키워드가 저장되었는지 확인
4. `news_items` 테이블에서 뉴스 확인
5. `summaries` 테이블에서 요약 확인

---

## 7. 데이터 조회 (선택사항)

### SQL Editor에서 쿼리 실행

#### 최근 검색 10개 조회
```sql
SELECT * FROM searches 
ORDER BY created_at DESC 
LIMIT 10;
```

#### 특정 키워드의 뉴스 조회
```sql
SELECT s.keyword, n.title, n.link, n.source
FROM searches s
JOIN news_items n ON s.id = n.search_id
WHERE s.keyword = '인공지능'
ORDER BY s.created_at DESC;
```

#### 검색 통계
```sql
SELECT * FROM get_search_stats();
```

---

## 8. 데이터베이스 구조

### 테이블 관계
```
searches (검색)
  ├── news_items (뉴스) - 1:N 관계
  └── summaries (요약) - 1:1 관계
```

### 주요 필드

#### searches
- `id`: UUID (자동 생성)
- `keyword`: 검색 키워드
- `created_at`: 검색 시간
- `user_name`, `user_email`, `user_phone`: 사용자 정보 (선택)

#### news_items
- `id`: UUID
- `search_id`: 검색 ID (FK)
- `title`: 뉴스 제목
- `link`: 뉴스 링크
- `source`: 출처
- `published_at`: 발행일

#### summaries
- `id`: UUID
- `search_id`: 검색 ID (FK)
- `summary_text`: AI 요약 텍스트

---

## 9. 무료 플랜 제한

Supabase 무료 플랜:
- ✅ 500MB 데이터베이스 용량
- ✅ 월 500MB 전송량
- ✅ 50,000개 월간 인증 사용자
- ✅ 2GB 파일 스토리지
- ✅ 무제한 API 요청

대부분의 개인 프로젝트에 충분합니다!

---

## 10. 문제 해결

### ❌ "relation does not exist" 에러
- **원인**: 테이블이 생성되지 않음
- **해결**: `supabase-schema.sql` 다시 실행

### ❌ "NEXT_PUBLIC_SUPABASE_URL is not defined" 에러
- **원인**: 환경변수 미설정
- **해결**: `.env.local` 확인 및 개발 서버 재시작

### ❌ RLS 정책 에러
- **원인**: Row Level Security 설정 문제
- **해결**: 스키마 SQL의 정책 부분 다시 실행

---

## 완료! 🎉

이제 검색한 모든 뉴스와 키워드가 자동으로 Supabase에 저장됩니다.
