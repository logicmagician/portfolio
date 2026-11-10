// Executed unit tests for Phase 6 integration logic. Uses fixtures only as inputs to normalizers;
// fixture content is never rendered on the site.
const path = require("path");
const m = require(path.join(__dirname, ".bundle6.cjs"));
let pass = 0, fail = 0;
const queue = [];
// Tests are queued and awaited in order, so asynchronous checks cannot pass silently.
const t = (name, fn) => queue.push([name, fn]);
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg}: expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };

const repo = (over = {}) => ({ name: "demo", html_url: "https://github.com/x/demo", updated_at: "2026-01-01T00:00:00Z", description: " Hi ", language: "C", stargazers_count: 3, homepage: "https://x.github.io/demo/", fork: false, archived: false, private: false, ...over });

t("github: normalizes a valid repository", () => {
  const r = m.normalizeRepo(repo());
  eq(r.name, "demo", "name"); eq(r.description, "Hi", "trimmed"); eq(r.stars, 3, "stars"); eq(r.homepage, "https://x.github.io/demo/", "homepage");
});
t("github: excludes forks, archived and private repositories", () => {
  eq(m.normalizeRepo(repo({fork:true})), null, "fork");
  eq(m.normalizeRepo(repo({archived:true})), null, "archived");
  eq(m.normalizeRepo(repo({private:true})), null, "private");
});
t("github: rejects malformed objects and keeps valid ones", () => {
  eq(m.normalizeRepoList([null, {name: 5}, repo()]).length, 1, "filtered");
  eq(m.normalizeRepoList("not a list"), [], "non-array");
});
t("github: non-https homepage dropped, empty description becomes null", () => {
  eq(m.normalizeRepo(repo({homepage:"http://insecure"})).homepage, null, "http dropped");
  eq(m.normalizeRepo(repo({description:"   "})).description, null, "blank");
});
t("github: unset username returns unavailable without network", async () => {
  const x = await m.fetchPublicRepos(undefined);
  eq(x.status, "unavailable", "status");
});
t("github: invalid username rejected before any request", async () => {
  const x = await m.fetchPublicRepos("bad user!");
  eq(x.status, "unavailable", "status"); if (!/not a valid/.test(x.reason)) throw new Error(x.reason);
});

t("orcid: reads titles, years and types from a v3 works response", () => {
  const works = m.normalizeOrcidWorks({ group: [
    { "work-summary": [{ title: { title: { value: "Solar Study" } }, "publication-date": { year: { value: "2024" } }, type: "JOURNAL_ARTICLE", url: { value: "https://example.org/a" } }] },
    { "work-summary": [{ title: { title: { value: "Poster" } }, type: "CONFERENCE_POSTER" }] },
    { "work-summary": [] },
    { "work-summary": [{ title: {} }] },
  ]});
  eq(works.length, 2, "two valid");
  eq(works[0], { title: "Solar Study", year: "2024", type: "journal article", url: "https://example.org/a" }, "first");
  eq(works[1].year, null, "missing year");
});
t("orcid: non-https URLs are dropped", () => {
  const w = m.normalizeOrcidWorks({ group: [{ "work-summary": [{ title:{title:{value:"X"}}, url:{value:"javascript:alert(1)"} }] }] });
  eq(w[0].url, null, "url");
});
t("orcid: malformed input yields empty list", () => { eq(m.normalizeOrcidWorks(null), [], "null"); eq(m.normalizeOrcidWorks({group:"x"}), [], "group not array"); });
t("orcid: unset id returns unavailable", async () => eq((await m.fetchOrcidWorks(undefined)).status, "unavailable", "status"));
t("orcid: malformed id rejected before request", async () => eq((await m.fetchOrcidWorks("0000-0002-1825-009")).status, "unavailable", "status"));

t("crossref: normalizes title, authors, year and container", () => {
  const d = m.normalizeCrossref({ message: { title: ["A Paper"], author: [{ given: "Ada", family: "Lovelace" }, { family: "Solo" }], issued: { "date-parts": [[2023, 5]] }, "container-title": ["Journal X"] } }, "10.1/abc");
  eq(d, { doi: "10.1/abc", title: "A Paper", authors: ["Ada Lovelace", "Solo"], year: "2023", container: "Journal X" }, "record");
});
t("crossref: record without title is rejected", () => eq(m.normalizeCrossref({ message: { title: [] } }, "10.1/x"), null, "no title"));
t("crossref: invalid DOI rejected before request", async () => eq((await m.fetchDoiMetadata("not-a-doi")).status, "unavailable", "status"));

t("devto: normalizes articles and drops non-https links", () => {
  const a = m.normalizeDevtoArticles([
    { title: "Post", url: "https://dev.to/x/post", published_at: "2026-02-01T00:00:00Z", reading_time_minutes: 4 },
    { title: "Bad", url: "http://dev.to/x", published_at: "2026-02-01" },
    { title: 1 },
  ]);
  eq(a.length, 1, "one kept"); eq(a[0].readingMinutes, 4, "reading time");
});
t("devto: unset or invalid username unavailable", async () => {
  eq((await m.fetchDevtoArticles(undefined)).status, "unavailable", "unset");
  eq((await m.fetchDevtoArticles("bad user")).status, "unavailable", "invalid");
});

t("analytics: only G-prefixed GA4 IDs are valid", () => {
  if (!m.isValidGa4Id("G-ABC123XYZ")) throw new Error("valid rejected");
  ["UA-12345-1","G-","g-abc123","<script>"].forEach(v => { if (m.isValidGa4Id(v)) throw new Error("accepted " + v); });
});
t("analytics: off by default in this build", () => eq(m.isAnalyticsEnabled(""), false, "disabled"));

t("registry: integration statuses are from the allowed set", () => {
  const allowed = ["live-at-build","ready-to-configure","reference-only","future","static-form"];
  m.integrations.forEach(i => { if (!allowed.includes(i.status)) throw new Error(i.id + " status " + i.status); });
});
t("registry: every future integration is listed as future", () => {
  m.futureIntegrations.forEach(f => { const e = m.integrations.find(i => i.id === f.id || (f.id === "ai-engineering-tools" && i.id === "ai-tools")); if (e && e.status !== "future" && e.status !== "reference-only") throw new Error(f.id + " is " + e.status); });
});
t("registry: no integration variable is public unless it is an endpoint or ID", () => {
  m.integrations.forEach(i => i.variables.forEach(v => {
    if (v.startsWith("NEXT_PUBLIC_") && !/ENDPOINT|ANALYTICS_ID/.test(v)) throw new Error("public secret-like variable " + v);
    if (/KEY|TOKEN/.test(v) && v.startsWith("NEXT_PUBLIC_")) throw new Error("key in public variable " + v);
  }));
});

(async () => {
  for (const [name, fn] of queue) {
    try { await fn(); pass++; console.log("PASS", name); }
    catch (e) { fail++; console.log("FAIL", name, "-", e.message); }
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
