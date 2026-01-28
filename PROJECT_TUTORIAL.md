# 뉴스 챗봇 프로젝트 만들기 튜토리얼

이 문서는 AI 어시스턴트(Cursor)를 활용하여 뉴스 챗봇 프로젝트를 처음부터 만드는 과정을 단계별로 정리한 것입니다.

---

## 🎯 프로젝트 개요

**뉴스 챗봇**: 키워드를 입력하면 Google 뉴스를 검색하고, AI가 요약한 뒤 뉴스 기반으로 대화할 수 있는 웹 애플리케이션

### 주요 기능
- 🔍 키워드 기반 뉴스 검색 (Google News RSS)
- 🤖 AI 요약 (Google Gemini API)
- 💬 뉴스 기반 챗봇 대화
- 📧 이메일로 요약 전송
- 💾 검색 기록 저장 (Supabase)
- 🔐 사용자 인증 (로그인/회원가입)
- 👥 사용자별 검색 기록 관리

---

## 📝 단계별 프롬프트 (실제 사용한 것)

### 1단계: 프로젝트 초기 설정
```
키워드를 입력하면 관련된 뉴스를 구글에서 찾아서 10개의 뉴스를 보여줘. 
그리고 그 뉴스를 요약하고, 그 뉴스를 기반으로 대화할 수 있는 챗봇을 만들어줘. 
구글 재미나이 API를 사용할거야. 
API KEY가 노출되지 않도록, API는 VERCEL 환경변수에 넣을 수 있도록 구성해줘. 
gemini api: [여기에_API_키]
```

**결과**: 
- Next.js 14 프로젝트 생성
- Google News RSS 검색 기능
- Gemini API 요약 기능
- 챗봇 대화 기능
- `.env.local` API 키 관리

---

### 2단계: 에러 수정 및 보안 업데이트
```
안되는데? 왜 안되는지 알려주고 수정해줘.
```
```
이런 에러 나와. [에러_메시지_첨부]
```
```
재미나이 모델 변경해줘. gemini-2.5-flash
```
```
API 변경하자. [새_API_키] 그리고 깃에 업로드 하지마. 일단 로컬에서 먼저 테스트할거야.
```

**결과**:
- 에러 디버깅 및 수정
- Next.js 보안 업데이트 (14.2.19 → 14.2.35)
- Gemini 모델 변경
- `.gitignore` 설정으로 API 키 보호

---

### 3단계: GitHub 배포
```
잘 작동하는거 확인했으니깐 이제 배포할거야. 깃에 업로드 하자. 
주의해야할것은 API KEY가 노출되면 안돼.
API KEY가 노출되지 않도록 깃에 업로드 해줘.
```
```
너가 직접 깃 저장소에 업로드 해줘.
```
```
계정 알려줄게. liszzmwrod야.
```

**결과**:
- Git 저장소 초기화
- GitHub 저장소 생성 및 push
- `.env.local` 제외 확인
- CI/CD 연동

---

### 4단계: Vercel 배포 및 에러 수정
```
VERCEL 에서 이런 에러가 나와. [에러_메시지]
```
```
> Build error occurred
Error: > Couldn't find any `pages` or `app` directory. 
Please create one under the project root
```

**결과**:
- Vercel 환경변수 설정 가이드
- `main` 브랜치로 강제 push
- 빌드 에러 해결

---

### 5단계: 검색 기록 기능
```
지금은 새로 키워드를 입력하면 과거의 기록했던것들이 없어지는데, 
과거의 기록했던것들 없애지 말고 다시 볼 수 있도록 해줘.
```

**결과**:
- 검색 기록 목록 UI
- 검색 기록 클릭 시 이전 결과 보기
- 채팅 기록 유지
- 검색 기록 삭제 기능

---

### 6단계: 이메일 공유 기능
```
공유 버튼 만들어서 요약 내용을 이메일로 보낼 수 있도록 하자.
```
```
이메일 버튼을 누르면 liszzmword@gmail.com 으로 바로 그 내용이 전달되도록 해줘.
```

**결과**:
- 이메일 공유 버튼
- 클립보드 복사 버튼
- 기본 이메일 앱 연동

---

### 7단계: 이메일 자동 전송
```
사용자가 버튼 누르면 이름 전화번호 이메일 입력하는게 나오고 
그 내용과 요약 내용이 liszzmword@gmail.com 으로 바로 전송되게 해줘.
```

**결과**:
- 사용자 정보 입력 모달
- Resend API 연동
- 자동 이메일 전송 (HTML 형식)
- Resend API 키 설정 가이드

---

### 8단계: Supabase 데이터베이스 연동
```
supabase를 활용해서 DB 관리를 할거야. 
검색한 뉴스키워드/수집한 뉴스 제목/링크/내용을 DB로 관리할 수 있도록 코드를 작성해줘.
```

**결과**:
- Supabase 프로젝트 설정
- 데이터베이스 스키마 생성 (searches, news_items, summaries 테이블)
- 검색 자동 저장 API
- 검색 기록 조회 API
- `SUPABASE_SETUP.md` 설정 가이드

---

### 9단계: 로그인/회원가입 시스템
```
로그인/회원가입 기능도 만들어줘. 
로그인을 해야 질문할 수 있는 형태로 만들자.

관리자 계정 ID: chatbot
비밀번호: 260128
으로 설정할게. 

그리고 계정들 DB로 연결해주고 계정별로 뭘 검색했고 
그 때 어떤 요약/뉴스를 가져왔는지도 알 수 있도록 구성하자.

회원가입할때는 id/계정/이메일/핸드폰번호 입력해야돼.
```

**결과**:
- 사용자 테이블 (users) 생성
- 로그인/회원가입 API
- 비밀번호 해싱 (bcrypt)
- 관리자 계정 초기화
- 사용자별 검색 기록 연결
- 인증 컨텍스트 (AuthContext)
- 로그인/회원가입 모달 UI
- 로그인하지 않으면 검색 불가

---

## 🛠 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **React 18** (Client Components)
- **TypeScript**

### Backend & APIs
- **Next.js API Routes**
- **Google Gemini API** (AI 요약, 챗봇)
- **Google News RSS** (뉴스 검색)
- **Resend** (이메일 전송)

### Database & Auth
- **Supabase** (PostgreSQL)
- **bcryptjs** (비밀번호 해싱)

### Styling
- **CSS** (Custom, Dark Theme)

### Deployment
- **Vercel** (Frontend & API)
- **GitHub** (Version Control)

---

## 📂 프로젝트 구조

```
CHATBOT/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts      # 회원가입 API
│   │   │   ├── login/route.ts         # 로그인 API
│   │   │   ├── logout/route.ts        # 로그아웃 API
│   │   │   ├── me/route.ts            # 현재 사용자 조회
│   │   │   └── init-admin/route.ts    # 관리자 초기화
│   │   ├── chat/route.ts              # 챗봇 대화 API
│   │   ├── news/route.ts              # 뉴스 검색 API
│   │   ├── summarize/route.ts         # AI 요약 API
│   │   ├── send-email/route.ts        # 이메일 전송 API
│   │   ├── save-to-db/route.ts        # DB 저장 API
│   │   └── get-searches/route.ts      # 검색 기록 조회 API
│   ├── layout.tsx                     # 루트 레이아웃 (AuthProvider)
│   ├── page.tsx                       # 메인 페이지
│   └── globals.css                    # 전역 스타일
├── components/
│   └── AuthModal.tsx                  # 로그인/회원가입 모달
├── lib/
│   ├── types.ts                       # TypeScript 타입 정의
│   ├── gemini.ts                      # Gemini API 클라이언트
│   ├── supabase.ts                    # Supabase 클라이언트
│   └── auth-context.tsx               # 인증 컨텍스트
├── .env.local                         # 환경변수 (로컬, git 제외)
├── .env.example                       # 환경변수 예제
├── supabase-schema.sql                # DB 스키마 (뉴스, 요약)
├── supabase-auth-schema.sql           # DB 스키마 (인증)
├── SUPABASE_SETUP.md                  # Supabase 설정 가이드
└── PROJECT_TUTORIAL.md                # 이 문서
```

---

## 🔐 환경변수 설정

### `.env.local` 파일
```env
# Gemini API (AI 요약, 챗봇)
GEMINI_API_KEY=your_gemini_api_key

# Resend API (이메일 전송)
RESEND_API_KEY=your_resend_api_key

# Supabase (데이터베이스)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Vercel 환경변수
모든 환경변수를 Vercel Dashboard → Settings → Environment Variables에 추가

---

## 🚀 로컬 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.local` 파일 생성 및 API 키 입력

### 3. Supabase 설정
1. Supabase 프로젝트 생성
2. `supabase-schema.sql` 실행
3. `supabase-auth-schema.sql` 실행
4. API 키 복사

### 4. 관리자 계정 초기화
```
POST /api/auth/init-admin
```
또는 앱에서 한 번 회원가입

### 5. 개발 서버 실행
```bash
npm run dev
# 또는
run-dev.cmd  (Windows)
```

### 6. 브라우저 접속
```
http://localhost:3000
```

---

## 📊 데이터베이스 구조

### users (사용자)
- id (UUID)
- user_id (로그인 ID)
- username (이름)
- email
- phone
- password_hash
- is_admin (관리자 여부)

### searches (검색)
- id (UUID)
- keyword
- user_uuid (FK → users)
- created_at

### news_items (뉴스)
- id (UUID)
- search_id (FK → searches)
- title
- link
- source
- published_at

### summaries (AI 요약)
- id (UUID)
- search_id (FK → searches)
- summary_text

---

## 🎓 학습 포인트

### AI 어시스턴트 활용법
1. **구체적인 요구사항**: "키워드 검색 → 뉴스 10개 → AI 요약 → 챗봇"
2. **단계적 개선**: 초기 구현 → 에러 수정 → 기능 추가
3. **보안 중시**: API 키 보호, `.gitignore` 설정
4. **실제 에러 제공**: 스크린샷, 에러 메시지 첨부
5. **점진적 확장**: 기본 기능 → 검색 기록 → 이메일 → DB → 인증

### Next.js 패턴
- App Router 사용
- API Routes로 백엔드 구현
- Client Components (`"use client"`)
- 환경변수 관리 (`NEXT_PUBLIC_*`)

### 데이터베이스 설계
- 정규화된 테이블 구조
- 외래키 관계 (1:N, 1:1)
- RLS (Row Level Security)

### 인증 시스템
- 비밀번호 해싱 (bcrypt)
- 쿠키 기반 세션
- 컨텍스트 API로 전역 상태 관리

---

## 💡 프로젝트를 따라하는 방법

### 방법 1: 프롬프트 그대로 사용
1. 위의 프롬프트를 **순서대로** Cursor에 입력
2. 각 단계마다 테스트
3. 에러 발생 시 에러 메시지를 AI에게 전달

### 방법 2: 현재 코드 클론
1. GitHub 저장소 클론
```bash
git clone https://github.com/liszzmword/chat-bot.git
cd chat-bot
npm install
```
2. `.env.local` 설정
3. Supabase 설정
4. `npm run dev`

---

## 🐛 주요 에러 및 해결

### 1. `spawn EPERM` 에러
- **원인**: PowerShell 실행 정책
- **해결**: `run-dev.cmd` 사용 또는 `Set-ExecutionPolicy`

### 2. `404 Not Found`
- **원인**: 서버 준비 전 브라우저 열림
- **해결**: `scripts/wait-and-open.cmd`로 대기 후 오픈

### 3. API Key Leaked
- **원인**: 이전 키가 GitHub에 노출
- **해결**: 새 API 키 발급, `.gitignore` 확인

### 4. Vercel Build Error (no app directory)
- **원인**: `main` 브랜치에 코드 없음
- **해결**: `git push -u origin main --force`

### 5. Supabase RLS 에러
- **원인**: Row Level Security 정책 미설정
- **해결**: `supabase-auth-schema.sql` 재실행

---

## 📖 참고 문서

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Gemini API 문서](https://ai.google.dev/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Resend 문서](https://resend.com/docs)

---

## 🎉 완성된 기능

✅ 키워드 기반 뉴스 검색 (Google News RSS)  
✅ AI 요약 (Gemini 2.5 Flash)  
✅ 뉴스 기반 챗봇 대화  
✅ 검색 기록 저장 및 다시보기  
✅ 이메일로 요약 공유  
✅ 클립보드 복사  
✅ Supabase DB 연동  
✅ 로그인/회원가입  
✅ 사용자별 검색 기록 관리  
✅ 관리자 계정 (chatbot / 260128)  
✅ Vercel 배포  
✅ GitHub 버전 관리  

---

## 🚀 향후 개선 방향

- [ ] 관리자 대시보드 (사용자 통계, 검색 통계)
- [ ] 뉴스 본문 크롤링
- [ ] 검색 필터 (날짜, 출처)
- [ ] 다크/라이트 모드 전환
- [ ] PWA (모바일 앱화)
- [ ] 소셜 로그인 (Google, GitHub)
- [ ] 검색어 자동완성
- [ ] 뉴스 북마크 기능

---

**만든 사람**: liszzmwrod  
**프로젝트 기간**: 2026년 1월  
**AI 어시스턴트**: Cursor (Claude Sonnet 4.5)  
