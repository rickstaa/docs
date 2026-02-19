#!/usr/bin/env python3
# @script replace-og-image
# @summary Utility script for tools/scripts/dev/replace-og-image.py.
# @owner docs
# @scope tools/scripts
#
# @usage
#   python3 tools/scripts/dev/replace-og-image.py
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
#   python3 tools/scripts/dev/replace-og-image.py
#
# @notes
#   Keep script behavior deterministic and update script indexes after changes.
import os
import sys

OLD_IMAGE = 'og:image: "/snippets/assets/domain/SHARED/LivepeerDocsLogo.svg"'
NEW_IMAGE = 'og:image: "/snippets/assets/domain/SHARED/LivepeerDocsHero.svg"'
EXCLUDE_FILES = ['mission-control.mdx']

changed = 0
skipped = 0

for root, dirs, files in os.walk('v2/pages'):
    for file in files:
        if file.endswith('.mdx'):
            filepath = os.path.join(root, file)
            
            # Skip excluded files
            if file in EXCLUDE_FILES:
                print(f"⊘ {filepath} - Excluded")
                skipped += 1
                continue
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if OLD_IMAGE in content:
                    new_content = content.replace(OLD_IMAGE, NEW_IMAGE)
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    print(f"✓ {filepath}")
                    changed += 1
                else:
                    skipped += 1
                    
            except Exception as e:
                print(f"✗ {filepath}: {e}")

print(f"\n========== SUMMARY ==========")
print(f"Changed: {changed}")
print(f"Skipped: {skipped}")
print(f"=============================")

