#!/usr/bin/env bash
# @script mint-dev
# @summary Utility script for tools/scripts/mint-dev.sh.
# @owner docs
# @scope tools/scripts
#
# @usage
#   bash tools/scripts/mint-dev.sh
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
#   bash tools/scripts/mint-dev.sh
#
# @notes
#   Keep script behavior deterministic and update script indexes after changes.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

HOOK_SOURCE=".githooks/pre-commit"
HOOK_TARGET=".git/hooks/pre-commit"

if [ -f "$HOOK_SOURCE" ]; then
    if [ ! -x "$HOOK_TARGET" ] || ! cmp -s "$HOOK_SOURCE" "$HOOK_TARGET"; then
        echo "Installing git hooks..."
        ./.githooks/install.sh
        echo ""
    fi
else
    echo "Warning: $HOOK_SOURCE not found. Skipping hook installation."
fi

if ! command -v mint >/dev/null 2>&1; then
    echo "Error: mint CLI not found."
    echo "Install it with: npm i -g mintlify"
    exit 1
fi

exec mint dev "$@"
