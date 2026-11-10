// Executed checks that read the real content directory. Run from the project root.
// Bundling: see tests/run-content-tests.cjs for the esbuild command; use tests/phase4-fs-entry.ts.
const fs = require("fs"), path = require("path");
const m = require(path.join(__dirname, ".bundle-fs.cjs"));
let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); pass++; console.log("PASS", name); } catch (e) { fail++; console.log("FAIL", name, "-", e.message); } };
const DIR = path.join(process.cwd(), "content", "blog");

t("sample article loads and validates", () => {
  const all = m.loadAllPosts();
  if (!all.some(p => p.slug === "building-this-portfolio")) throw new Error("sample missing");
});

t("unpublished draft is excluded from public posts", () => {
  const draft = path.join(DIR, "zz-test-draft.md");
  fs.writeFileSync(draft, '---\ntitle: "Draft"\ndescription: "Hidden"\ndate: "2026-12-01"\ncategory: "Test"\npublished: false\n---\nSecret body');
  try {
    const publicPosts = m.getPublishedPosts();
    if (publicPosts.some(p => p.slug === "zz-test-draft")) throw new Error("draft leaked");
    if (!m.loadAllPosts().some(p => p.slug === "zz-test-draft")) throw new Error("draft not loaded at all");
  } finally { fs.unlinkSync(draft); }
});

t("invalid article fails the build loudly", () => {
  const bad = path.join(DIR, "zz-test-bad.md");
  fs.writeFileSync(bad, '---\ntitle: "No date"\ndescription: "x"\ncategory: "Test"\npublished: true\n---\nbody');
  try {
    let threw = false;
    try { m.loadAllPosts(); } catch (e) { threw = /zz-test-bad\.md/.test(e.message) && /date/.test(e.message); }
    if (!threw) throw new Error("invalid file did not raise a named error");
  } finally { fs.unlinkSync(bad); }
});

t("published posts are sorted newest first", () => {
  const dates = m.getPublishedPosts().map(p => p.date);
  const sorted = [...dates].sort().reverse();
  if (JSON.stringify(dates) !== JSON.stringify(sorted)) throw new Error("not sorted");
});

t("public file check: existing and missing", () => {
  if (m.publicFileExists("/ASSETS_README.txt") !== true) throw new Error("should exist");
  if (m.publicFileExists("/resume.pdf") !== false) throw new Error("resume should be reported missing until added");
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
