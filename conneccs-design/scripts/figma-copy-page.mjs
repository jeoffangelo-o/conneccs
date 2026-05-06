/**
 * Copies dist-figma-mcp/<page>.min.html to the Windows clipboard (UTF-8).
 * Use in Figma: html.to.design → Import HTML → paste (Ctrl+V).
 *
 * Usage: node scripts/figma-copy-page.mjs <page>
 * Pages: index, register, dashboard, reports, ipcr, workload, documents, faculty, announcements, messages
 */
import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const page = process.argv[2];
if (!page) {
  console.error(
    "Usage: node scripts/figma-copy-page.mjs <page>\n" +
      "Pages: index, register, dashboard, reports, ipcr, workload, documents, faculty, announcements, messages"
  );
  process.exit(1);
}

const src = path.join(__dirname, "..", "dist-figma-mcp", `${page}.min.html`);
if (!fs.existsSync(src)) {
  console.error("File not found:", src, "\nRun: node scripts/inline-for-figma.mjs && node scripts/minify-for-mcp.mjs");
  process.exit(1);
}

const html = fs.readFileSync(src, "utf8");
const tmp = path.join(os.tmpdir(), `conneccs-figma-${page}-${Date.now()}.html`);
fs.writeFileSync(tmp, html, "utf8");

try {
  execFileSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      `Get-Content -LiteralPath '${tmp.replace(/'/g, "''")}' -Raw -Encoding UTF8 | Set-Clipboard`,
    ],
    { stdio: "inherit" }
  );
} finally {
  try {
    fs.unlinkSync(tmp);
  } catch {
    /* ignore */
  }
}

console.log(`Copied ${page} (${Buffer.byteLength(html, "utf8")} bytes) to clipboard. Paste in html.to.design.`);
