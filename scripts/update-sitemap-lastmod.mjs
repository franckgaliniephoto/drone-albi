import fs from "node:fs";
import { execFileSync } from "node:child_process";

const [before, after] = process.argv.slice(2);
if (!before || !after) {
  throw new Error("Usage: node update-sitemap-lastmod.mjs <before> <after>");
}

const sitemapPath = "sitemap.xml";
let sitemap = fs.readFileSync(sitemapPath, "utf8");
const today = new Date().toISOString().slice(0, 10);
const zeroSha = /^0+$/.test(before);

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function canonicalFrom(content, file) {
  const match = content.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || content.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  if (!match) throw new Error(`Canonical manquant dans ${file}`);
  return match[1];
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const changedOutput = zeroSha
  ? git(["ls-tree", "-r", "--name-only", after])
  : git(["diff", "--name-status", before, after, "--", "*.html", "**/*.html"]);

const changes = zeroSha
  ? changedOutput.split("\n").filter(file => file.endsWith(".html")).map(file => ["A", file])
  : changedOutput.split("\n").filter(Boolean).map(line => line.split("\t"));

for (const [status, file] of changes) {
  if (status === "D") {
    const previous = git(["show", `${before}:${file}`]);
    const loc = canonicalFrom(previous, file);
    const block = new RegExp(`\\s*<url>\\s*<loc>${escapeRegex(loc)}</loc>[\\s\\S]*?</url>`, "m");
    sitemap = sitemap.replace(block, "");
    continue;
  }

  if (!fs.existsSync(file)) continue;
  const loc = canonicalFrom(fs.readFileSync(file, "utf8"), file);
  const locPattern = escapeRegex(loc);
  const existing = new RegExp(`(<url>\\s*<loc>${locPattern}</loc>[\\s\\S]*?<lastmod>)\\d{4}-\\d{2}-\\d{2}(</lastmod>)`, "m");

  if (existing.test(sitemap)) {
    sitemap = sitemap.replace(existing, `$1${today}$2`);
  } else {
    const entry = `\n  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>\n`;
    sitemap = sitemap.replace(/\s*<\/urlset>\s*$/, `${entry}</urlset>\n`);
  }
}

fs.writeFileSync(sitemapPath, sitemap);

