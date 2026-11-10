# Phase 5 Report — Engineering Lab, Services and Contact

## Scope

Phase 5 completes `/lab` (with five working calculators), `/services`, and `/contact`. Phase 6 covers integration modules, the full documentation set and the final independent audit.

## Engineering Lab

Five calculators are available. Each has its own page at `/lab/<slug>` with assumptions and limitations listed beside it:

| Tool | Inputs | Outputs |
|---|---|---|
| Ohm's law | Any two of V, I, R, P | The other two, plus all four values |
| Series and parallel resistance | A list of resistors | Series sum and parallel equivalent |
| Voltage divider | Vin, R1, R2 | Vout and divider current |
| LED current-limiting resistor | Supply, forward voltage, target current | Series resistance and resistor power |
| Solar PV energy estimate | Array size, peak sun hours, performance ratio | Daily and 30-day energy |

Four other tools are listed as **planned**: data visualization, machine-learning demonstration, algorithm demonstration and circuit simulation. They have no code or pages, and their cards are not links.

Calculations live in `src/lib/lab/calculators.ts` as pure functions over raw input text. Invalid input (empty, non-numeric, zero where not allowed, impossible values such as an LED supply below its forward voltage) returns a specific message. The UI shows that message rather than a result.

The lab says on every page that its tools are for learning and rough estimates, not design approval. The solar tool does not model shading, temperature, degradation or inverter sizing, and it says so.

## Services

Six areas of work, drawn from the owner's GitHub profile: software development, data analysis, technical documentation, circuit design and simulation support, embedded and automation prototypes, and engineering research collaboration. Each lists technologies from the README and example work. The page states that these are not fixed offers, certifications or published prices. Each service has an "Ask about this" email link with a subject line.

## Contact

Email and social links are shown. The contact form appears only when `NEXT_PUBLIC_FORMSPREE_ENDPOINT` holds an https address. Without it, visitors see a clearly labelled fallback with the email button.

When the form is configured, it validates name, email, inquiry type and message length before sending. It includes a honeypot field. It shows "sent" only when the service returns a success status, and it reports network failures plainly.

`.env.example` documents the variables. The endpoint is public by design, so it is a `NEXT_PUBLIC_` variable; no secret should ever go there.

## Verification

| Check | Method | Result |
|---|---|---|
| Syntax of all TypeScript, TSX and config files | esbuild parse | PASS |
| Imports resolve, named exports exist | Static script | PASS |
| Navigation and footer targets exist | Static script | PASS |
| Every class name used is defined in CSS | Static script | PASS |
| Calculator formulas (all six Ohm solutions, combinations, divider, LED, PV) and invalid-input handling | Executed, 45 tests (with earlier logic tests) | PASS |
| Registry: every available tool has a calculator; planned tools have no code; categories consistent | Executed | PASS |
| Contact validation, honeypot, mailto encoding, endpoint rules | Executed | PASS |
| Services contain no certification, price or guarantee wording | Executed | PASS |
| Test-name correction: one test was misnamed and has been renamed; test logic unchanged | — | FIXED |
| Services technology list: removed Google Scholar, which is a reference, not a technology | — | FIXED |
| Calculator UI rendering and interaction | — | NOT VERIFIED (no browser) |
| Contact form submission against a real endpoint | — | NOT VERIFIED (no endpoint configured; no network) |
| `npm run build`, static export of `/lab/[slug]` | — | NOT EXECUTED |
| Eight viewport layouts | — | NOT VERIFIED |

Executed totals across the project: 117 tests, all passing.

## Open items for the owner

1. Contact form: create a form at a service such as Formspree, then set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in the build environment. The form appears automatically. Until then, the email fallback is shown.
2. Confirm the six service areas and their wording. Remove any you do not want to offer.
3. Planned lab tools need your decision on priority. Each will need its own calculator and tests.
4. Solar and LED calculators use typical default assumptions. Confirm the wording is right for your coursework or projects.
