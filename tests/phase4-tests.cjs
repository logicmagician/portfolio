// Executed unit tests for Phase 4 logic. See tests/run-content-tests.cjs for the bundling step.
const path = require("path");
const m = require(path.join(__dirname, ".bundle4.cjs"));
let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); pass++; console.log("PASS", name); } catch (e) { fail++; console.log("FAIL", name, "-", e.message); } };
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg}: expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };
const throws = (fn, includes) => { try { fn(); } catch (e) { if (!e.message.includes(includes)) throw new Error("wrong error: " + e.message); return; } throw new Error("did not throw"); };

const SAMPLE = `---
title: "Hello"
description: "Desc"
date: "2026-01-15"
category: "Engineering"
tags:
  - Alpha
  - Beta
published: true
---

# Heading

Intro with **bold** and *em* and \`code\` and [site](/projects/).

- one
- two

1. first
2. second

> quoted line

\`\`\`js
const x = "<script>";
\`\`\`

---
`;

t("frontmatter: strings, booleans and list parsed", () => {
  const { data, body } = m.parseFrontmatter(SAMPLE);
  eq(data.title, "Hello", "title"); eq(data.published, true, "published");
  eq(data.tags, ["Alpha","Beta"], "tags");
  if (!body.trimStart().startsWith("# Heading")) throw new Error("body start: " + body.slice(0,20));
});
t("frontmatter: inline list and quoted values", () => {
  const { data } = m.parseFrontmatter(`---\ntags: [One, "Two"]\nname: 'Single'\n---\nbody`);
  eq(data.tags, ["One","Two"], "inline"); eq(data.name, "Single", "single");
});
t("frontmatter: missing block returns whole source as body", () => {
  const { data, body } = m.parseFrontmatter("just text");
  eq(data, {}, "data"); eq(body, "just text", "body");
});
t("frontmatter: CRLF line endings handled", () => {
  const { data } = m.parseFrontmatter("---\r\ntitle: X\r\n---\r\nbody");
  eq(data.title, "X", "crlf");
});

t("blocks: headings, lists, quote, rule, code", () => {
  const { body } = m.parseFrontmatter(SAMPLE);
  const blocks = m.parseBlocks(body);
  eq(blocks.map(b => b.type), ["heading","paragraph","list","list","quote","code","rule"], "types");
  eq(blocks[0].level, 1, "h1");
  eq(blocks[2].ordered, false, "ul"); eq(blocks[3].ordered, true, "ol");
  eq(blocks[5].language, "js", "lang");
});
t("code blocks keep HTML as literal text (no parsing)", () => {
  const blocks = m.parseBlocks("```\n<script>alert(1)</script>\n```");
  eq(blocks[0].value, "<script>alert(1)</script>", "literal");
});
t("inline: code, strong, em and safe link", () => {
  const inl = m.parseInline("a `c` **b** *e* [x](/p/)");
  eq(inl.map(i=>i.type), ["text","code","text","strong","text","em","text","link"], "types");
  eq(inl[7], { type: "link", href: "/p/", label: "x" }, "link");
});
t("inline: javascript: links are refused and kept as text", () => {
  const inl = m.parseInline("[bad](javascript:alert(1))");
  if (inl.some(i => i.type === "link")) throw new Error("unsafe link produced");
  eq(inl.map(i => i.value).join(""), "[bad](javascript:alert(1))", "raw text preserved");
});
t("safe href rules", () => {
  ["https://a.com/x","http://a.com","mailto:a@b.co","/projects/","#about"].forEach(h => { if (!m.isSafeHref(h)) throw new Error("should allow " + h); });
  ["//evil.com","javascript:x","data:text/html,x","ftp://x","/with space"].forEach(h => { if (m.isSafeHref(h)) throw new Error("should refuse " + h); });
});
t("paragraph lines join with spaces", () => {
  const blocks = m.parseBlocks("line one\nline two\n\nnext");
  eq(blocks.length, 2, "two paragraphs");
  eq(blocks[0].inlines[0].value, "line one line two", "joined");
});
t("unclosed code fence consumes to end without error", () => {
  const blocks = m.parseBlocks("```\nabc");
  eq(blocks[0].type, "code", "code"); eq(blocks[0].value, "abc", "value");
});
t("countWords ignores code fences", () => {
  eq(m.countWords("one two ```x y z``` three"), 3, "words");
});

t("buildPost: valid published article", () => {
  const p = m.buildPost("hello-world.md", SAMPLE);
  eq(p.slug, "hello-world", "slug"); eq(p.published, true, "pub"); eq(p.tags, ["Alpha","Beta"], "tags");
  if (p.readingMinutes < 1) throw new Error("reading time");
});
t("buildPost: unpublished unless explicitly true", () => {
  const src = SAMPLE.replace("published: true", "published: false");
  eq(m.buildPost("a-b.md", src).published, false, "false");
  const none = SAMPLE.replace("published: true\n", "");
  eq(m.buildPost("a-b.md", none).published, false, "missing");
  eq(m.buildPost("a-b.md", SAMPLE.replace("published: true", 'published: "yes"')).published, false, "string yes");
});
t("buildPost: rejects bad file names", () => throws(() => m.buildPost("Bad Name.md", SAMPLE), "lowercase"));
t("buildPost: rejects bad dates", () => throws(() => m.buildPost("x.md", SAMPLE.replace('"2026-01-15"', '"15/01/2026"')), "YYYY-MM-DD"));
t("buildPost: rejects impossible dates", () => throws(() => m.buildPost("x.md", SAMPLE.replace('"2026-01-15"', '"2026-13-45"')), "YYYY-MM-DD"));
t("buildPost: rejects missing title", () => throws(() => m.buildPost("x.md", SAMPLE.replace('title: "Hello"\n', "")), '"title"'));
t("buildPost: rejects non-list tags", () => throws(() => m.buildPost("x.md", SAMPLE.replace(/tags:\n  - Alpha\n  - Beta/, 'tags: "solo"')), '"tags"'));
t("buildPost: missing tags default to empty list", () => eq(m.buildPost("x.md", SAMPLE.replace(/tags:\n  - Alpha\n  - Beta\n/, "")).tags, [], "tags"));

const posts = [
  { slug: "c", title: "C", description: "d", category: "Web", tags: ["x"], date: "2026-03-01" },
  { slug: "b", title: "B", description: "d", category: "Engineering", tags: ["y","x"], date: "2026-02-01" },
  { slug: "a", title: "A", description: "d", category: "Engineering", tags: ["z"], date: "2026-01-01" },
];
t("sort newest first", () => eq(m.sortByDateDesc(posts).map(p=>p.slug), ["c","b","a"], "order"));
t("category list keeps first-seen order", () => eq(m.getBlogCategories(posts), ["All","Web","Engineering"], "cats"));
t("search matches tags and is case-insensitive", () => eq(m.filterPosts(posts,{query:"Y",category:"All"}).map(p=>p.slug), ["b"], "tag"));
t("category and search combine", () => eq(m.filterPosts(posts,{query:"",category:"Engineering"}).map(p=>p.slug), ["b","a"], "cat"));
t("no match is empty", () => eq(m.filterPosts(posts,{query:"qqq",category:"All"}), [], "none"));
t("adjacent: newer and older around middle post", () => {
  const sorted = m.sortByDateDesc(posts);
  const adj = m.getAdjacentPosts(sorted, "b");
  eq(adj.newer.slug, "c", "newer"); eq(adj.older.slug, "a", "older");
});
t("adjacent: ends have no neighbour beyond the list", () => {
  const sorted = m.sortByDateDesc(posts);
  eq(m.getAdjacentPosts(sorted,"c").newer, undefined, "no newer");
  eq(m.getAdjacentPosts(sorted,"a").older, undefined, "no older");
  eq(m.getAdjacentPosts(sorted,"zzz"), {}, "unknown");
});
t("related: shared category and tags, self excluded", () => {
  // b is Engineering with tags y,x. a shares the category (score 2); c shares tag x (score 1).
  eq(m.getRelatedPosts(posts, posts[1]).map(p=>p.slug), ["a","c"], "related ranked by score");
});
t("related: never includes self and respects limit", () => {
  const many = Array.from({length:6},(_,i)=>({slug:"p"+i,category:"E",tags:[],date:"2026-0"+(i+1)+"-01"}));
  many[0].tags=["t"]; const cur = {slug:"cur",category:"E",tags:[],date:"2026-12-01"};
  const rel = m.getRelatedPosts([...many,cur], cur, 2);
  eq(rel.length, 2, "limit"); if (rel.some(p=>p.slug==="cur")) throw new Error("self");
});

t("research: DOI format accepted and rejected", () => {
  ["10.1000/xyz123","10.1109/ACCESS.2020.1234567"].forEach(d => { if (!m.isValidDoi(d)) throw new Error("reject " + d); });
  ["doi:10.1000/x","10.1/short","https://doi.org/10.1000/x","10.1000/"].forEach(d => { if (m.isValidDoi(d)) throw new Error("accept " + d); });
});
t("research: ORCID format accepted and rejected", () => {
  if (!m.isValidOrcid("0000-0002-1825-0097")) throw new Error("valid");
  if (!m.isValidOrcid("0000-0002-1694-233X")) throw new Error("X valid");
  if (m.isValidOrcid("0000-0002-1825-009")) throw new Error("short accepted");
});
t("research: https only", () => { if (!m.isHttpsUrl("https://x.org")) throw new Error("ok"); if (m.isHttpsUrl("http://x.org")) throw new Error("http"); });
t("research URLs built correctly", () => { eq(m.doiUrl("10.1/abc"), "https://doi.org/10.1/abc", "doi"); eq(m.orcidUrl("0000-0002-1825-0097"), "https://orcid.org/0000-0002-1825-0097", "orcid"); });

t("resources: data validates", () => eq(m.validateResources(m.resources), [], "problems"));
t("resources: validator catches missing link url and duplicate ids", () => {
  const problems = m.validateResources([
    { id:"a", title:"", description:"", category:"c", fileType:"LINK" },
    { id:"a", title:"", description:"", category:"c", fileType:"PDF" },
  ]);
  if (problems.length < 3) throw new Error("expected 3 problems, got " + problems.length);
});
t("resources: filter by category and search", () => {
  eq(m.filterResources(m.resources,{query:"",category:"CV & Resume"}).map(r=>r.id), ["cv"], "cat");
  eq(m.filterResources(m.resources,{query:"demo",category:"All"}).length, 2, "search");
});
t("resources: categories include every used category", () => {
  const cats = m.getResourceCategories(m.resources);
  m.resources.forEach(r => { if (!cats.includes(r.category)) throw new Error("missing " + r.category); });
});

t("date: ISO and publication formats", () => {
  eq(m.formatDate("2026-11-10"), "10 Nov 2026", "iso");
  eq(m.formatDate("2026-13-01"), "2026-13-01", "bad month kept");
  eq(m.formatPublicationDate("2025-03"), "Mar 2025", "month only");
  eq(m.formatPublicationDate("2025-03-07"), "7 Mar 2025", "full");
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
