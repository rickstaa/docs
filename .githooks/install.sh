#!/bin/bash
# @script install
# @summary Utility script for .githooks/install.sh.
# @owner docs
# @scope .githooks
#
# @usage
#   bash .githooks/install.sh
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
#   bash .githooks/install.sh
#
# @notes
#   Keep script behavior deterministic and update script indexes after changes.
# Install git hooks

HOOKS_DIR=".git/hooks"
SOURCE_DIR=".githooks"

if [ ! -d "$HOOKS_DIR" ]; then
    echo "Error: .git/hooks directory not found. Are you in the repository root?"
    exit 1
fi

if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: .githooks directory not found. Are you in the repository root?"
    exit 1
fi

echo "Installing git hooks..."

# Install pre-commit hook
if [ -f "$SOURCE_DIR/pre-commit" ]; then
    cp "$SOURCE_DIR/pre-commit" "$HOOKS_DIR/pre-commit"
    chmod +x "$HOOKS_DIR/pre-commit"
    echo "✓ Installed pre-commit hook"
else
    echo "✗ pre-commit hook not found in $SOURCE_DIR"
fi

echo ""
echo "Git hooks installed successfully!"
echo ""
echo "The pre-commit hook will now check for style guide violations."
echo "See .githooks/README.md for details."
