#!/bin/sh
# Sequential release-preflight browser suites against the exact candidate build.
# Runs the unchanged V1/V1.1 harness copies; results go to the scratchpad, exits to EXITS.
S=<scratchpad>
H=$S/harness
EXITS=/d/Claude-projects/sp-release-v1/audit/portfolio-release-v1/logs/exit-codes.txt
export QA_BASE=http://127.0.0.1:4471 QA_ROOT=$S/qa
cd /d/Claude-projects/sp-release-v1
run() { name=$1; shift; echo "### $name start $(date -Is)"; "$@" > "$S/qa-$name.log" 2>&1; rc=$?; echo "$name exit=$rc" >> "$EXITS"; echo "### $name exit=$rc $(date -Is)"; tail -2 "$S/qa-$name.log"; }
for step in ${STEPS:-matrix-webkit interactions smoke-chromium smoke-webkit transitions-chromium transitions-webkit states-chromium states-webkit supplemental touch late-bundle}; do
  case $step in
    matrix-webkit) run $step node $H/matrix.mjs after webkit ;;
    interactions) run $step node $H/interactions.mjs after chromium ;;
    smoke-chromium) run $step node $H/browser-smoke.mjs chromium ;;
    smoke-webkit) run $step node $H/browser-smoke.mjs webkit ;;
    transitions-chromium) run $step node $H/v1.1/transitions.mjs after chromium ;;
    transitions-webkit) run $step node $H/v1.1/transitions.mjs after webkit ;;
    states-chromium) run $step node $H/v1.1/states.mjs chromium ;;
    states-webkit) run $step node $H/v1.1/states.mjs webkit ;;
    supplemental) run $step node $H/supplemental.mjs ;;
    touch) run $step node $H/touch.mjs ;;
    late-bundle) run $step node $H/late-bundle.mjs after ;;
    lifecycle) run $step node $H/lifecycle.mjs ;;
    performance) run $step node $H/performance.mjs ;;
  esac
done
echo "### ALL DONE $(date -Is)"
