# Broadcast Practical

Projeto prático de broadcast em monorepo com:

- `web`: React + TypeScript + Vite
- `functions`: Firebase Functions
- Firebase Auth + Firestore

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Crie `web/.env.local` com suas credenciais do Firebase:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

3. Rode o projeto:

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

```bash
npx firebase-tools deploy --only hosting --project teste-sendflow
```
