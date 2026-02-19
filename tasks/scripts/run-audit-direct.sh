#!/bin/bash
# @script run-audit-direct
# @summary Utility script for tasks/scripts/run-audit-direct.sh.
# @owner docs
# @scope tasks/scripts
#
# @usage
#   bash tasks/scripts/run-audit-direct.sh
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
#   bash tasks/scripts/run-audit-direct.sh
#
# @notes
#   Keep script behavior deterministic and update script indexes after changes.
set -e
cd "$(dirname "$0")/../../.."
echo "=== AUDIT START ===" > tasks/PLAN/reports/audit-run.log
echo "Working directory: $(pwd)" >> tasks/PLAN/reports/audit-run.log
echo "Python version: $(python3 --version 2>&1)" >> tasks/PLAN/reports/audit-run.log
echo "Node version: $(node --version 2>&1)" >> tasks/PLAN/reports/audit-run.log
echo "Running Python audit..." >> tasks/PLAN/reports/audit-run.log
python3 tasks/PLAN/scripts/audit-python.py >> tasks/PLAN/reports/audit-run.log 2>&1
echo "Exit code: $?" >> tasks/PLAN/reports/audit-run.log
echo "=== AUDIT END ===" >> tasks/PLAN/reports/audit-run.log
ls -lh tasks/PLAN/reports/*python* 2>&1 >> tasks/PLAN/reports/audit-run.log
