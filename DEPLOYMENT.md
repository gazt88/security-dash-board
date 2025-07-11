# 🚀 OK금융그룹 대시보드 배포 가이드

## 📋 배포 절차 (필수)

### 1단계: 개발 환경에서 작업
```bash
# development 브랜치에서 작업
git checkout development

# 코드 수정 후
git add .
git commit -m "설명적인 커밋 메시지"
git push origin development
```

### 2단계: 테스트 배포 (Preview) 🧪
```bash
# 테스트 배포 실행
npm run deploy:test

# 또는 직접 명령어
vercel --preview
```

### 3단계: 테스트 확인 ✅
- [ ] 모든 기능이 정상 작동하는지 확인
- [ ] 당직 스케줄링 기능 테스트
- [ ] 일정 추가/삭제 기능 테스트  
- [ ] URL 공유 기능 테스트
- [ ] 모바일 반응형 확인
- [ ] 브라우저 호환성 확인

### 4단계: 프로덕션 배포 🌟
```bash
# master 브랜치로 이동
git checkout master

# development 브랜치 병합
git merge development

# 프로덕션 배포
npm run deploy:prod

# 변경사항 푸쉬
git push origin master
```

## ⚠️ 배포 전 체크리스트

### 코드 품질
- [ ] ESLint 경고 최소화
- [ ] 콘솔 에러 없음
- [ ] 미사용 import/변수 정리

### 기능 테스트
- [ ] 달력 표시 정상
- [ ] 이벤트 추가/수정/삭제
- [ ] 당직 자동 생성
- [ ] 휴일 제외 로직
- [ ] 팀원 관리
- [ ] 데이터 저장/불러오기

### UI/UX
- [ ] OK금융그룹 브랜딩 일관성
- [ ] 반응형 디자인
- [ ] 로딩 상태 처리
- [ ] 에러 메시지 적절성

## 🔄 브랜치 전략

- **master**: 프로덕션 안정 버전
- **development**: 개발 및 테스트 버전
- **feature/xxx**: 새 기능 개발 (필요시)

## 📱 배포 환경

### 테스트 (Preview)
- URL: Vercel이 자동 생성하는 Preview URL
- 용도: 기능 검증, 버그 테스트

### 프로덕션 (Production)  
- URL: https://dashboard-o94dndzqe-gazt88s-projects.vercel.app
- 용도: 실제 사용자 접근

## 🚨 긴급 롤백 절차

문제 발생 시:
1. 이전 커밋으로 되돌리기: `git revert HEAD`
2. 긴급 배포: `npm run deploy:prod`
3. 문제 분석 후 수정

## 💡 유용한 명령어

```bash
# 배포 상태 확인
vercel ls

# 배포 로그 확인  
vercel logs

# 도메인 설정
vercel domains

# 환경 변수 설정 (향후 DB 연동 시)
vercel env
```

---
⚠️ **중요**: 프로덕션 직접 배포 금지! 반드시 테스트 환경 거쳐야 함 