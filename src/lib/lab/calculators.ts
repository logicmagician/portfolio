import { formatNumber, parseNonNegative, parseNumber, parsePositive, parsePositiveList } from "@/lib/lab/parse";

/**
 * Engineering calculators. Each is a pure function over raw form text, so the logic can be tested
 * without the UI. Results are for learning and rough estimates. They are not design approvals.
 */

export type FieldSpec = {
  key: string;
  label: string;
  unit: string;
  hint?: string;
  kind: "number" | "list";
  placeholder?: string;
};

export type ResultRow = { label: string; value: string };

export type CalcResult =
  | { ok: true; rows: ResultRow[]; notes: string[] }
  | { ok: false; error: string };

export type CalculatorSpec = {
  slug: string;
  fields: FieldSpec[];
  compute: (values: Record<string, string>) => CalcResult;
};

const fail = (error: string): CalcResult => ({ ok: false, error });

// ---- Ohm's law: enter exactly two of V, I, R, P ----
export function solveOhm(known: { V?: number; I?: number; R?: number; P?: number }): { V: number; I: number; R: number; P: number } | null {
  const k = known;
  if (k.V !== undefined && k.I !== undefined) return { V: k.V, I: k.I, R: k.V / k.I, P: k.V * k.I };
  if (k.V !== undefined && k.R !== undefined) return { V: k.V, I: k.V / k.R, R: k.R, P: (k.V * k.V) / k.R };
  if (k.I !== undefined && k.R !== undefined) return { V: k.I * k.R, I: k.I, R: k.R, P: k.I * k.I * k.R };
  if (k.P !== undefined && k.V !== undefined) return { V: k.V, I: k.P / k.V, R: (k.V * k.V) / k.P, P: k.P };
  if (k.P !== undefined && k.I !== undefined) return { V: k.P / k.I, I: k.I, R: k.P / (k.I * k.I), P: k.P };
  if (k.P !== undefined && k.R !== undefined) return { V: Math.sqrt(k.P * k.R), I: Math.sqrt(k.P / k.R), R: k.R, P: k.P };
  return null;
}

const ohm: CalculatorSpec = {
  slug: "ohm-law",
  fields: [
    { key: "V", label: "Voltage (V)", unit: "V", kind: "number", placeholder: "e.g. 12" },
    { key: "I", label: "Current (I)", unit: "A", kind: "number", placeholder: "e.g. 0.5" },
    { key: "R", label: "Resistance (R)", unit: "Ω", kind: "number", placeholder: "e.g. 24" },
    { key: "P", label: "Power (P)", unit: "W", kind: "number", placeholder: "e.g. 6" },
  ],
  compute(values) {
    const entered: Record<string, number> = {};
    const names: Record<string, string> = { V: "Voltage", I: "Current", R: "Resistance", P: "Power" };
    for (const key of ["V", "I", "R", "P"]) {
      if (parseNumber(values[key]) === null) continue;
      const r = parsePositive(values[key], names[key]);
      if (!r.ok) return fail(r.error);
      entered[key] = r.value;
    }
    const count = Object.keys(entered).length;
    if (count !== 2) return fail(`Enter exactly two values. You entered ${count}.`);
    const s = solveOhm(entered as { V?: number; I?: number; R?: number; P?: number })!;
    return {
      ok: true,
      rows: [
        { label: "Voltage", value: `${formatNumber(s.V)} V` },
        { label: "Current", value: `${formatNumber(s.I)} A` },
        { label: "Resistance", value: `${formatNumber(s.R)} Ω` },
        { label: "Power", value: `${formatNumber(s.P)} W` },
      ],
      notes: ["Ohm's law: V = I × R, and P = V × I. Values assume ideal, steady DC conditions."],
    };
  },
};

const resistorCombination: CalculatorSpec = {
  slug: "resistor-combination",
  fields: [
    { key: "resistors", label: "Resistor values", unit: "Ω", kind: "list", hint: "Separate values with commas or spaces.", placeholder: "e.g. 100, 220, 330" },
  ],
  compute(values) {
    const list = parsePositiveList(values.resistors, "Resistor values");
    if (!list.ok) return fail(list.error);
    const series = list.values.reduce((a, b) => a + b, 0);
    const parallel = 1 / list.values.reduce((a, b) => a + 1 / b, 0);
    return {
      ok: true,
      rows: [
        { label: `Series (${list.values.length} resistors)`, value: `${formatNumber(series)} Ω` },
        { label: `Parallel (${list.values.length} resistors)`, value: `${formatNumber(parallel)} Ω` },
      ],
      notes: ["Series: R = R1 + R2 + …. Parallel: 1/R = 1/R1 + 1/R2 + …. Ideal resistors, no tolerance applied."],
    };
  },
};

const voltageDivider: CalculatorSpec = {
  slug: "voltage-divider",
  fields: [
    { key: "Vin", label: "Input voltage (Vin)", unit: "V", kind: "number", placeholder: "e.g. 9" },
    { key: "R1", label: "Upper resistor (R1)", unit: "Ω", kind: "number", placeholder: "e.g. 10000" },
    { key: "R2", label: "Lower resistor (R2)", unit: "Ω", kind: "number", placeholder: "e.g. 4700" },
  ],
  compute(values) {
    const vin = parsePositive(values.Vin, "Input voltage");
    const r1 = parsePositive(values.R1, "Upper resistor");
    const r2 = parsePositive(values.R2, "Lower resistor");
    for (const r of [vin, r1, r2]) if (!r.ok) return fail(r.error);
    const { value: v } = vin as { value: number };
    const a = (r1 as { value: number }).value;
    const b = (r2 as { value: number }).value;
    return {
      ok: true,
      rows: [
        { label: "Output voltage (Vout)", value: `${formatNumber((v * b) / (a + b))} V` },
        { label: "Divider current", value: `${formatNumber(v / (a + b))} A` },
      ],
      notes: ["Vout = Vin × R2 / (R1 + R2). The output assumes nothing is connected to the midpoint; a load changes the result."],
    };
  },
};

const ledResistor: CalculatorSpec = {
  slug: "led-resistor",
  fields: [
    { key: "Vs", label: "Supply voltage (Vs)", unit: "V", kind: "number", placeholder: "e.g. 5" },
    { key: "Vf", label: "LED forward voltage (Vf)", unit: "V", kind: "number", hint: "From the LED datasheet.", placeholder: "e.g. 2" },
    { key: "If", label: "Target LED current (If)", unit: "A", kind: "number", hint: "Enter in amps, e.g. 0.02 for 20 mA.", placeholder: "e.g. 0.02" },
  ],
  compute(values) {
    const vs = parsePositive(values.Vs, "Supply voltage");
    const vf = parseNonNegative(values.Vf, "LED forward voltage");
    const current = parsePositive(values.If, "Target LED current");
    for (const r of [vs, vf, current]) if (!r.ok) return fail(r.error);
    const sv = (vs as { value: number }).value;
    const fv = (vf as { value: number }).value;
    const i = (current as { value: number }).value;
    if (sv <= fv) return fail("Supply voltage must be greater than the LED forward voltage.");
    const r = (sv - fv) / i;
    return {
      ok: true,
      rows: [
        { label: "Series resistance", value: `${formatNumber(r)} Ω` },
        { label: "Resistor power", value: `${formatNumber((sv - fv) * i)} W` },
      ],
      notes: [
        "R = (Vs − Vf) / If. Choose the nearest standard value at or above the result, and a resistor rated above the power shown.",
      ],
    };
  },
};

const solarPv: CalculatorSpec = {
  slug: "solar-pv-energy",
  fields: [
    { key: "kwp", label: "Array size", unit: "kWp", kind: "number", hint: "Installed DC peak power.", placeholder: "e.g. 3" },
    { key: "psh", label: "Peak sun hours", unit: "h/day", kind: "number", hint: "Average daily peak sun hours for the site.", placeholder: "e.g. 4.5" },
    { key: "pr", label: "Performance ratio", unit: "", kind: "number", hint: "Losses factor between 0 and 1. A common planning value is around 0.75.", placeholder: "e.g. 0.75" },
  ],
  compute(values) {
    const kwp = parsePositive(values.kwp, "Array size");
    const psh = parsePositive(values.psh, "Peak sun hours");
    const pr = parsePositive(values.pr, "Performance ratio");
    for (const r of [kwp, psh, pr]) if (!r.ok) return fail(r.error);
    const size = (kwp as { value: number }).value;
    const sun = (psh as { value: number }).value;
    const ratio = (pr as { value: number }).value;
    if (sun > 12) return fail("Peak sun hours above 12 are not realistic for a daily average.");
    if (ratio > 1) return fail("Performance ratio must be 1 or less.");
    const daily = size * sun * ratio;
    return {
      ok: true,
      rows: [
        { label: "Estimated daily energy", value: `${formatNumber(daily)} kWh/day` },
        { label: "Estimated 30-day energy", value: `${formatNumber(daily * 30)} kWh` },
      ],
      notes: [
        "Energy = array size × peak sun hours × performance ratio. The 30-day figure assumes the same conditions every day.",
        "Not included: shading, temperature effects, dust, panel degradation, inverter sizing, or seasonal variation. Use a site survey for system design.",
      ],
    };
  },
};

export const calculatorSpecs: CalculatorSpec[] = [ohm, resistorCombination, voltageDivider, ledResistor, solarPv];

export function getCalculator(slug: string): CalculatorSpec | undefined {
  return calculatorSpecs.find((spec) => spec.slug === slug);
}
