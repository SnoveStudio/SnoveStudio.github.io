# SnoveStudio

스노베가 운영하는 SnoveStudio 공식 홈페이지. **Astro + TypeScript**로 만든 정적 사이트입니다. 브라우저용 JavaScript, 외부 폰트, 분석 SDK 없이 HTML/CSS를 배포합니다.

기본 주소: **https://snovestudio.github.io/**

## 개발과 검증

Node.js 24 LTS를 권장합니다.

```sh
npm ci
npm run dev
```

개발 서버: http://localhost:4321

```sh
npm run build
npm run check
npm run preview
```

`build`는 Astro 정적 빌드를 수행합니다. `check`는 Astro/TypeScript 진단과 생성된 페이지의 내부 링크, 앵커, 메타데이터, 사업자 정보, 개인정보 안내 상태를 검사합니다. 빌드 결과는 `dist/`에 생성하며 Git에 포함하지 않습니다.

- `src/config/site.ts`: 사업자 정보, 서비스 소개, 사이트 URL, Search Console 코드, 개인정보처리방침 상태와 본문
- `src/pages/index.astro`: 홈페이지
- `src/pages/privacy.astro`: 개인정보 안내/정책
- `src/layouts/BaseLayout.astro`: 공통 레이아웃과 메타데이터
- `src/components/`: 헤더, 푸터, 일러스트, 아이콘
- `src/styles/global.css`: 반응형 디자인
- `public/assets/favicon.svg`: 파비콘
- `astro.config.ts`: 정적 출력, 사이트 URL, base 설정

주소·대표자명·전화번호는 운영자의 공개 범위 선택에 따라 포함하지 않습니다. 사이트의 공개 정보와 개발자 계정에 제출할 정보는 별개입니다.

## 개인정보 안내

현재 `privacy.status`는 `pending`입니다. `/privacy/`에는 개발 중 안내와 문의 이메일만 표시하며 **확정된 개인정보처리방침이 아닙니다**. 검색 색인과 사이트맵에서도 제외합니다.

실제 앱의 사진·태그 저장/전송, 키보드와 클립보드 접근, 수집 정보, 외부 SDK, 보유·삭제 방식을 확인한 후에만 확정 정책을 게시하세요. 앱 코드를 공개 저장소에 넣을 필요는 없습니다.

`src/config/site.ts`의 `privacy.sections`에 확인된 정책을 `{ title: '항목 제목', paragraphs: ['확인된 본문'] }` 형태로 넣고, 실제 적용일을 `effectiveDate`에 `YYYY-MM-DD` 형식으로 입력한 뒤 `status`를 `published`로 변경합니다. 날짜와 본문이 없으면 빌드에서 차단됩니다.

게시 상태에서는 페이지 제목과 홈페이지 링크가 ‘개인정보처리방침’으로 바뀌고 사이트맵에도 추가됩니다. 본문에는 일반 텍스트를 사용합니다.

## GitHub Pages 배포

`main` push 시 `.github/workflows/pages.yml`이 의존성 설치, Astro 빌드, 검증, Pages 배포를 실행합니다.

1. GitHub Free 조직에서는 저장소를 **Public**으로 전환해야 Pages를 사용할 수 있습니다. 소스와 커밋 기록도 함께 공개됩니다. 비공개 유지가 필요하면 private 저장소의 Pages를 지원하는 요금제를 사용하세요.
2. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
3. **Settings → Actions → General**에서 워크플로의 GitHub 공식 Actions를 사용할 수 있어야 합니다.
4. `main`에 push하거나 **Actions → Deploy GitHub Pages → Run workflow**를 실행합니다.
5. **Settings → Pages**에서 HTTPS 활성화를 확인합니다.

배포 파일에는 생성된 `dist/`만 포함합니다. 사업자등록증 이미지, 앱 코드, 확인 자료는 저장소에 보관하지 않습니다.

## Google Search Console

1. `https://snovestudio.github.io/`를 URL 접두어 속성으로 등록합니다.
2. HTML 태그 방식으로 받은 `google-site-verification`의 **content 값만** `src/config/site.ts`의 `site.googleSiteVerification`에 입력합니다.
3. push와 배포 완료 후 Search Console에서 확인합니다.
4. 필요하면 Play Console에서 웹사이트 연결 요청을 승인합니다.

코드가 빈 문자열이면 메타태그를 출력하지 않습니다. Google 계정에서 소유권 확인과 Play Console 연결 승인은 별도로 완료해야 합니다.

## 자체 도메인으로 변경

1. `src/config/site.ts`의 `site.url`을 실제 HTTPS 도메인으로 바꾸고 `site.base`는 `/`로 유지합니다.
2. GitHub Pages의 Custom domain과 해당 도메인의 DNS를 설정합니다.
3. push합니다. canonical, Open Graph URL, 사이트맵, robots.txt가 새 주소로 바뀌고 `CNAME`도 정적 빌드에서 생성됩니다.
4. 새 도메인의 HTTPS와 Search Console 소유권을 확인합니다.

도메인 이전 시 Search Console 확인 코드도 새 속성에 맞는지 확인하세요.
