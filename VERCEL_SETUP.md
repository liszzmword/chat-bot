# Vercel 자동 배포 설정 가이드

## 문제: Git 커밋은 되는데 Vercel 자동 업데이트가 안 됨

### 원인
1. Vercel 프로젝트가 GitHub 저장소와 **연결되지 않음**
2. Vercel이 **특정 브랜치만** 감지하도록 설정됨
3. Vercel Import 시 **수동 배포 모드**로 설정됨

---

## 해결 방법

### 방법 1: Vercel 프로젝트를 GitHub 저장소와 연결 (권장)

#### 1단계: 기존 Vercel 프로젝트 삭제 (선택)
기존에 `vercel` CLI로 배포한 경우:

1. **[Vercel Dashboard](https://vercel.com/dashboard)** 접속
2. `chat-bot` 프로젝트 선택
3. **Settings** → **General** → 하단 **"Delete Project"**
4. 프로젝트 이름 입력하고 삭제

#### 2단계: GitHub에서 Vercel Import

1. **[Vercel Dashboard](https://vercel.com/dashboard)** 접속
2. **"Add New..." → "Project"** 클릭
3. **"Import Git Repository"** 섹션에서 GitHub 선택
4. `liszzmword/chat-bot` 저장소 찾기
   - 저장소가 안 보이면: **"Adjust GitHub App Permissions"** 클릭 → 저장소 접근 권한 부여
5. **"Import"** 클릭
6. 프로젝트 설정:
   - **Project Name**: `chat-bot` (또는 원하는 이름)
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)
7. **Environment Variables** 추가:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
8. **"Deploy"** 클릭

#### 3단계: 자동 배포 확인

이제 GitHub에 push할 때마다 자동으로 배포됩니다!

```bash
git add .
git commit -m "테스트 커밋"
git push origin main
```

**Vercel Dashboard → Deployments**에서 자동으로 배포가 시작되는 것을 확인할 수 있습니다.

---

### 방법 2: 기존 프로젝트에 GitHub 연결

기존 Vercel 프로젝트가 있고 삭제하고 싶지 않은 경우:

1. **Vercel Dashboard** → 프로젝트 선택
2. **Settings** → **Git**
3. **"Connect Git Repository"** 클릭
4. GitHub 저장소 선택: `liszzmword/chat-bot`
5. 브랜치 선택: `main`
6. **"Connect"** 클릭

---

### 방법 3: CLI로 GitHub 연결

```bash
cd c:\Users\inst\Desktop\CHATBOT
vercel link
# 프롬프트에서 기존 프로젝트 선택

vercel git connect
# GitHub 저장소 연결
```

---

## 배포 브랜치 확인

Vercel이 **어떤 브랜치를 배포**하는지 확인:

1. **Settings** → **Git**
2. **Production Branch**: `main` (또는 `master`)로 설정되어 있는지 확인

현재 로컬 브랜치:
```bash
git branch
# * main 이어야 함
```

---

## 자동 배포 흐름

```
로컬 코드 수정
    ↓
git add . && git commit -m "메시지"
    ↓
git push origin main
    ↓
GitHub에 코드 업로드
    ↓
Vercel이 자동 감지 ✅
    ↓
자동 빌드 & 배포 시작
    ↓
배포 완료 (2~3분 소요)
```

---

## 배포 확인

### Vercel Dashboard
1. **Deployments** 탭
2. 최신 배포 상태 확인:
   - ⏳ Building
   - ✅ Ready
   - ❌ Error

### 이메일 알림
- 배포 완료/실패 시 이메일 수신

### GitHub 커밋
- GitHub 저장소 → 커밋 옆에 **✅ 초록색 체크** 표시

---

## 문제 해결

### ❌ "This project is not connected to a Git repository"
→ **방법 1** 또는 **방법 2** 실행

### ❌ Push했는데 Vercel에서 아무 일도 안 일어남
1. Vercel Dashboard → Settings → Git 확인
2. **Production Branch**가 `main`인지 확인
3. GitHub App 권한 확인: Settings → Integrations → GitHub

### ❌ 빌드 에러
1. Vercel Dashboard → Deployments → 실패한 배포 클릭
2. 빌드 로그 확인
3. 환경변수 누락 여부 확인

### ❌ 한글 깨짐 (Git 커밋 메시지)
이미 해결됨! 다음 설정이 적용되었습니다:
```bash
git config --global core.quotepath false
git config --global i18n.commitEncoding utf-8
git config --global i18n.logOutputEncoding utf-8
```

---

## 테스트

간단한 수정으로 자동 배포를 테스트해보세요:

```bash
# README 수정
echo "# 테스트" >> README.md

# 커밋 & 푸시
git add README.md
git commit -m "자동 배포 테스트"
git push origin main
```

**Vercel Dashboard**에서 자동으로 배포가 시작되면 성공! 🎉

---

## 현재 상태

✅ GitHub 저장소: `https://github.com/liszzmword/chat-bot.git`  
✅ 브랜치: `main`  
✅ 한글 인코딩: UTF-8 설정 완료  
⚠️ Vercel 자동 배포: **위 방법 1 또는 2 실행 필요**  

---

**다음 단계**: 위의 **방법 1**을 따라 Vercel에서 GitHub 저장소를 Import하세요!
