#!/usr/bin/env bash
# Build an iOS IPA/Archive locally (no EAS).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IOS_DIR="$ROOT/ios"
SCHEME="mjlhalsyahhalarbyh"
WORKSPACE="$IOS_DIR/$SCHEME.xcworkspace"
ARCHIVE_PATH="$IOS_DIR/build/$SCHEME.xcarchive"
EXPORT_PATH="$IOS_DIR/build/Export"

cd "$ROOT"

if [[ ! -d "$IOS_DIR" ]]; then
  echo "Missing ios/. Run: npx expo prebuild --platform ios"
  exit 1
fi

echo "→ Running Type Checks..."
npx tsc --noEmit

echo "→ Cleaning build directory..."
xcodebuild clean \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Release

echo "→ Archiving project..."
# -allowProvisioningUpdates lets Xcode fetch or generate signing certificates
# if the developer account is signed in Xcode.
xcodebuild archive \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Release \
  -archivePath "$ARCHIVE_PATH" \
  -allowProvisioningUpdates

echo ""
echo "Archive completed successfully at:"
echo "  $ARCHIVE_PATH"
echo ""
echo "To export this archive as an IPA for distribution:"
echo "1. Open Xcode."
echo "2. Go to Window -> Organizer."
echo "3. Select the archive and click 'Distribute App'."
echo "4. Follow the prompts to upload to TestFlight or export as an IPA."
echo ""
echo "Alternatively, you can export from the CLI using:"
echo "  xcodebuild -exportArchive -archivePath \"$ARCHIVE_PATH\" -exportPath \"$EXPORT_PATH\" -exportOptionsPlist path/to/ExportOptions.plist"
