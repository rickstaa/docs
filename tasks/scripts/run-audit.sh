#!/bin/bash
# @script run-audit
# @summary Utility script for tasks/scripts/run-audit.sh.
# @owner docs
# @scope tasks/scripts
#
# @usage
#   bash tasks/scripts/run-audit.sh
#
# @inputs
#   No required CLI flags; optional flags are documented inline.
#
# @outputs
#   - Console output and/or file updates based on script purpose.
#
# @exit-codes
#   0 = success
#   1 = runtime or validation failure
#
# @examples
#   bash tasks/scripts/run-audit.sh
#
# @notes
#   Keep script behavior deterministic and update script indexes after changes.
cd "$(dirname "$0")/../../.." || exit 1
echo "Running audit from: $(pwd)"
echo "Script exists: $([ -f tasks/PLAN/scripts/audit-all-pages-simple.js ] && echo 'YES' || echo 'NO')"
node tasks/PLAN/scripts/audit-all-pages-simple.js
echo "Exit code: $?"
ls -lh tasks/PLAN/reports/*simple* 2>/dev/null | tail -3 || echo "No simple audit files created"
