# Lapiez Garhwa — Official Flutter Mobile App

Official Mobile Application for **Lapiez IT Hardware & Security Showroom**, Garhwa, Jharkhand.

## Features
- **Instant Live Storefront:** Full integration with Next.js catalog, categories, and real-time inventory.
- **Deep-linking & WhatsApp Direct:** Instant routing to WhatsApp with pre-filled product inquiries.
- **UPI QR Direct Intent:** Tap to pay directly in Google Pay, PhonePe, Paytm, or BHIM.
- **Offline Guard:** Beautiful fallback screen when internet connectivity drops.
- **Hardware Acceleration:** Native 60fps/120fps smooth scrolling with pull-to-refresh.
- **CBIC Rule 46 Invoices:** Direct download and view of 18% GST tax invoices.

## Build Instructions

### Prerequisites
- Flutter SDK (>= 3.0.0)
- Android Studio with Android SDK (API 34)

### 1. Install Dependencies
```bash
flutter pub get
```

### 2. Run Debug Mode
```bash
flutter run
```

### 3. Build Production Android APK
```bash
flutter build apk --release
```
The compiled APK will be located at:
`build/app/outputs/flutter-apk/app-release.apk`

### 4. Build Google Play Store Bundle (.aab)
```bash
flutter build appbundle --release
```
The compiled bundle will be located at:
`build/app/outputs/bundle/release/app-release.aab`
