# FunStack Lab

A six-screen React Native CLI app showcasing a playful full-stack flow:

- Splash → Auth → tab navigation built with React Navigation 6.
- Firebase Email/Password auth with disposable-email blocking, password strength hints, and forgot password.
- Notification tab featuring a big red button that fires a local notification and lets you sign out.
- Photo tab to capture/pick an image, upload it to Firestore (Base64), and stream updates live.
- Text tab for sending snippets to Firestore via `onSnapshot`.
- Calculator tab that POSTs two numbers + an operator to a tiny Express API (ready for Heroku) and renders the remote result.

The UI leans on a neon dark palette, reusable cards/buttons, and microcopy so each requirement feels cohesive.

---

## 1. Prerequisites

1. **React Native toolchain** (Android Studio + SDK 34, Xcode 15, Cocoapods).
2. **Node 18+** (repo currently uses 18.19.0).
3. **Java 17** for Gradle and **Ruby/Cocoapods** for iOS pods.
4. **Firebase project** with Authentication + Firestore enabled.

Install dependencies:

```bash
npm install
(cd ios && pod install)  # or `npx pod-install`
```

---

## 2. Firebase setup

1. Enable **Email/Password** auth in Firebase. Create a Cloud Firestore database (production mode).
2. Download config files:
   - `google-services.json` → place at `android/app/google-services.json`.
   - `GoogleService-Info.plist` → place at `ios/GoogleService-Info.plist`.
3. Android Gradle + manifest are already configured for Firebase/PNT; iOS AppDelegate configures Firebase and notification delegates.
4. (Optional) Firestore rules sample:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /userPhotos/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /userTexts/{document=**} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

Photo data lives at `userPhotos/{uid}` with a Base64 string; text snippets live inside `userTexts` with `{ userId, text, createdAt }` docs.

---

## 3. Calculator API (full-stack component)

A tiny Express service ships in `calculator-api/`.

```bash
cd calculator-api
npm install   # first time
npm run dev   # starts http://localhost:4000
```

`POST /calculate` body:

```json
{ "a": 3, "b": 7, "operator": "multiply" }
```

Response:

```json
{ "result": 21, "a": 3, "b": 7, "operator": "multiply" }
```

### Deploying to Heroku

1. `heroku create <your-app-name>`
2. `heroku git:remote -a <your-app-name>`
3. `git subtree push --prefix calculator-api heroku main`
4. Update `app.config.json` with your live URL:

```json
{
  "calculatorApiUrl": "https://<your-app-name>.herokuapp.com"
}
```

During development the mobile app still falls back to `http://10.0.2.2:4000` (Android emulator) or `http://localhost:4000` (iOS simulator) if the config is unchanged.

---

## 4. Running the app

```bash
# Metro bundler
npm start

# Android debug build (emulator/device)
npm run android

# iOS simulator
npm run ios

# ESLint
npm run lint
```

### Notification permission tips
- Android 13+: the app requests `POST_NOTIFICATIONS` automatically when needed.
- iOS: AppDelegate wires `UNUserNotificationCenter` so local notifications work; enable the Push Notifications capability if you later add remote pushes.

### Camera / photo permissions
- Android manifest already includes `CAMERA`, `READ_MEDIA_IMAGES`, and legacy storage fallbacks.
- iOS usage descriptions are in `ios/FunStackApp/Info.plist`.

---

## 5. Building a release APK

```bash
cd android
./gradlew assembleRelease
```

Artifact: `android/app/build/outputs/apk/release/app-release.apk`

Upload that APK to Google Drive for submission. Install locally with `adb install -r app-release.apk`.

For iOS, open `ios/FunStackApp.xcworkspace` in Xcode and Archive as usual.

---

## 6. Project structure

```
FunStackApp/
├── App.tsx                         # Root providers + navigation
├── index.js                        # Gesture handler + push notification bootstrap
├── app.config.json                 # Calculator API base URL
├── calculator-api/                 # Express backend (Heroku ready)
├── src/
│   ├── navigation/AppNavigator.tsx
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── AuthScreen.tsx
│   │   ├── NotificationScreen.tsx
│   │   ├── PhotoScreen.tsx
│   │   ├── TextScreen.tsx
│   │   └── CalculatorScreen.tsx
│   ├── components/ (PrimaryButton, TextField, SurfaceCard)
│   ├── hooks/useAuthBootstrap.ts
│   ├── services/ (firestore, notifications, calculatorApi)
│   ├── theme/ (colors, typography)
│   ├── utils/validation.ts
│   └── types/navigation.ts
└── README.md
```

---

## 7. Troubleshooting

- **Pods fail:** ensure Xcode is installed, run `sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`, then `pod install`.
- **Firebase config missing:** Metro/Gradle builds will fail if the Google Service files aren’t present. Add them before running native builds.
- **Android emulator hitting local API:** use `http://10.0.2.2:4000`. iOS simulator can use `http://localhost:4000` (ATS exception included).
- **Permission prompts:** grant notifications/camera/photos on first use; go to Settings if you need to re-enable later.

Happy hacking!
