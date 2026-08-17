# Atlas Sanctum Mobile App

Field agent companion app for community reporting, impact tracking, and offline sensor data collection.

## Stack

- React Native (Expo ~51)
- TypeScript
- `@atlas-sanctum/sdk`
- Offline-first with background sync via NetInfo

## Features

- Field impact reporting with GPS tagging
- Offline sensor data collection (syncs when connected)
- Community governance participation with offline vote queuing
- Bioregional map with live sensor overlays (react-native-maps)
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
│   │   ├── HomeScreen.tsx        ✅ Mission dashboard + sync status
│   │   ├── ReportScreen.tsx      ✅ GPS-tagged field reports + offline queue
│   │   ├── MapScreen.tsx         ✅ Bioregional map + sensor overlays
│   │   ├── GovernanceScreen.tsx  ✅ DAO proposals + offline voting
│   │   └── ProfileScreen.tsx     ✅ Identity, reputation, queue management
│   ├── lib/
│   │   ├── offline-queue.ts      ✅ AsyncStorage-backed action queue
│   │   └── sync.ts               ✅ NetInfo-driven auto-sync
│   ├── navigation/
│   │   └── AppNavigator.tsx      ✅ Bottom tab navigator
│   └── App.tsx                   ✅ Entry point + sync listener
├── package.json
└── README.md
```

## Status

✅ Complete — all screens implemented, offline-first architecture in place.
