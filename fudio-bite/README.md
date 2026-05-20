Fudio Bite — Expo + TypeScript POS

Quick start

1. Install dependencies

```bash
npm install
```

2. Start Metro / Expo

```bash
npx expo start
```

3. Open in Expo Go or simulator. Default seeded users:

- admin / admin123
- cashier / cashier123

Build (EAS)

1. Install EAS CLI and login:

```bash
npm install -g eas-cli
eas login
```

2. Build for Android/iOS (example):

```bash
eas build --platform android --profile production
```

3. Submit to store (Android example):

```bash
eas submit --platform android --profile production
```

Notes

- Database: Uses `expo-sqlite` and seeds data on first run. The DB file name is `fudiobite.db` in app storage.
- State: Uses `zustand` for auth and lightweight state.
- Printing: A placeholder printer helper is included in `src/utils/print.ts`. To integrate a real thermal printer (Bluetooth) on Android, install a native library such as:
  - `react-native-thermal-receipt-printer` (or)
  - `react-native-bluetooth-escpos-printer`

  Follow the library docs to add native modules and then replace `printReceipt` in `src/utils/print.ts` with actual printer code.

Important configuration

- App package ID updated to `com.tech9et.fudiobite` in `app.json`.
- Theme uses a dark background, red accent, and gold price highlight (see `src/constants/theme.ts`).

Files of interest

- `src/data/seed.ts` — seed products & categories extracted from the provided menu image.
- `src/db/*` — SQLite client, helpers, and schema initialization.
- `src/utils/seedLoader.ts` — seeds DB and creates default users (hashed passwords).
- `src/store/authStore.ts` — Zustand store for authentication.
- `src/app/*` — screens: `pos.tsx`, `products.tsx`, `productEdit.tsx`, `categories.tsx`, `orders.tsx`, `orderDetail.tsx`, `expenses.tsx`, `reports.tsx`, `settings.tsx`.

Next recommended steps

1. Integrate a native thermal printer library (I can add detailed steps and example code for a chosen library).
2. Polish UI, add icons (lucide/react-native-vector-icons), and create a custom app icon and splash.
3. Add export CSV/PDF for reports.

If you want, I can now integrate a specific thermal printer plugin and wire pairing/print flows. Which plugin do you prefer or should I pick a commonly used one for Android thermal printers?
