#!/bin/bash
# @script batch-update-og-image
# @summary Utility script for tools/scripts/dev/batch-update-og-image.sh.
# @owner docs
# @scope tools/scripts
#
# @usage
#   bash tools/scripts/dev/batch-update-og-image.sh
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
#   bash tools/scripts/dev/batch-update-og-image.sh
#
# @notes
#   Keep script behavior deterministic and update script indexes after changes.

OLD_IMAGE='og:image: "/snippets/assets/domain/SHARED/LivepeerDocsLogo.svg"'
NEW_IMAGE='og:image: "/snippets/assets/domain/SHARED/LivepeerDocsHero.svg"'

echo "Finding files with old og:image..."
files=$(grep -rl "$OLD_IMAGE" v2/pages --include="*.mdx" | grep -v "mission-control.mdx")

count=0
for file in $files; do
    echo "Updating: $file"
    # Use perl for in-place replacement
    perl -pi -e "s|og:image: \"/snippets/assets/domain/SHARED/LivepeerDocsLogo.svg\"|og:image: \"/snippets/assets/domain/SHARED/LivepeerDocsHero.svg\"|g" "$file"
    ((count++))
done

echo ""
echo "========== SUMMARY =========="
echo "Updated: $count files"
echo "============================="

