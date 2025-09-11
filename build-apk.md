# Build APK Instructions

## Using EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g @expo/eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure build:
```bash
eas build:configure
```

4. Build APK:
```bash
eas build --platform android --profile preview
```

## Using Expo CLI (Legacy)

1. Install Expo CLI:
```bash
npm install -g expo-cli
```

2. Build APK:
```bash
expo build:android -t apk
```

## Local Build with React Native CLI

1. Install Android Studio and set up Android SDK
2. Run:
```bash
npx expo run:android --variant release
```

The APK will be generated in `android/app/build/outputs/apk/release/`