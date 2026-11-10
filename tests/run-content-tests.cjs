// Executes unit tests for the pure logic in src/lib and the content data.
// Usage (from the project root, needs Node 18+ and esbuild):
//   npx --yes esbuild@0.24.0 tests/content-entry.ts --bundle --platform=node --format=cjs --outfile=tests/.bundle.cjs
//   node tests/run-content-tests.cjs
const path = require("path");
const m = require(path.join(__dirname, ".bundle.cjs"));
let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); pass++; console.log("PASS", name); } catch (e) { fail++; console.log("FAIL", name, "-", e.message); } };
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg}: expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };
const P = m.projects;

t("five README projects present", () => eq(P.length, 5, "count"));
t("slugs unique and URL-safe", () => {
  const s = P.map(p => p.slug); eq(new Set(s).size, s.length, "dup");
  s.forEach(x => { if (!/^[a-z0-9-]+$/.test(x)) throw new Error("bad slug " + x); });
});
t("every project has required fields", () => P.forEach(p => {
  for (const k of ["title","category","summary","description","status"]) if (!p[k]) throw new Error(p.slug + " missing " + k);
  if (!Array.isArray(p.tags) || p.tags.length === 0) throw new Error(p.slug + " no tags");
}));
t("no placeholder URLs in project links", () => P.forEach(p => Object.values(p.links).forEach(u => { if (m.isPlaceholder(u)) throw new Error(p.slug); })));
t("only README demo URLs are present", () => {
  const demos = P.filter(p => p.links.demo).map(p => p.links.demo).sort();
  eq(demos, ["https://logicmagician.github.io/RoutineNest/", "https://logicmagician.github.io/mcq-studio/"], "demos");
});
t("RoutineNest summary matches README", () => { if (!/offline/i.test(P.find(p=>p.slug==="routinenest").summary)) throw new Error("no offline"); });
t("featured projects are the three homepage items", () => eq(m.getFeaturedProjects(P).map(p=>p.slug).sort(), ["dc-to-ac-inverter","mcq-studio","routinenest"], "featured"));
t("categories start with All and keep order", () => eq(m.getProjectCategories(P), ["All","Software","Hardware & Embedded Systems"], "cats"));
t("empty query and All returns everything", () => eq(m.filterProjects(P,{query:"",category:"All"}).length, 5, "all"));
t("category filter", () => eq(m.filterProjects(P,{query:"",category:"Software"}).map(p=>p.slug), ["routinenest","mcq-studio"], "software"));
t("search is case-insensitive over tags", () => eq(m.filterProjects(P,{query:"  JAVASCRIPT ",category:"All"}).map(p=>p.slug), ["routinenest","mcq-studio"], "tag search"));
t("search and category combine", () => eq(m.filterProjects(P,{query:"relay",category:"Software"}), [], "combined empty"));
t("search finds hardware by title", () => eq(m.filterProjects(P,{query:"inverter",category:"All"}).map(p=>p.slug), ["dc-to-ac-inverter"], "inverter"));
t("no-match query returns empty", () => eq(m.filterProjects(P,{query:"zzzz-none",category:"All"}), [], "none"));
t("getProjectBySlug hit and miss", () => { if (!m.getProjectBySlug(P,"mcq-studio")) throw new Error("miss hit"); if (m.getProjectBySlug(P,"nope")) throw new Error("false hit"); });
t("related excludes self and stays in category", () => eq(m.getRelatedProjects(P, P.find(p=>p.slug==="routinenest")).map(p=>p.slug), ["mcq-studio"], "related"));
t("normalizePath strips trailing slash", () => { eq(m.normalizePath("/projects/"), "/projects", "p"); eq(m.normalizePath(""), "/", "empty"); eq(m.normalizePath("/"), "/", "root"); });
t("anchor on homepage stays a hash", () => eq(m.resolveNavHref("#about","/"), "#about", "home"));
t("anchor on subpage becomes /#section", () => eq(m.resolveNavHref("#about","/projects/"), "/#about", "sub"));
t("route href unchanged everywhere", () => eq(m.resolveNavHref("/skills","/journey/"), "/skills", "route"));
t("route active for parent of detail page", () => { if (!m.isRouteActive("/projects","/projects/routinenest/")) throw new Error("not active"); });
t("route not active for prefix-sharing sibling", () => { if (m.isRouteActive("/projects","/projectsX/")) throw new Error("false active"); });
t("anchor never reports route-active", () => { if (m.isRouteActive("#about","/")) throw new Error("x"); });
t("withBasePath with no base path", () => eq(m.withBasePath("/resume.pdf"), "/resume.pdf", "bp"));
t("journey: BSc is current and graduation is June 2028", () => {
  const b = m.journey.find(e=>e.id==="bsc-computer-engineering"); const g = m.journey.find(e=>e.id==="expected-graduation");
  if (!/third year/i.test(b.period)) throw new Error("bsc period " + b.period);
  eq(g.period, "June 2028", "grad"); if (!g.upcoming) throw new Error("not upcoming");
});
t("journey: every entry has a period label", () => m.journey.forEach(e => { if (!e.period) throw new Error(e.id+" empty period"); }));
t("profile: university and graduation as provided", () => {
  eq(m.profile.university, "American International University of Bangladesh", "uni");
  eq(m.profile.expectedGraduation, "June 2028", "grad");
});
t("skills: six README groups, no proficiency fields", () => {
  eq(m.skills.length, 6, "groups");
  m.skills.forEach(g => { if (Object.keys(g).some(k => /level|rating|percent|proficien/i.test(k))) throw new Error("rating field in " + g.title); });
});
t("skills contain no template-only entries", () => {
  const all = m.skills.flatMap(g=>g.items).join("|");
  ["ESP32","Solar PV","Machine Learning","I²C"].forEach(x => { if (all.includes(x)) throw new Error("template skill left: " + x); });
});
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
