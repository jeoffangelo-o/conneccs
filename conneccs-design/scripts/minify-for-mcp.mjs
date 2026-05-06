import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "dist-figma-inline");
const outDir = path.join(root, "dist-figma-mcp");

function minify(s) {
  return s
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

fs.mkdirSync(outDir, { recursive: true });
const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".html"));

for (const f of files) {
  const raw = fs.readFileSync(path.join(srcDir, f), "utf8");
  const m = minify(raw);
  fs.writeFileSync(path.join(outDir, f.replace(".html", ".min.html")), m, "utf8");
  console.log(f, Buffer.byteLength(m, "utf8"));
}
