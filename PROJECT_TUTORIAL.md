# 뉴스 챗봇 프로젝트 제작 튜토리얼

## 📋 프로젝트 개요
키워드를 입력하면 Google 뉴스를 검색하고, AI가 요약한 뒤, 뉴스 기반으로 대화할 수 있는 챗봇 애플리케이션

---

## 🎯 완성된 기능 목록
1. ✅ Google News RSS 뉴스 검색 (키워드 기반 10건)
2. ✅ Google Gemini AI 요약
3. ✅ 뉴스 기반 AI 챗봇 대화
4. ✅ 검색 기록 저장 및 다시보기
5. ✅ 이메일로 요약 공유
6. ✅ 클립보드 복사
7. ✅ 사용자 정보 입력 후 자동 이메일 전송
8. ✅ Supabase 데이터베이스 연동

---

## 📝 단계별 프롬프트 가이드

### 1단계: 기본 프로젝트 설정
```
키워드를 입력하면 관련된 뉴스를 구글에서 찾아서 10개의 뉴스를 보여줘. 
그리고 그 뉴스를 요약하고, 그 뉴스를 기반으로 대화할 수 있는 챗봇을 만들어줘. 
구글 재미나이 API를 사용할거야. 
API KEY가 노출되지 않도록, API는 VERCEL 환경변수에 넣을 수 있도록 구성해줘.
```

**생성된 파일:**
- `package.json` - Next.js 프로젝트 설정
- `app/page.tsx` - 메인 페이지 (검색 UI)
- `app/api/news/route.ts` - Google News RSS API
- `app/api/summarize/route.ts` - Gemini 요약 API
- `app/api/chat/route.ts` - 챗봇 대화 API
- `lib/gemini.ts` - Gemini 클라이언트
- `lib/types.ts` - TypeScript 타입 정의
- `.env.example` - 환경변수 템플릿
- `.gitignore` - Git 제외 파일

**핵심 기술:**
- Next.js 14 (App Router)
- Google News RSS
- Google Gemini API
- TypeScript

---

### 2단계: 로컬 개발 환경 설정
```
AIzaSyCCX6lv6ctnoqyLTIpc9hEEmPXDM-pcstM 내 API야. 
로컬에서 사용할 수 있도록 해줘. 
그리고 지금은 CMD 파일을 실행하고 접속해야 작동하는데 
실행하지 않고도 작동할 수 있도록 수정해줘.
```

**생성된 파일:**
- `.env.local` - 로컬 환경변수 (Git 제외)
- `run-dev.cmd` - 개발 서버 자동 실행
- `scripts/wait-and-open.cmd` - 서버 대기 후 브라우저 자동 오픈
- `deploy.cmd` - Vercel 배포 스크립트
- `README.md` - 사용 설명서

**해결한 문제:**
- PowerShell 실행 정책 문제
- 서버 준비 전 브라우저 오픈 문제 (404 에러)
- Windows 환경 최적화

---

### 3단계: Gemini 모델 업데이트
```
재미나이 모델 변경해줘. gemini-2.5-flash
```

**변경사항:**
- `app/api/summarize/route.ts` - 모델 변경
- `app/api/chat/route.ts` - 모델 변경

---

### 4단계: 검색 기록 기능 추가
```
지금은 새로 키워드를 입력하면 과거의 기록했던것들이 없어지는데, 
과거의 기록했던것들 없애지 말고 다시 볼 수 있도록 해줘.
```

**생성/수정된 파일:**
- `app/page.tsx` - 검색 기록 상태 관리 추가
- `app/globals.css` - 검색 기록 패널 스타일

**추가된 기능:**
- 검색 기록 저장 (메모리)
- 검색 기록 목록 UI
- 클릭으로 이전 검색 다시보기
- 검색별 채팅 기록 유지
- 검색 기록 삭제 버튼

---

### 5단계: 이메일 공유 기능
```
공유 버튼 만들어서 요약 내용을 이메일로 보낼 수 있도록 하자.
```

**수정된 파일:**
- `app/page.tsx` - 이메일/복사 버튼 추가
- `app/globals.css` - 공유 버튼 스타일

**추가된 기능:**
- ✉️ 이메일로 공유 버튼 (mailto 링크)
- 📋 클립보드 복사 버튼
- 키워드, 요약, 뉴스 목록 포함

---

### 6단계: 이메일 수신자 자동 설정
```
이메일 버튼을 누르면 liszzmword@gmail.com 으로 바로 그 내용이 전달되도록 해줘.
```

**변경사항:**
- `app/page.tsx` - mailto에 수신자 이메일 추가

---

### 7단계: 사용자 정보 입력 및 자동 이메일 전송
```
사용자가 버튼 누르면 이름 전화번호 이메일 입력하는게 나오고 
그 내용과 요약 내용이 liszzmword@gmail.com 으로 바로 전송되게 해줘.
```

**설치한 패키지:**
```bash
npm install resend
```

**생성/수정된 파일:**
- `app/api/send-email/route.ts` - Resend API로 이메일 전송
- `app/page.tsx` - 사용자 입력 모달 추가
- `app/globals.css` - 모달 스타일
- `.env.example` - RESEND_API_KEY 추가

**추가된 기능:**
- 사용자 정보 입력 모달 (이름, 전화번호, 이메일)
- Resend API 연동
- HTML 이메일 템플릿
- 자동 이메일 전송

**필요한 설정:**
- Resend 계정 가입: https://resend.com
- API 키 발급
- 환경변수 설정

---

### 8단계: Next.js 보안 업데이트
```
(Vercel 빌드 에러 해결)
```

**변경사항:**
- `package.json` - Next.js 14.2.19 → 14.2.35 업데이트
- 보안 취약점 수정

---

### 9단계: GitHub 저장소 업로드
```
잘 작동하는거 확인했으니깐 이제 배포할거야. 깃에 업로드 하자.
API KEY가 노출되지 않도록 깃에 업로드 해줘.
```

**Git 작업:**
1. `git init` - 저장소 초기화
2. `git add .` - 파일 스테이징
3. `git commit` - 커밋
4. `git remote add origin` - 원격 저장소 연결
5. `git push` - GitHub 업로드

**주의사항:**
- `.env.local`은 `.gitignore`로 제외됨
- API 키는 절대 커밋되지 않음

---

### 10단계: Supabase 데이터베이스 연동
```
supabase를 활용해서 DB 관리를 할거야.
검색한 뉴스키워드/수집한 뉴스 제목/링크/내용을 DB로 관리할 수 있도록 코드를 작성해줘.
```

**설치한 패키지:**
```bash
npm install @supabase/supabase-js
```

**생성된 파일:**
- `lib/supabase.ts` - Supabase 클라이언트
- `supabase-schema.sql` - DB 스키마 (SQL)
- `app/api/save-to-db/route.ts` - DB 저장 API
- `app/api/get-searches/route.ts` - DB 조회 API
- `SUPABASE_SETUP.md` - 상세 설정 가이드
- `.env.example` - Supabase 환경변수 추가

**데이터베이스 테이블:**
1. `searches` - 검색 기록
2. `news_items` - 뉴스 항목
3. `summaries` - AI 요약

**추가된 기능:**
- 검색 시 자동 DB 저장
- 검색 기록 영구 보관
- SQL 쿼리로 데이터 분석 가능

**필요한 설정:**
- Supabase 계정 가입: https://supabase.com
- 프로젝트 생성
- SQL 스키마 실행
- API 키 발급

---

## 🔑 환경변수 설정 요약

### 로컬 개발 (`.env.local`)
```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Resend (이메일)
RESEND_API_KEY=your_resend_api_key_here

# Supabase (데이터베이스)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
```

### Vercel 배포 (Environment Variables)
모든 환경변수를 Vercel Dashboard에서 설정:
- Settings → Environment Variables
- Production, Preview, Development 모두 체크

---

## 🛠️ 기술 스택

### Frontend
- **Next.js 14** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안정성
- **CSS** - 커스텀 다크 테마

### Backend (API Routes)
- **Next.js API Routes** - 서버리스 API
- **Google News RSS** - 뉴스 검색
- **Google Gemini API** - AI 요약 및 챗봇
- **Resend** - 이메일 전송
- **Supabase** - PostgreSQL 데이터베이스

### DevOps
- **Vercel** - 배포 플랫폼
- **GitHub** - 소스 코드 관리
- **npm** - 패키지 관리

---

## 📦 설치된 npm 패키지

```json
{
  "dependencies": {
    "@google/genai": "^1.38.0",        // Gemini API
    "@supabase/supabase-js": "^2.x",   // Supabase
    "fast-xml-parser": "^4.3.2",       // XML 파싱
    "next": "^14.2.35",                // Next.js
    "react": "^18.3.1",                // React
    "react-dom": "^18.3.1",            // React DOM
    "resend": "^3.x"                   // 이메일 전송
  },
  "devDependencies": {
    "@types/node": "^22.9.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.6.3"
  }
}
```

---

## 🚀 실행 방법

### 로컬 개발
```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
# .env.local 파일 생성 및 API 키 입력

# 3. 개발 서버 실행
run-dev.cmd
# 또는
npm run dev
```

### Vercel 배포
```bash
# 1. GitHub에 push
git push origin main

# 2. Vercel 연결 (최초 1회)
npx vercel --yes

# 3. 환경변수 설정
# Vercel Dashboard에서 설정

# 4. 재배포 (자동)
# GitHub push 시 자동 배포됨
```

---

## 📊 프로젝트 구조

```
CHATBOT/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # 챗봇 API
│   │   ├── news/route.ts          # 뉴스 검색 API
│   │   ├── summarize/route.ts     # 요약 API
│   │   ├── send-email/route.ts    # 이메일 전송 API
│   │   ├── save-to-db/route.ts    # DB 저장 API
│   │   └── get-searches/route.ts  # DB 조회 API
│   ├── globals.css                # 전역 스타일
│   ├── layout.tsx                 # 레이아웃
│   ├── page.tsx                   # 메인 페이지
│   └── not-found.tsx              # 404 페이지
├── lib/
│   ├── gemini.ts                  # Gemini 클라이언트
│   ├── supabase.ts                # Supabase 클라이언트
│   └── types.ts                   # 타입 정의
├── scripts/
│   └── wait-and-open.cmd          # 브라우저 자동 오픈
├── .env.local                     # 환경변수 (Git 제외)
├── .env.example                   # 환경변수 템플릿
├── .gitignore                     # Git 제외 파일
├── deploy.cmd                     # Vercel 배포
├── run-dev.cmd                    # 개발 서버 실행
├── supabase-schema.sql            # DB 스키마
├── package.json                   # 패키지 설정
├── tsconfig.json                  # TypeScript 설정
├── next.config.js                 # Next.js 설정
├── README.md                      # 프로젝트 설명
├── SUPABASE_SETUP.md              # Supabase 설정 가이드
└── PROJECT_TUTORIAL.md            # 이 파일
```

---

## 🎓 학습 포인트

### 1. Next.js App Router
- Server Components vs Client Components
- API Routes 구현
- 파일 기반 라우팅

### 2. AI API 연동
- Google Gemini API 사용법
- 프롬프트 엔지니어링
- 스트리밍 응답 처리

### 3. 외부 API 통합
- Google News RSS 파싱
- XML to JSON 변환
- 에러 핸들링

### 4. 데이터베이스 설계
- 테이블 관계 설정 (1:N, 1:1)
- 인덱스 최적화
- RLS (Row Level Security)

### 5. 이메일 전송
- Resend API 연동
- HTML 이메일 템플릿
- 환경변수 보안

### 6. 상태 관리
- React useState, useCallback
- 검색 기록 관리
- 모달 상태 관리

### 7. 배포 및 DevOps
- Vercel 배포 프로세스
- 환경변수 관리
- Git 워크플로우

---

## ⚠️ 주의사항

### 1. API 키 보안
- ❌ **절대** Git에 커밋하지 마세요
- ✅ `.env.local` 사용 (로컬)
- ✅ Vercel 환경변수 사용 (배포)

### 2. 비용 관리
- Gemini API: 무료 할당량 확인
- Resend: 월 100통 무료
- Supabase: 500MB 무료
- Vercel: 취미 프로젝트 무료

### 3. 에러 처리
- 모든 API 호출에 try-catch
- 사용자 친화적 에러 메시지
- 콘솔 로깅

---

## 🔧 문제 해결

### PowerShell 실행 정책
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### npm 에러
```bash
npm cache clean --force
npm install
```

### Vercel 빌드 실패
1. 환경변수 확인
2. `package.json` 버전 확인
3. 로그 확인

### Supabase 연결 실패
1. API 키 확인
2. SQL 스키마 재실행
3. RLS 정책 확인

---

## 📈 향후 개선 아이디어

### 기능 추가
- [ ] 사용자 로그인/회원가입
- [ ] 검색 기록 필터/정렬
- [ ] 뉴스 북마크 기능
- [ ] 뉴스 본문 크롤링
- [ ] 다국어 지원
- [ ] PDF 다운로드
- [ ] 소셜 미디어 공유

### 성능 최적화
- [ ] 이미지 최적화
- [ ] 캐싱 전략
- [ ] 무한 스크롤
- [ ] 레이지 로딩

### UI/UX 개선
- [ ] 반응형 디자인 강화
- [ ] 다크/라이트 모드 토글
- [ ] 애니메이션 추가
- [ ] 접근성 개선

---

## 📚 참고 자료

### 공식 문서
- [Next.js](https://nextjs.org/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [Supabase](https://supabase.com/docs)
- [Resend](https://resend.com/docs)

### 튜토리얼
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Vercel 배포](https://vercel.com/docs)

---

## 🎉 완성!

이 튜토리얼을 따라하면 뉴스 챗봇 프로젝트를 처음부터 끝까지 만들 수 있습니다.

**각 단계의 프롬프트를 AI에게 순서대로 입력하면 동일한 프로젝트를 만들 수 있습니다!**

---

**제작자:** liszzmword
**GitHub:** https://github.com/liszzmword/chat-bot
**이메일:** liszzmword@gmail.com
