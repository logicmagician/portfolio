// Executed unit tests for Phase 5 logic: calculators, input parsing, contact validation, registry.
const path = require("path");
const m = require(path.join(__dirname, ".bundle5.cjs"));
let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); pass++; console.log("PASS", name); } catch (e) { fail++; console.log("FAIL", name, "-", e.message); } };
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg}: expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };
const close = (a, b, msg, tol = 1e-6) => { if (Math.abs(a - b) > tol * Math.max(1, Math.abs(b))) throw new Error(`${msg}: expected ${b} got ${a}`); };
const calc = (slug, values) => m.getCalculator(slug).compute(values);
const val = (slug, values, label) => { const r = calc(slug, values); if (!r.ok) throw new Error(label + ": " + r.error); return r.rows; };
const row = (rows, label) => { const r = rows.find(x => x.label.startsWith(label)); if (!r) throw new Error("no row " + label); return r.value; };
const numOf = (s) => Number(String(s).split(" ")[0]);

// --- parsing ---
t("parseNumber: empty is null, text is NaN", () => { eq(m.parseNumber(""), null, "empty"); eq(m.parseNumber("   "), null, "blank"); if (!Number.isNaN(m.parseNumber("12abc"))) throw new Error("text accepted"); });
t("parseNumber: accepts decimals, signs and exponents", () => { eq(m.parseNumber("0.5"), 0.5, "dec"); eq(m.parseNumber("-3"), -3, "neg"); eq(m.parseNumber("2e3"), 2000, "exp"); eq(m.parseNumber(".25"), 0.25, "leading dot"); });
t("parsePositive: rejects zero, negative and text", () => {
  if (m.parsePositive("0","X").ok) throw new Error("zero"); if (m.parsePositive("-1","X").ok) throw new Error("neg"); if (m.parsePositive("abc","X").ok) throw new Error("text");
  eq(m.parsePositive("", "X"), { ok:false, error:"X is required." }, "required");
});
t("parseNonNegative: allows zero, rejects negative", () => { if (!m.parseNonNegative("0","X").ok) throw new Error("zero"); if (m.parseNonNegative("-0.1","X").ok) throw new Error("neg"); });
t("parsePositiveList: splits on commas and spaces", () => eq(m.parsePositiveList("100, 220 330", "R").values, [100,220,330], "list"));
t("parsePositiveList: rejects empty and bad entries", () => { if (m.parsePositiveList("", "R").ok) throw new Error("empty"); if (m.parsePositiveList("10, x", "R").ok) throw new Error("bad"); });
t("formatNumber: four significant figures, exponent for extremes", () => {
  eq(m.formatNumber(1.234567), "1.235", "round"); eq(m.formatNumber(2), "2", "int"); eq(m.formatNumber(0.00001234).includes("e"), true, "small exp"); eq(m.formatNumber(Infinity), "—", "inf");
});

// --- Ohm's law ---
t("ohm: V and I give R and P", () => { const r = val("ohm-law", {V:"12", I:"2"}, "vi"); close(numOf(row(r,"Resistance")), 6, "R"); close(numOf(row(r,"Power")), 24, "P"); });
t("ohm: V and R give I and P", () => { const r = val("ohm-law", {V:"12", R:"6"}, "vr"); close(numOf(row(r,"Current")), 2, "I"); close(numOf(row(r,"Power")), 24, "P"); });
t("ohm: I and R give V and P", () => { const r = val("ohm-law", {I:"2", R:"6"}, "ir"); close(numOf(row(r,"Voltage")), 12, "V"); close(numOf(row(r,"Power")), 24, "P"); });
t("ohm: P and V give I and R", () => { const r = val("ohm-law", {P:"24", V:"12"}, "pv"); close(numOf(row(r,"Current")), 2, "I"); close(numOf(row(r,"Resistance")), 6, "R"); });
t("ohm: P and I give V and R", () => { const r = val("ohm-law", {P:"24", I:"2"}, "pi"); close(numOf(row(r,"Voltage")), 12, "V"); close(numOf(row(r,"Resistance")), 6, "R"); });
t("ohm: P and R give V and I", () => { const r = val("ohm-law", {P:"24", R:"6"}, "pr"); close(numOf(row(r,"Voltage")), 12, "V"); close(numOf(row(r,"Current")), 2, "I"); });
t("ohm: exactly two inputs required", () => { if (calc("ohm-law",{V:"12"}).ok) throw new Error("one accepted"); if (calc("ohm-law",{V:"1",I:"2",R:"3"}).ok) throw new Error("three accepted"); });
t("ohm: zero resistance is rejected", () => { if (calc("ohm-law",{V:"12",R:"0"}).ok) throw new Error("zero R accepted"); });

// --- resistor combinations ---
t("series sum", () => { close(numOf(row(val("resistor-combination",{resistors:"100, 220, 330"}),"Series")), 650, "series"); });
t("parallel of two equal values is half", () => { close(numOf(row(val("resistor-combination",{resistors:"100 100"}),"Parallel")), 50, "parallel"); });
t("parallel of one resistor equals itself", () => { close(numOf(row(val("resistor-combination",{resistors:"470"}),"Parallel")), 470, "single"); });
t("parallel 3 values matches reciprocal sum", () => { close(numOf(row(val("resistor-combination",{resistors:"10 20 30"}),"Parallel")), 1/(1/10+1/20+1/30), "parallel3", 1e-3); });
t("resistor list: invalid entry rejected", () => { if (calc("resistor-combination",{resistors:"10 abc"}).ok) throw new Error("accepted"); });

// --- voltage divider ---
t("divider: 9 V across 10k and 4.7k", () => { const r = val("voltage-divider",{Vin:"9",R1:"10000",R2:"4700"},"div"); close(numOf(row(r,"Output")), 9*4700/14700, "vout", 1e-3); });
t("divider: equal resistors give half", () => { close(numOf(row(val("voltage-divider",{Vin:"10",R1:"1000",R2:"1000"}),"Output")), 5, "half"); });
t("divider: missing field reports the field", () => { const r = calc("voltage-divider",{Vin:"9",R1:"10000"}); if (r.ok || !/Lower resistor/.test(r.error)) throw new Error(JSON.stringify(r)); });

// --- LED resistor ---
t("LED: 5 V, 2 V, 20 mA gives 150 ohm", () => { const r = val("led-resistor",{Vs:"5",Vf:"2",If:"0.02"},"led"); close(numOf(row(r,"Series")), 150, "R"); close(numOf(row(r,"Resistor power")), 0.06, "P"); });
t("LED: supply must exceed forward voltage", () => { const r = calc("led-resistor",{Vs:"2",Vf:"2",If:"0.02"}); if (r.ok || !/greater than/.test(r.error)) throw new Error("not rejected"); });
t("LED: zero forward voltage allowed", () => { if (!calc("led-resistor",{Vs:"5",Vf:"0",If:"0.01"}).ok) throw new Error("rejected"); });

// --- solar PV ---
t("PV: 3 kWp, 4.5 h, PR 0.75 gives 10.125 kWh/day", () => { const r = val("solar-pv-energy",{kwp:"3",psh:"4.5",pr:"0.75"},"pv"); close(numOf(row(r,"Estimated daily")), 10.125, "daily", 1e-3); close(numOf(row(r,"Estimated 30-day")), 303.75, "monthly", 1e-3); });
t("PV: unrealistic sun hours rejected", () => { if (calc("solar-pv-energy",{kwp:"3",psh:"14",pr:"0.75"}).ok) throw new Error("accepted"); });
t("PV: performance ratio above 1 rejected", () => { if (calc("solar-pv-energy",{kwp:"3",psh:"4",pr:"1.2"}).ok) throw new Error("accepted"); });
t("calculators: every calculator rejects empty input", () => m.calculatorSpecs.forEach(s => { const r = calc(s.slug, {}); if (r.ok) throw new Error(s.slug + " ok with empty input"); }));

// --- registry consistency ---
t("registry: every available tool has a calculator", () => m.labTools.filter(t=>t.status==="available").forEach(t => { if (!m.getCalculator(t.slug)) throw new Error("no calc for " + t.slug); }));
t("registry: every calculator is listed in the registry", () => m.calculatorSpecs.forEach(s => { const tool = m.labTools.find(t=>t.slug===s.slug); if (!tool || tool.status !== "available") throw new Error("unlisted " + s.slug); }));
t("registry: planned tools have no calculator and no fake results", () => m.labTools.filter(t=>t.status==="planned").forEach(t => { if (m.getCalculator(t.slug)) throw new Error("planned tool has code: " + t.slug); }));
t("registry: slugs unique and every category used is declared", () => {
  const slugs = m.labTools.map(t=>t.slug); eq(new Set(slugs).size, slugs.length, "dup");
  m.labTools.forEach(t => { if (!m.labCategories.includes(t.category)) throw new Error("undeclared category " + t.category); });
});
t("registry: available tools document assumptions and limitations", () => m.labTools.filter(t=>t.status==="available").forEach(t => { if (!t.assumptions.length || !t.limitations.length) throw new Error(t.slug + " missing notes"); }));

// --- contact ---
const good = { name: "Ada", email: "ada@example.org", inquiry: "Software development", message: "I would like to discuss a web app." };
t("contact: valid input has no errors", () => eq(m.validateInquiry(good), {}, "valid"));
t("contact: each invalid field is reported", () => {
  const e = m.validateInquiry({ name: "A", email: "nope", inquiry: "Other", message: "short" });
  eq(Object.keys(e).sort(), ["email","inquiry","message","name"], "fields");
});
t("contact: long message rejected", () => { if (!m.validateInquiry({...good, message: "x".repeat(2001)}).message) throw new Error("accepted"); });
t("contact: honeypot detects automated submissions", () => { if (!m.isSpam({...good, website: "http://spam"})) throw new Error("missed"); if (m.isSpam(good)) throw new Error("false positive"); });
t("mailto: subject and body are encoded", () => eq(m.buildMailto("a@b.co","Hi there","x & y"), "mailto:a@b.co?subject=Hi%20there&body=x%20%26%20y", "encoded"));
t("contact endpoint: only https URLs count as configured", () => {
  if (!m.isContactFormConfigured("https://formspree.io/f/abc")) throw new Error("https rejected");
  if (m.isContactFormConfigured("http://x")) throw new Error("http accepted");
  if (m.isContactFormConfigured("")) throw new Error("empty accepted");
});
t("contact: no endpoint configured in this build", () => eq(m.contactFormEndpoint, "", "default empty"));

t("services: every service has summary, technologies and examples", () => m.services.forEach(s => { if (!s.summary || !s.technologies.length || !s.examples.length) throw new Error(s.id); }));
t("services: ids unique", () => { const ids = m.services.map(s=>s.id); eq(new Set(ids).size, ids.length, "dup"); });
t("services: no published price or certification wording", () => { const text = JSON.stringify(m.services).toLowerCase(); ["certified","$","price per","guaranteed"].forEach(w => { if (text.includes(w)) throw new Error("wording " + w); }); });

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
