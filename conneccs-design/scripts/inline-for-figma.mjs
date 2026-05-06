import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const cssPath = path.join(root, "css", "style.css");
const css = fs.readFileSync(cssPath, "utf8");

const htmlFiles = [
  "index.html",
  "register.html",
  "dashboard.html",
  "reports.html",
  "ipcr.html",
  "workload.html",
  "documents.html",
  "faculty.html",
  "announcements.html",
  "messages.html",
];

function inlineHtml(file) {
  const p = path.join(root, file);
  let html = fs.readFileSync(p, "utf8");
  html = html.replace(
    /<link rel="stylesheet" href="css\/style\.css" \/>/,
    `<style>${css}</style>`
  );
  html = html.replace(/<script src="js\/theme\.js"><\/script>\s*/g, "");
  return html;
}

const outDir = path.join(root, "dist-figma-inline");
fs.mkdirSync(outDir, { recursive: true });

for (const f of htmlFiles) {
  const inlined = inlineHtml(f);
  fs.writeFileSync(path.join(outDir, f), inlined, "utf8");
  console.log(f, Buffer.byteLength(inlined, "utf8"));
}
