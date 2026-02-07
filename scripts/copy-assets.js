const { copyFile, mkdir } = require("node:fs/promises");
const path = require("node:path");
const process = require("node:process");

const files = [
  "7ZviI998tvmnzabssH15S9Hc.png",
  "KYNn75YK8fG2lpgQh1ci1voGSWs.png",
  "YZMsuOgJQUkrcHAV7HunQZTIk.png",
  "0dyyM325eCiaagkU8KOSTqAxDQ.png",
];

const root = process.cwd();
const srcDir = path.join(root, ".sample");
const destDir = path.join(root, "public", "assets");

async function copyAssets() {
  await mkdir(destDir, { recursive: true });

  await Promise.all(
    files.map(async (file) => {
      const src = path.join(srcDir, file);
      const dest = path.join(destDir, file);
      try {
        await copyFile(src, dest);
      } catch (error) {
        console.warn(`[copy-assets] Skipped ${file}: ${error.message}`);
      }
    }),
  );
}

copyAssets();
