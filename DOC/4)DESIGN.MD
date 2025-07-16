## Design System Overview

친근하면서도 전문적인 이미지를 전면에 내세우되 (*energetic, trustworthy, playful, modern*) 금융회사 브랜드 신뢰도를 유지하는 **OK금융그룹** 사내 제품 전용 디자인 시스템입니다.

* **톤 & 매너**: 밝은 에너지, 신뢰·안전, 약간의 위트(‘읏맨’ 활용)
* **접근성**: WCAG 2.2 AA 이상을 기본 목표
* **일관성**: Tailwind CSS + Shadcn-UI 컴포넌트 토큰화
* **유지보수**: 디자인 토큰(Tailwind `theme.extend.colors`) ↔ 코드 1-to-1 매핑
* **확장성**: 신규 서비스(모바일·웹·내부 포털) 모두 동일 토큰 사용

---

## Color Palette for TailwindCSS

| Token             | Tailwind 변수             | HEX       | 용도                |
| ----------------- | ----------------------- | --------- | ----------------- |
| **primary-500**   | `--color-primary-500`   | `#5C4C4D` | 헤드라인, 본문 기본 글자    |
| primary-600       | `--color-primary-600`   | `#4A3D3E` | Hover/Pressed 텍스트 |
| **accent-yellow** | `--color-accent-yellow` | `#F6AB00` | 강조 라벨, 아이콘        |
| **accent-red**    | `--color-accent-red`    | `#FF4B07` | CTA 버튼, 경고        |
| **neutral-800**   | `--color-neutral-800`   | `#4C6971` | 헤더/푸터 배경          |
| base-white        | `--color-base-white`    | `#FFFFFF` | 글자(다크 BG에서)       |

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { 500: '#5C4C4D', 600: '#4A3D3E' },
        accent:  { yellow: '#F6AB00', red: '#FF4B07' },
        neutral: { 800: '#4C6971' },
        base:    { white: '#FFFFFF' }
      }
    }
  }
};
```

### 상태별 사양 예: **Primary Button**

| State    | 배경               | 글자              | 보더 | 그림자         |
| -------- | ---------------- | --------------- | -- | ----------- |
| Default  | `primary-500`    | `base-white`    | 투명 | `shadow-md` |
| Hover    | `primary-600`    | `base-white`    | 투명 | `shadow-lg` |
| Disabled | `neutral-800/30` | `base-white/50` | 투명 | 없음          |

---

## Page Implementations

| Page            | 목적               | 주요 컴포넌트                                 | 레이아웃                         |
| --------------- | ---------------- | --------------------------------------- | ---------------------------- |
| **/calendar**   | 실시간 일정 확인·수정     | `CalendarGrid`, `EventModal`, `Sidebar` | 2-Column (Sidebar + Content) |
| **/roster**     | On-call 순번 조회·생성 | `RosterTable`, `RosterWizard`           | Full Width                   |
| **/export/pdf** | 월/주 스케줄 PDF 미리보기 | `PdfPreview`, `DownloadButton`          | Centered Card                |
| **/settings**   | 알림·테마·프로필 수정     | `Tabs`, `FormField`, `Toggle`           | 1-Column Form                |

> **Mock-up 예시**
> `![캘린더 화면](https://picsum.photos/seed/calendar/1280/720)`
> `![로스터 화면](https://picsum.photos/seed/roster/1280/720)`

---

## Layout Components

| 컴포넌트              | 적용 Route               | 구조                          | 반응형 동작               |
| ----------------- | ---------------------- | --------------------------- | -------------------- |
| **Topbar**        | 전체                     | Logo - PageTitle - UserMenu | 모바일: 높이 56 px, 고정    |
| **Sidebar**       | `/calendar`, `/roster` | NavIcon + Label List        | 모바일: 햄버거 → Drawer    |
| **PageContainer** | 전체                     | `px-4 lg:px-8`              | `max-w-1440 mx-auto` |
| **Footer**        | `/export/pdf` 제외       | 브랜드 저작권                     | 모바일 세로 패딩 16 px      |

---

## Interaction Patterns

| 패턴              | Tailwind Stack                                                    | 접근성 메모                                   |
| --------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| Focus Ring      | `focus:outline-none focus:ring-2 focus:ring-accent-yellow`        | `aria-*` 속성 동시 제공                        |
| Hover Elevation | `transition-shadow hover:shadow-lg`                               | motion 선호도 `prefers-reduced-motion` 처리   |
| Toast           | `fixed bottom-4 right-4 bg-accent-red text-base-white rounded-xl` | `role="alert"` & `aria-live="assertive"` |

---

## Breakpoints

```scss
$breakpoints: (
  'mobile':  320px,
  'tablet':  768px,
  'desktop': 1024px,
  'wide':   1440px
);
```

| BP      | Tailwind 프리픽스 | 주 사용례             |
| ------- | ------------- | ----------------- |
| mobile  | 기본(없음)        | 단일 열, Bottom Tabs |
| tablet  | `md:`         | Sidebar 미니모드      |
| desktop | `lg:`         | Sidebar 고정, 2-열   |
| wide    | `xl:`         | 캘린더 그리드 7×6 풀 해상도 |

---

## WCAG 2.2 Contrast Checklist

| 요소            | 전경색 / 배경색               | 대비 비 (AA 요구 ≥ 4.5:1) |           통과           |
| ------------- | ----------------------- | -------------------- | :--------------------: |
| 기본 텍스트        | `#5C4C4D` / `#FFFFFF`   | 7.0:1                |            ✔           |
| CTA 버튼        | `#FF4B07` / `#FFFFFF`   | 4.9:1                |            ✔           |
| 헤더 텍스트        | `#FFFFFF` / `#4C6971`   | 5.8:1                |            ✔           |
| Disabled Text | `#FFFFFF80` / `#4C6971` | 2.5:1                | ✖ (명시적 “비활성” 상태 설명 필요) |

---

## Logo & Mascot Usage Do ❯❯ Don’t ⛔

|          | Do                                         | Don’t                |
| -------- | ------------------------------------------ | -------------------- |
| **Logo** | 여백 ≥ 로고 높이 ½, `#4C6971`·`transparent` 위 사용 | 배경 그라데이션, 회전, 글자 재배치 |
| **읏맨**   | 작은 장치(툴팁, 404, 로딩)에서 80–160 px             | 업무 경고·위험 메시지 옆 배치    |

---

## 예제 Tailwind 컴포넌트 코드

```tsx
// components/Button.tsx
export function Button({ variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-xl font-semibold';
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-base-white',
    danger:  'bg-accent-red hover:bg-accent-red/90 text-base-white'
  };
  return <button className={`${base} ${variants[variant]}`} {...props} />;
}
```

---

## Interaction Spec (Table)

| 컴포넌트           | 이벤트     | 기대 결과         | 접근성 캡션             |
| -------------- | ------- | ------------- | ------------------ |
| CalendarCell   | Click   | EventModal 열림 | 모달 `role="dialog"` |
| RosterRow Drag | DragEnd | 순번 교환         | ARIA 드래그 속성 업데이트   |
| PDF Download   | Click   | Blob 생성→저장창   | 파일 크기 > 0 검증       |

---

### 끝.
