# Tech9et — Eid Mubarak 🌙

Created by **Saqib Ali** | Tech9et

---

## 🌐 Website — Vercel Deploy

```bash
npm i -g vercel
vercel
```

Vercel deploy hone ke baad jo URL mile (e.g. `https://tech9et-eid.vercel.app`),
use `eid-app/App.js` mein line 10 pe update karo:

```js
const WEBSITE_URL = 'https://your-project.vercel.app';
```

---

## 📱 React Native App (Expo)

```bash
cd eid-app
npm install
npx expo start
```

- Android pe test: **Expo Go** app install karo, QR scan karo
- APK build karne ke liye:

```bash
npx eas build -p android --profile preview
```

> EAS ke liye `expo.dev` pe free account banana hoga aur `eas-cli` install karna hoga:
> `npm i -g eas-cli && eas login`
