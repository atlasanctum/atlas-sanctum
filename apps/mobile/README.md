# Atlas Sanctum Mobile App

Field agent companion app for community reporting, impact tracking, and offline sensor data collection.

## Stack

- React Native (Expo)
- TypeScript
- `@atlas-sanctum/sdk`
- Offline-first with background sync

## Features

- Field impact reporting with GPS tagging
- Offline sensor data collection (syncs when connected)
- Community governance participation
- Push notifications for alerts and proposal deadlines
- Multilingual (EN, ES, FR, SW, PT, HI, ZH, AR)
- Low-bandwidth mode for remote areas

## Setup

```bash
cd apps/mobile
npm install
npx expo start
```

## Structure

```
apps/mobile/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── ReportScreen.tsx
│   │   ├── MapScreen.tsx
│   │   ├── GovernanceScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   │   ├── offline-queue.ts
│   │   └── sync.ts
│   └── navigation/
├── app.json
└── package.json
```

## Status

🚧 In development — React Native scaffold in progress.
Core SDK integration complete. Screens being built.
