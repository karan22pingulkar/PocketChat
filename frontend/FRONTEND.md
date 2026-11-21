# PocketChat Frontend — Code Map

Quick reference: where each piece of code lives and what to edit when you want to change something.

## File tree

```
frontend/src/
├── main.tsx              App entry — wraps App in <BrowserRouter> + <AuthProvider>
├── App.tsx               Routes: /login, /register, / (protected chat)
├── types.ts              Interfaces: Message, Attachment, Chat
├── index.css             🎨 ALL theme colors live here (CSS variables in :root)
├── chat.css              All layout + component styles + animations + media queries
├── ChatPage.tsx          Chat screen: messages, composer, emoji, files, ticks
├── Sidebar.tsx           Chat list, search, profile pic, logout button
├── auth/
│   ├── AuthContext.tsx   Token state + login/register/logout/devEnter
│   └── RequireAuth.tsx   Route guard — redirects to /login when no token
├── api/
│   ├── client.ts         Single fetch wrapper (base URL + Bearer token)
│   ├── auth.ts           login() / register() API calls
│   └── messages.ts       getMessages() / sendMessage() / uploadFile()
└── pages/
    ├── LoginPage.tsx     Login form
    ├── RegisterPage.tsx  Register form
    └── auth.css          Auth page styles
```

## "I want to change X" — cheat sheet

| What | File | Function / place |
|---|---|---|
| Any color (accent, bubbles, bg) | `index.css` | `:root` block at the very top — change a value, whole app updates |
| Chat bubbles look/size | `chat.css` | `.bubble`, `.msg-row.mine .bubble` (~line 95) |
| Bubble tail | `chat.css` | `.msg-row.mine .bubble::after` |
| Timestamp pill / ticks | `chat.css` | `.msg-time`, `.tick`, `.tick.seen` |
| Tick logic (sent→delivered→seen) | `ChatPage.tsx` | `updateStatus()` + `addMessage()` — the two `setTimeout` delays |
| Send message behavior | `ChatPage.tsx` | `sendMessage()` |
| File attach behavior | `ChatPage.tsx` | `handleFileChange()` |
| Big emoji rule | `ChatPage.tsx` | `isEmojiOnly()` + `.big-emoji` in `chat.css` |
| Chat list items / categories | `ChatPage.tsx` | `chats` array at top of file |
| Sidebar preview text | `ChatPage.tsx` | `sidebarChats` map (last message → preview) |
| Search box logic | `Sidebar.tsx` | `filteredChats` filter |
| Profile picture upload | `Sidebar.tsx` + `ChatPage.tsx` | `onPicSelect` → `handlePicSelect()` (saves to localStorage) |
| Emoji list in popup | `ChatPage.tsx` | `emojis` array |
| Mobile/tablet layout | `chat.css` | `@media` blocks at bottom of file |
| Mobile brand row | `Sidebar.tsx` + `chat.css` | `.app-brand` / `.sidebar-top` |
| Animations | `chat.css` | `@keyframes` + animation rules near bottom |

## Auth flow

| Piece | Where |
|---|---|
| Token storage | `auth/AuthContext.tsx` — `localStorage.getItem("token")` |
| Login call | `api/auth.ts` → `login()` → POST `/auth/login` |
| Register call | `api/auth.ts` → `register()` → POST `/auth/register` |
| Route protection | `auth/RequireAuth.tsx` — wraps `/` in `App.tsx` |
| Logout | `Sidebar.tsx` footer button → `logout()` in context |
| Dev bypass | `devEnter()` in `AuthContext.tsx` — **delete once backend works** |

## Backend hookup (when FastAPI is ready)

- API base URL → `frontend/.env` → `VITE_API_URL`
- Every request goes through `api()` in `api/client.ts` — token header is automatic
- To make chat real, in `ChatPage.tsx` replace `mockMessages` + `messagesByChat` state with `getMessages()` / `sendMessage()` / `uploadFile()` from `api/messages.ts`
- Expected backend endpoints (design FastAPI to match):
  - `POST /auth/register` `{email, password}` → `{access_token}`
  - `POST /auth/login` `{email, password}` → `{access_token}`
  - `GET /messages` → `Message[]`
  - `POST /messages` `{text}` → `Message`
  - `POST /messages/attachments` (FormData `file`) → `Message`
