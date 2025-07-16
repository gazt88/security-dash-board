## 목차

1. [사이트맵](#사이트맵)
2. [사용자 플로우](#사용자-플로우)
3. [내비게이션 구조](#내비게이션-구조)
4. [페이지 계층](#페이지-계층)
5. [콘텐츠 조직](#콘텐츠-조직)
6. [인터랙션 패턴](#인터랙션-패턴)
7. [URL 구조](#url-구조)
8. [컴포넌트 계층](#컴포넌트-계층)

---

## 사이트맵

```
/
├─ 로그인 (/login)
├─ 캘린더 (/calendar)
│  ├─ 월간 (/calendar/month)
│  ├─ 주간 (/calendar/week)
│  └─ 일간 (/calendar/day)
├─ 로스터 (/roster)
├─ PDF 내보내기 (/export/pdf)
├─ 설정 (/settings)
│  ├─ 프로필 (/settings/profile)
│  ├─ 알림 (/settings/notifications)
│  └─ 테마 (/settings/theme)
└─ 404 (/404)
```

* **모바일**: 햄버거 메뉴로 `/calendar`, `/roster`, `/settings`만 1차 노출.
* **데스크탑**: 좌측 사이드바에 전체 메뉴 고정 노출.

---

## 사용자 플로우

| 주요 시나리오         | 단계 (모바일/데스크탑 동일)                                                   |
| --------------- | ------------------------------------------------------------------ |
| **① 로그인**       | 📧 이메일 입력 → 🔗 매직링크 수신·클릭 → 홈(`/calendar/month`) 이동                |
| **② 근무 로스터 생성** | 📅 `/roster` → ➕ **로스터 생성** 버튼 → ⚙️ 옵션 (기간·팀원) → ✅ 저장 → 실시간 캘린더 반영 |
| **③ 휴가 입력**     | `/calendar` → 드래그 혹은 **빠른 추가(“연차 7/24”)** → ✏️ 모달 확인 → 저장          |
| **④ PDF 다운로드**  | `/export/pdf` → 범위 선택(월/주) → **미리보기** → **다운로드**                   |
| **⑤ 알림 설정**     | `/settings/notifications` → 토글 스위치로 이메일·Slack 선택                   |

---

## 내비게이션 구조

### 레이아웃 구성

```
┌─ Topbar ──────────────────────────────────────────┐
│ Logo | Page Title                          | User │
└───────────────────────────────────────────────────┘
┌─ Sidebar (Desktop) ──┐┌──── Main Content ─────┐
│ Calendar             ││                      │
│ Roster               ││                      │
│ Settings             ││                      │
└──────────────────────┘└──────────────────────┘
```

* **Topbar 요소**

  * 좌측: 로고(홈), 현재 페이지 명
  * 우측: 알림 아이콘, 프로필 드롭다운

* **Sidebar**

  * 아이콘 + 라벨 (데스크탑)
  * **모바일**: 햄버거 → 드로어 오버레이

---

## 페이지 계층

|  레벨 | 페이지                  | 주요 목적             |
| :-: | -------------------- | ----------------- |
|  0  | 레이아웃(Topbar+Sidebar) | 모든 페이지 공통 래퍼      |
|  1  | 캘린더 홈                | 월간 뷰 기본, 주/일 탭    |
|  1  | 로스터                  | 자동 생성·편집          |
|  1  | PDF 내보내기             | 미리보기 & 다운로드       |
|  1  | 설정                   | 사용자 환경 구성         |
|  2  | 설정·프로필               | 이름·테마(다크/라이트)     |
|  2  | 설정·알림                | 이메일/Slack Webhook |
|  2  | 설정·테마                | 다크 모드·글꼴 크기       |

---

## 콘텐츠 조직

| 콘텐츠 타입               | 저장 위치               | 표시 위치          |
| -------------------- | ------------------- | -------------- |
| **이벤트(Event)**       | `events` 테이블        | 캘린더 뷰          |
| **공휴일(Holiday)**     | `holidays` 테이블      | 캘린더 뷰, 연회색 배경  |
| **로스터(RosterEntry)** | `roster` 테이블        | 로스터 페이지·캘린더 태그 |
| **설정(UserSetting)**  | `user_settings` 테이블 | 설정 화면 초기값      |
| **PDF 파일**           | 클라이언트 메모리 → 다운로드    | 사용자 디바이스 저장    |

> **모바일 우선**: 핵심 콘텐츠(이벤트 카드·로스터 리스트)만 1열, 부가 정보는 아코디언/탭으로 접음.
> **데스크탑**: 2\~3열 그리드, 사이드 패널(세부 정보) 동시 노출.

---

## 인터랙션 패턴

| 패턴                 | 설명                           | 접근성(A11y) 고려                           |
| ------------------ | ---------------------------- | -------------------------------------- |
| **Drag & Drop**    | 데스크탑 주간/일간 뷰에서 시간대 이동        | 키보드 `Space+Arrow` 로 대체 이동              |
| **Quick-Add 입력창**  | `"10:00-12:00 서버 점검"` 자연어 파싱 | 입력 후 `Enter` → ARIA live region 피드백    |
| **모달(Dialog)**     | 이벤트 추가/편집                    | `role="dialog"` & `aria-labelledby` 지정 |
| **Snackbar/Toast** | 저장·실패 알림 (3s)                | `aria-live="assertive"`                |
| **실시간 배지**         | 다른 사용자 편집 시 상단 `"동기화 중"` 배지  | 색상 대비 4.5:1 이상                         |

---

## URL 구조

| Path                      | 목적         | 메서드/파라미터 예시        |
| ------------------------- | ---------- | ------------------ |
| `/calendar/month`         | 월간 뷰       | `?date=2025-07-01` |
| `/calendar/week`          | 주간 뷰       | `?week=2025-W29`   |
| `/calendar/day`           | 일간 뷰       | `?date=2025-07-14` |
| `/roster`                 | 로스터 리스트    | —                  |
| `/roster/new`             | 로스터 생성 마법사 | —                  |
| `/export/pdf`             | PDF 미리보기   | `?range=2025-07`   |
| `/settings/profile`       | 프로필        | —                  |
| `/settings/notifications` | 알림         | —                  |
| `/settings/theme`         | 테마         | —                  |

### 내부 / 외부 링크 전략

* **내부 링크**: `next/link` 컴포넌트 (클라이언트 HMR 캐시 혜택).
* **외부 링크**: `<a target="_blank" rel="noopener">`—예: Naver Calendar API 문서, Slack OAuth 권한 안내.

---

## 컴포넌트 계층

```
AppLayout
├─ Topbar
│  ├─ Logo
│  ├─ PageTitle
│  └─ UserMenu
├─ Sidebar
│  ├─ NavItem
│  └─ CollapseButton (mobile)
└─ PageContainer
   ├─ CalendarPage
   │  ├─ CalendarHeader (월/주/일 탭)
   │  ├─ CalendarGrid
   │  │  └─ EventCard
   │  └─ EventModal
   ├─ RosterPage
   │  ├─ RosterTable
   │  └─ RosterWizard
   ├─ PdfExportPage
   │  ├─ PdfPreview
   │  └─ DownloadButton
   └─ SettingsPage
      ├─ ProfileForm
      ├─ NotificationToggles
      └─ ThemeSwitcher
```

* **Atomic Components**: Button, Input, Select, Tooltip, Badge
* **Tailwind**: `@layer`로 다크 테마 변수화, 모바일 `sm:` 이상 브레이크포인트 확장
* **상태 관리**: React Context → Supabase Realtime 리스너 → SWR 캐시

---

### 추가 메모

* **접근성**: 키보드 탐색 탭 순서 보장, `prefers-reduced-motion` 사용 시 애니메이션 최소화
* **퍼포먼스**: `/calendar`에만 real-time 구독; 백그라운드 탭에서는 WebSocket 일시 중지
* **보안**: 모든 API 호출 시 Supabase JWT 포함, HTTPS 강제(HSTS)
* **가능한 확장**: `/api/holidays/refresh` Edge Function → 크론트리거(주 1회)

---
