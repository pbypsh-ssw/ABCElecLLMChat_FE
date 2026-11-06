# ABC electronics

가전 브랜드 ABC electronics의 메인, 제품 안내, 제품 문의 챗봇 화면을 구현한 React 앱입니다.

챗봇은 `POST /chat` API로 AI 서버에 질문을 보내 답변을 받고, 대화 기록은 브라우저의 IndexedDB에 저장합니다. 챗봇을 쓰려면 API 서버가 `localhost:8080`에서 실행 중이어야 합니다. 운영 서버는 없습니다.

**스택:** React 19, Vite 8, React Router 8, Redux Toolkit, Vitest, ESLint, Prettier

## 실행

모든 명령어는 `my-react-app` 폴더에서 실행합니다.

```bash
npm install
cp .env.example .env
npm run dev
```

`.env`의 `VITE_API_BASE_URL`이 API 서버 주소입니다. 값을 바꾸면 `npm run dev`를 다시 실행해야 합니다.

터미널에 표시되는 주소(기본 `http://localhost:5173`)를 브라우저에서 엽니다.

| 주소 | 화면 |
| --- | --- |
| `/` | 메인 |
| `/products` | 제품 안내 |
| `/chat` | 챗봇 전체 화면 |

챗봇 패널은 `/chat`을 뺀 화면 오른쪽 아래의 **제품 문의** 버튼으로 엽니다.

패널 맨 위의 막대를 위아래로 끌면 높이를 바꿀 수 있습니다. 키보드는 막대에 포커스를 두고 위아래 방향키를 씁니다. 바꾼 높이는 패널을 닫았다 열어도 유지되고, 새로고침하거나 `/chat`으로 이동하면 원래대로 돌아갑니다.

입력창에 `/clear`를 보내면 이 브라우저에 저장된 대화를 지우고 인사말만 남깁니다. 이 명령어는 서버로 보내지 않습니다.

PR을 올리기 전에는 아래 명령어를 모두 통과시킵니다.

```bash
npm run format:check
npm run lint
npm test
npm run build
```

## 파일 구조

feature-first 구조입니다. 한 기능의 코드와 디자인은 그 기능의 폴더 안에 두고, 여러 기능이 함께 쓰는 것만 `core`와 `shared`에 둡니다.

```text
src/
├─ main.jsx                     React 시작 파일
├─ index.css                    reset과 앱 공통 레이아웃
│
├─ app/                         앱 조립
│  ├─ App.jsx                   store와 라우터 연결
│  ├─ router/                   주소와 화면 연결, RootLayout
│  └─ store/                    기능별 reducer를 하나로 합침
│
├─ core/                        여러 기능이 함께 쓰는 기반
│  ├─ components/
│  │  ├─ Header.jsx, Footer.jsx
│  │  ├─ design.css             공통 글자, 색, 구조 클래스와 Header, Footer 레이아웃
│  │  └─ constants/             공통 상수
│  │     ├─ colors.js, typography.js, spacing.js
│  │     ├─ shape.js, motion.js, layer.js, layout.js
│  │     └─ cssVariables.js     상수를 CSS 변수 이름에 연결
│  ├─ constants/
│  │  ├─ paths.js               페이지 주소
│  │  └─ database/              고정 데이터(products.js, company.js)
│  ├─ database/                 IndexedDB 연결
│  ├─ i18n/                     번역 함수와 locales/ko.json
│  └─ utils/                    고유 ID 생성
│
├─ features/
│  ├─ home/                     constants/, design.css, pages/
│  ├─ product/                  constants/, design.css, pages/, components/
│  └─ chat/
│     ├─ constants/             colors.js, sizes.js, cssVariables.js, api.js
│     ├─ design.css             챗봇 디자인
│     ├─ api/                   서버 호출(chatApi), 요청·응답 형식(chatDto), 기록 저장(chatHistoryApi)
│     ├─ domain/                메시지 형식과 변환
│     ├─ store/                 Redux 상태(chatSlice)와 useChat 훅
│     ├─ pages/                 /chat 화면
│     ├─ components/            위젯, 패널, 메시지, 입력창, 안내 문구
│     └─ index.js               다른 폴더에 공개하는 항목
│
├─ shared/hooks/                공통 훅(Esc 키, 맨 아래로 스크롤)
└─ assets/design/               디자인에서 추출한 SVG
```

### 챗봇 데이터 흐름

```text
ChatInput → chatSlice → chatApi(POST /chat) → 답변 텍스트로 변환
                │
                ├→ chatHistoryApi(IndexedDB에 질문과 답변 저장)
                └→ useChat → ChatPanel
```

서버 응답은 `chatDto.js`에서 변환하므로 store와 화면에는 답변 텍스트만 전달됩니다. 저장된 기록도 `toMessage`로 변환해 저장소 전용 필드인 `seq`를 뺍니다.

### API 호출 처리

| 상황 | 프론트 상태(`sendStatus`) | 화면 |
| --- | --- | --- |
| 응답 대기 | `sending` | 봇 말풍선에 점 세 개 애니메이션 표시(화면 낭독기에는 "답변을 작성하고 있어요."), 보내기 비활성화 |
| HTTP 200 | `idle` | 답변 말풍선 |
| HTTP 422, 500, 네트워크 오류, 30초 초과 | `failed` | 오류 안내(서버 메시지는 화면에 표시하지 않음) |
| 답변을 기다리는 중 패널을 닫거나 화면 이동 | `idle` | 요청 취소, 오류 표시 없음 |

답변을 기다리는 동안에는 입력을 보낼 수 없으므로 `/clear`도 실행되지 않습니다. 삭제 상태는 `clearStatus`로 따로 관리하며, 삭제에 실패하면 대화를 그대로 두고 오류 안내를 표시합니다.