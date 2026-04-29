/**
 * Generates:
 * - app-icon-1024.png — iOS / universal app icon (white background, logo centered)
 * - adaptive-icon-foreground.png — Android adaptive foreground (transparent around logo, for backgroundColor to show)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "assets/images/ATـLogo.png");
const OUT_SIZE = 1024;
/** Logo max dimension as fraction of canvas (safe zone for adaptive icons ~66%, we use ~58%) */
const LOGO_SCALE = 0.58;

async function main() {
  if (!fs.existsSync(src)) {
    console.error("Missing source:", src);
    process.exit(1);
  }

  const maxLogo = Math.round(OUT_SIZE * LOGO_SCALE);
  const resized = await sharp(src)
    .resize({
      width: maxLogo,
      height: maxLogo,
      fit: "inside",
    })
    .ensureAlpha()
    .toBuffer();

  const whiteBg = {
    r: 255,
    g: 255,
    b: 255,
    alpha: 1,
  };

  const flatIcon = await sharp({
    create: {
      width: OUT_SIZE,
      height: OUT_SIZE,
      channels: 4,
      background: whiteBg,
    },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toBuffer();

  const foregroundIcon = await sharp({
    create: {
      width: OUT_SIZE,
      height: OUT_SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toBuffer();

  const outFlat = path.join(root, "assets/images/app-icon-1024.png");
  const outAdaptive = path.join(
    root,
    "assets/images/adaptive-icon-foreground.png",
  );

  await sharp(flatIcon).toFile(outFlat);
  await sharp(foregroundIcon).toFile(outAdaptive);

  console.log("Wrote:", outFlat);
  console.log("Wrote:", outAdaptive);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
