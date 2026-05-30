#!/usr/bin/env bash
# Build a Google Play–ready AAB locally (no EAS).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$ROOT/android"
KEYSTORE_PROPS="$ANDROID_DIR/keystore.properties"
# Upload cert registered in Play Console (App integrity → Upload key certificate)
EXPECTED_SHA1="${PLAY_UPLOAD_SHA1:-0D:80:B5:33:49:B7:86:3E:D0:50:3C:81:3C:0C:D3:92:C6:D7:FC:3B}"

cd "$ROOT"

if [[ ! -d "$ANDROID_DIR" ]]; then
  echo "Missing android/. Run: npx expo prebuild --platform android"
  exit 1
fi

if [[ ! -f "$KEYSTORE_PROPS" ]]; then
  echo "Missing android/keystore.properties"
  echo "  cp keystore.properties.example android/keystore.properties"
  echo "  Place your upload keystore at android/app/upload.keystore (or update storeFile)."
  exit 1
fi

echo "→ bundleRelease"
cd "$ANDROID_DIR"
./gradlew bundleRelease

AAB="$ANDROID_DIR/app/build/outputs/bundle/release/app-release.aab"
if [[ ! -f "$AAB" ]]; then
  echo "AAB not found at $AAB"
  exit 1
fi

echo ""
echo "→ Certificate on AAB"
ACTUAL_SHA1="$(keytool -printcert -jarfile "$AAB" 2>/dev/null | awk -F': ' '/SHA1:/ {print $2; exit}' | tr -d ' ')"
EXPECTED_NORM="$(echo "$EXPECTED_SHA1" | tr -d ' ' | tr '[:lower:]' '[:upper:]')"
ACTUAL_NORM="$(echo "$ACTUAL_SHA1" | tr -d ' ' | tr '[:lower:]' '[:upper:]')"

echo "  SHA1: $ACTUAL_SHA1"
echo ""
echo "Upload this file in Play Console:"
echo "  $AAB"

if [[ -n "$ACTUAL_SHA1" && "$ACTUAL_NORM" != "$EXPECTED_NORM" ]]; then
  echo ""
  echo "WARNING: SHA1 does not match Play upload key ($EXPECTED_SHA1)."
  echo "  Debug key is 5E:8F:16:06:... — do not upload that build."
  echo "  Use the keystore that matches Play, or request an upload key reset."
  exit 1
fi

echo ""
echo "SHA1 matches Play upload key."
