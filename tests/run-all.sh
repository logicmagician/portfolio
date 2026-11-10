#!/usr/bin/env bash
# Runs every executed test suite and exits non-zero if any suite fails.
# Needs Node 18+. Uses the project's esbuild (devDependency) when installed,
# otherwise downloads esbuild with npx. Override with ESBUILD=/path/to/esbuild.
#   npm test          (same as: bash tests/run-all.sh)
set -u
cd "$(dirname "$0")/.."
if [ -n "${ESBUILD:-}" ]; then
  ESB="$ESBUILD"
elif [ -x node_modules/.bin/esbuild ]; then
  ESB="node_modules/.bin/esbuild"
else
  ESB="npx --yes esbuild@0.24.0"
fi
status=0

bundle() { $ESB "$1" --bundle --platform=node --format=cjs --outfile="$2" --log-level=error; }

# run <entry.ts> <bundle.cjs> <test.cjs>
run() {
  if ! bundle "tests/$1" "tests/$2"; then
    echo "  bundling failed for $1"; status=1; return
  fi
  local out code
  out=$(node "tests/$3" 2>&1); code=$?
  echo "$out" | tail -1
  [ "$code" -eq 0 ] || status=1
  rm -f "tests/$2"
}

echo "Phase 3 logic:";        run content-entry.ts .bundle.cjs run-content-tests.cjs
echo "Phase 4 logic:";        run phase4-entry.ts .bundle4.cjs phase4-tests.cjs
echo "Phase 4 files:";        run phase4-fs-entry.ts .bundle-fs.cjs phase4-fs-tests.cjs
echo "Phase 5 logic:";        run phase5-entry.ts .bundle5.cjs phase5-tests.cjs
echo "Phase 6 integrations:"; run phase6-entry.ts .bundle6.cjs phase6-tests.cjs

if [ "$status" -eq 0 ]; then echo "ALL SUITES PASSED"; else echo "ONE OR MORE SUITES FAILED"; fi
exit $status
