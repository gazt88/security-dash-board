# 정보보안팀 일정관리 대시보드 (OK금융그룹)

## 🚀 배포/운영/개발 자동화 규칙
- 남은 작업(인증/권한/라우팅, 유틸, 통합 테스트, 문서화/배포 등)은 사용자에게 묻지 않고 자동으로 순차 진행한다.
- Supabase 실시간 연동, 네이버 API, PDF, 접근성, 권한, 디자인 시스템 등 모든 요구사항을 완벽히 반영한다.

## 🎯 주요 기능
- Supabase 실시간 캘린더/당직/공휴일 CRUD 및 구독
- 네이버 캘린더 API 연동(공휴일 동기화)
- PDF 내보내기(월간/주간, WCAG/브랜드 반영)
- 모든 사용자가 일정 수정/삭제 가능(권한/RLS)
- 다크모드/반응형/접근성(WCAG 2.2 AA)
- 설정(알림/테마), 프로필, Slack/이메일 알림 토글
- 관리자만 과거 30일 초과 일정 수정 가능
- 디자인 시스템(Design.md 기반) 완전 적용

## 🛠 기술 스택
- **Frontend**: React 18, TailwindCSS, Shadcn-UI
- **DB/실시간**: Supabase(PostgreSQL, Realtime, RLS)
- **API**: 네이버 캘린더 OpenAPI(공휴일)
- **PDF**: pdf-lib, html2canvas
- **배포**: Vercel(Preview/Prod), GitHub Actions

## 📁 프로젝트 구조 (주요)
```
src/
  api/           # supabase.js, naverCalendar.js
  components/    # CalendarGrid, AddEventModal, DutyScheduleModal, PdfPreview, SettingsPage 등
  utils/         # holidays.js, auth.js
  App.js         # 인증/권한/라우팅 통합
  index.css      # 디자인 시스템, 접근성, 반응형
```

## ⚡ 실행/배포
```bash
npm install
npm run dev      # 개발
npm run deploy:test  # 테스트 배포 (Vercel Preview)
npm run deploy:prod  # 프로덕션 배포 (Master 브랜치)
```

## 🛡️ 인증/권한/보안
- Supabase JWT, *@company.com* 도메인만 접근
- RLS: 모든 사용자가 일정 수정/삭제 가능, 과거 30일 초과는 관리자만
- SettingsPage에서 알림/테마/프로필 관리

## 🗓️ 캘린더/당직/공휴일
- 실시간 동기화: Supabase Realtime 구독
- 당직 자동 생성: 평일/공휴일 제외, 라운드로빈, 미리보기/확정
- 네이버 API 연동: 공휴일 동기화(관리자 수동)
- PDF 내보내기: WCAG/브랜드 반영, 월간/주간 지원

## ♿ 접근성/반응형/디자인
- WCAG 2.2 AA 포커스 링, 명도 대비, 키보드 탐색
- 모바일/데스크탑 반응형, 다크모드, 디자인 토큰

## 🧪 테스트/운영
- 실시간 동기화, 권한, 엣지케이스, 보안 체크리스트 자동화
- DEPLOYMENT.md 체크리스트 준수

## 📚 문서
- [PRD](./DOC/1)PRD.MD) [IA](./DOC/2)IA.MD) [USECASE](./DOC/3)USECASE.MD) [DESIGN](./DOC/4)DESIGN.MD)

## 📝 라이선스
OK금융그룹 정보보안팀 내부 전용. 외부 배포/상업적 이용 금지. 