"use client";

import { useId, useState } from "react";
import { getCalculator } from "@/lib/lab/calculators";

/**
 * Generic calculator UI. Fields, validation and formulas live in src/lib/lab/calculators.ts;
 * this component only renders the inputs and the result.
 */
export function CalculatorPanel({ slug }: { slug: string }) {
  const spec = getCalculator(slug);
  const [values, setValues] = useState<Record<string, string>>({});
  const baseId = useId();

  if (!spec) return null;

  const anyEntered = Object.values(values).some((v) => v && v.trim() !== "");
  const result = anyEntered ? spec.compute(values) : null;

  return (
    <div className="calc-panel">
      <form className="calc-form" onSubmit={(event) => event.preventDefault()} noValidate>
        {spec.fields.map((field) => {
          const inputId = `${baseId}-${field.key}`;
          const hintId = `${inputId}-hint`;
          return (
            <div className="calc-field" key={field.key}>
              <label htmlFor={inputId}>
                {field.label}
                {field.unit && <span className="calc-unit"> ({field.unit})</span>}
              </label>
              {field.hint && <p className="calc-hint" id={hintId}>{field.hint}</p>}
              <input
                id={inputId}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder={field.placeholder}
                value={values[field.key] ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                aria-describedby={field.hint ? hintId : undefined}
                aria-invalid={result && !result.ok ? true : undefined}
              />
            </div>
          );
        })}
        <button type="button" className="button button-ghost" onClick={() => setValues({})}>Clear</button>
      </form>

      <div className="calc-results" role="status" aria-live="polite">
        {!result && <p className="calc-idle">Enter values above to see the result.</p>}
        {result && !result.ok && <p className="calc-error" role="alert">{result.error}</p>}
        {result && result.ok && (
          <>
            <dl>
              {result.rows.map((row) => (
                <div className="result-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            {result.notes.map((note) => <p className="calc-note" key={note}>{note}</p>)}
          </>
        )}
      </div>
    </div>
  );
}
