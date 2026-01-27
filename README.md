# 뉴스 챗봇

키워드를 입력하면 **Google 뉴스**에서 관련 뉴스 10건을 검색하고, **Google Gemini API**로 요약한 뒤, 그 뉴스를 기반으로 대화할 수 있는 챗봇입니다.

## 기능

- **뉴스 검색**: Google News RSS로 키워드별 최대 10건 검색
- **AI 요약**: Gemini가 뉴스 제목을 종합해 3~5문장 요약
- **뉴스 기반 대화**: 요약·뉴스 목록을 컨텍스트로 질의응답

## API 키 보안

- **Gemini API 키는 코드/저장소에 포함하지 않습니다.**
- 로컬: `.env.local`에 `GEMINI_API_KEY` 설정
- **Vercel**: 프로젝트 **Environment Variables**에 `GEMINI_API_KEY` 추가

### Vercel 환경변수 설정

1. [Vercel](https://vercel.com)에 프로젝트 배포 후, 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 이름: `GEMINI_API_KEY`, 값: (Gemini API 키)
4. 환경: **Production**, **Preview**, **Development** 중 필요한 곳 선택
5. **Save** 후 재배포

### 로컬 개발

- **`.env.local`** 에 `GEMINI_API_KEY`가 있으면 로컬에서 그 키를 사용합니다. (이미 생성되어 있음)
- 다른 PC에서 쓸 때: `.env.example`을 복사해 `.env.local`을 만든 뒤 `GEMINI_API_KEY`에 키를 입력하면 됩니다.

## 설치 및 실행

**1. 의존성 설치 (최초 1회)**  
`npm install`

**2. 로컬 실행 (run-dev.cmd 한 번만 실행)**

- **`run-dev.cmd`** 를 더블클릭 → 서버가 켜지고, **몇 초 뒤 브라우저가 자동으로 열립니다.**  
  (직접 주소 칠 필요 없음: http://localhost:3000)

또는 터미널에서: `npm run dev` 후 브라우저에서 http://localhost:3000 접속.

---

## CMD 없이 사용하기 (실행 없이 접속만)

**한 번만 Vercel에 배포**해 두면, 이후에는 **브라우저에서 URL만 열면** 되고 CMD나 서버 실행이 필요 없습니다.

1. **`deploy.cmd`** 더블클릭 (또는 `npx vercel --yes`)  
   - Vercel 로그인/가입 후 프로젝트가 생성되고 URL이 나옵니다.
2. Vercel **Settings → Environment Variables**에 `GEMINI_API_KEY` 추가 후 **재배포**.
3. 이후부터는 **나타난 URL**(예: `https://news-chatbot-xxx.vercel.app`)만 열면 됩니다.

### PowerShell에서 `npm run dev` 실행이 안 될 때

PowerShell 실행 정책 오류가 나면 다음 중 하나를 시도하세요.

- **방법 1 (가장 간단)** `run-dev.cmd` 더블클릭
- **방법 2 (권장)** 터미널에서 한 번만 실행:  
  `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`  
  이후 `npm run dev`
- **방법 3** CMD 사용: `cmd` 입력 후 `npm run dev`
- **방법 4** `npx.cmd next dev` 입력

## 빌드 및 Vercel 배포

```bash
npm run build
```

Vercel에 연동된 경우 `git push`만 해도 자동 배포됩니다. 배포 전 **Environment Variables**에 `GEMINI_API_KEY`를 반드시 설정하세요.

## 문제 해결

| 현상 | 원인 | 조치 |
|------|------|------|
| `GEMINI_API_KEY가 설정되지 않았습니다` | `.env.local` 없음 또는 Vercel 환경변수 미설정 | `.env.local` 생성 후 `GEMINI_API_KEY` 추가, 또는 Vercel Environment Variables에 추가 |
| **`Your API key was reported as leaked`** (403 PERMISSION_DENIED) | **기존 API 키가 유출로 차단됨** | **[Google AI Studio](https://aistudio.google.com/apikey)에서 새 키 발급 → `.env.local`과 Vercel 환경변수에 새 키로 교체** |
| `이 키워드로 검색된 뉴스가 없습니다` | 해당 키워드로 Google 뉴스 결과 없음 | 다른 키워드로 검색 |
| `뉴스 검색 중 오류`, `Google News RSS 오류: 403` | Google News가 요청을 차단(User-Agent 등) | 이미 적용된 브라우저 User-Agent 사용 중. 로컬/방화벽에서 `news.google.com` 접근 여부 확인 |
| `요약 실패` / `챗 실패`, `model not found` 등 | Gemini 모델 접근 불가(키·리전·모델명) | `gemini-2.5-flash` 사용 중. [Google AI Studio](https://aistudio.google.com/apikey)에서 키 확인·재발급 |
| PowerShell에서 `npm` 실행 안 됨 | 실행 정책 | 위 "PowerShell에서 npm run dev 실행이 안 될 때" 참고 |
| **Connection Failed / ERR_CONNECTION_REFUSED** | **개발 서버가 안 떠 있음** | **`run-dev.cmd` 실행 → `Ready` 나온 뒤 http://localhost:3000 접속** |
| **404 This page could not be found** | **브라우저가 서버 준비 전에 열림** | **`run-dev.cmd`는 서버가 준비된 뒤 브라우저를 엽니다. 404가 보이면 `Ready`가 보일 때까지 기다린 뒤 F5로 새로고침.** |

## tech

- **Next.js 14** (App Router)
- **Google News RSS** (뉴스 검색, 별도 API 키 불필요)
- **@google/genai** (Gemini 2.5 Flash, 요약·챗)
- **fast-xml-parser** (RSS 파싱)
