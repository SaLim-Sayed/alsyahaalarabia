#!/usr/bin/env bash
# Create a NEW upload keystore (only if Play Console allows upload key reset).
# If the app already exists on Play, you must use the ORIGINAL keystore (SHA1 0D:80:B5:33:...).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEYSTORE="$ROOT/android/app/upload.keystore"

mkdir -p "$(dirname "$KEYSTORE")"

keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore "$KEYSTORE" \
  -alias upload \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

echo ""
echo "Keystore: $KEYSTORE"
echo "Copy keystore.properties.example → android/keystore.properties and set passwords."
keytool -list -v -keystore "$KEYSTORE" -alias upload
