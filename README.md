# HBS DATA HUB

HBS 매장 관리 및 전략 분석 시스템

## 🚀 빠른 시작

### 사전 요구사항
- Node.js (v18 이상 권장)
- Git

### 설치 방법

#### 1. 저장소 클론
```bash
git clone https://github.com/glen85-creator/HBSDATA-HUB.git
cd HBSDATA-HUB
```

#### 2. 자동 설정 (권장)
**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

#### 3. 환경 변수 설정
`.env` 파일을 열고 실제 값을 입력하세요:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Naver Geocoding API
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

#### 4. 의존성 설치
```bash
npm install
```

#### 5. 개발 서버 실행
```bash
npm run dev
```

## 📁 주요 기능

- 📍 매장 위치 기반 전략 분석
- 🗺️ 지오코딩 및 지도 시각화
- 📊 실시간 매장 데이터 관리 (Supabase)

## 🛠️ 기술 스택

- React + TypeScript
- Vite
- Supabase
- Naver Maps API
- Redux Toolkit
