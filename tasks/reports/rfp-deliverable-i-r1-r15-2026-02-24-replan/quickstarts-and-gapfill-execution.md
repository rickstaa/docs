# Quickstarts + v1→v2 Gap-Fill Execution Pack

As of: `2026-02-24`

## Scope Implemented

- Created dedicated quickstart pages for AI Jobs and Transcoding Jobs (review-ready; SME signoff pending).
- Updated quickstart hub pages and `docs.json` navigation to surface the new quickstarts.
- Generated a v1→v2 gap-fill move matrix (all personas + supplemental `v1/ai/**`) with GitHub-first validation fields and move-readiness flags.
- Added developers broken-pages repair findings (local static checks) and a path-repair execution backlog.
- Added a full-site cleanup/edit backlog focused on duplicate pages, placeholders, and ultra-thin pages.

## Source Precedence Applied (Locked)

1. GitHub repos and source code/docs (primary technical validation)
2. DeepWiki (corroboration only)
3. Repo-local v2 shipped pages + OpenAPI specs + API refs (implementation clues, cross-checked)
4. v1 docs (legacy discovery inputs only)
5. `v2/x-pages` excluded (not used)

## Deliverable A: Quickstart Content (Implemented)

### Files Created / Updated

- `/Users/alisonhaire/.codex/worktrees/39e5/livepeer-docs-v2 [docs-v2-branch]/v2/developers/quickstart/ai/ai-jobs.mdx`
- `/Users/alisonhaire/.codex/worktrees/39e5/livepeer-docs-v2 [docs-v2-branch]/v2/developers/quickstart/video/transcoding-jobs.mdx`
- `/Users/alisonhaire/.codex/worktrees/39e5/livepeer-docs-v2 [docs-v2-branch]/v2/developers/quickstart/ai/ai-pipelines.mdx`
- `/Users/alisonhaire/.codex/worktrees/39e5/livepeer-docs-v2 [docs-v2-branch]/v2/developers/quickstart/video/video-streaming.mdx`
- `/Users/alisonhaire/.codex/worktrees/39e5/livepeer-docs-v2 [docs-v2-branch]/docs.json`

### Quickstart Status

- **AI Jobs quickstart**: structurally complete; GitHub-validated AI gateway endpoint surface; blocked on stakeholder signoff for canonical pipeline flow and default `model_id`.
- **Transcoding Jobs quickstart**: structurally complete; GitHub-validated Studio `/transcode` + `/task/{id}` flow; blocked on Rick (TD) review for accuracy and user-facing defaults.

### GitHub Validation Notes (technical source of truth)

- Local `api/studio.yaml` SHA-256 matches `livepeer/docs` `main`: `1bceb1ef200754e981770e445fa210b4b6b998bab5d1d6b500d05c1af818b583`
- Local `api/gateway.openapi.yaml` SHA-256 matches `livepeer/docs` `main`: `8d3ed183ea9e992e47e9e8825c4be2fbc9ff2beff47286341a6e8073f5fe4281`
- `livepeer/ai-runner` `gateway.openapi.yaml` SHA-256 differs: `16e66550341d3107b831bc8aa5db7745810070ad3fc17d42e1da643ccaaac37b` (repo drift tracked; endpoint family overlap confirmed)

Canonical GitHub sources used:
- `https://github.com/livepeer/docs/blob/main/api/studio.yaml`
- `https://github.com/livepeer/docs/blob/main/api/gateway.openapi.yaml`
- `https://github.com/livepeer/ai-runner/blob/main/gateway.openapi.yaml`
- `https://github.com/livepeer/ai-runner/blob/main/README.md`

DeepWiki corroboration (not authoritative):
- `https://deepwiki.com/livepeer/ai-runner`
- `https://deepwiki.com/livepeer/docs`

### Required Signoff Items (Open)
- Stakeholder: AI Jobs canonical pipeline flow(s), default `model_id`, deprecated flow exclusions.
- Rick (TD): Transcoding quickstart flow, profile defaults, polling/completion guidance, realtime boundary.

## Deliverable B: v1→v2 Gap-Fill Move Matrix (Implemented)

Output CSV: `tasks/reports/rfp-deliverable-i-r1-r15-2026-02-24-replan/v1-to-v2-gap-fill-matrix.csv`

### Matrix Summary
- Total rows: `124` (`80` from reviewed persona inventory + `44` supplemental `v1/ai/**` pages)
- By persona: developers `72`, gateways `14`, orchestrators `26`, delegators `6`
- Priorities: HIGH `60`, MEDIUM `54`, LOW `10`
- Actions: move `29`, merge `84`, rewrite `0`, archive `2`, duplicate-remove `9`
- Validation status: validated `12`, needs_validation `98`, non-technical `14`
- Ready to move now: yes `6`, no `118`

### Top Gap-Fill Candidates (AI Jobs / AI coverage)

| v1 path | action | target | priority | validation |
|---|---|---|---|---|
| `v1/ai/api-reference/audio-to-text.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/audio-to-text.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/image-to-image.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/image-to-image.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/image-to-text.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/image-to-text.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/image-to-video.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/image-to-video.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/llm.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/llm.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/overview.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/ai.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/segment-anything-2.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/segment-anything-2.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/text-to-image.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/text-to-image.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/text-to-speech.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/text-to-speech.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/upscale.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/upscale.mdx` | `HIGH` | `validated` |
| `v1/ai/builders/get-started.mdx` | `merge` | `v2/developers/quickstart/ai/ai-jobs.mdx` | `HIGH` | `non-technical` |
| `v1/ai/pipelines/audio-to-text.mdx` | `merge` | `v2/developers/quickstart/ai/ai-jobs.mdx` | `HIGH` | `needs_validation` |

### Top Gap-Fill Candidates (Transcoding Jobs / Studio migration)

| v1 path | action | target | priority | validation |
|---|---|---|---|---|
| `v1/developers/guides/transcode-video-storj.mdx` | `merge` | `v2/developers/guides/partner-integrations.mdx` | `HIGH` | `validated` |
| `v1/developers/guides/transcode-video-w3s.mdx` | `merge` | `v2/developers/guides/partner-integrations.mdx` | `HIGH` | `validated` |

### Top Gap-Fill Candidates (Migration guides)

| v1 path | action | target | priority | validation |
|---|---|---|---|---|
| `v1/delegators/guides/bridge-lpt-to-arbitrum.mdx` | `move` | `v2/lpt/delegation/delegation-guide.mdx` | `HIGH` | `needs_validation` |
| `v1/delegators/guides/migrate-stake-to-arbitrum.mdx` | `move` | `v2/lpt/delegation/delegation-guide.mdx` | `HIGH` | `needs_validation` |
| `v1/orchestrators/guides/connect-to-arbitrum.mdx` | `move` | `v2/pages/05_orchestrators/quickstart/overview (legacy IA target; confirm shipped path)` | `HIGH` | `needs_validation` |
| `v1/orchestrators/guides/migrate-from-contract-wallet.mdx` | `move` | `v2/pages/05_orchestrators/quickstart/overview (legacy IA target; confirm shipped path)` | `HIGH` | `needs_validation` |
| `v1/orchestrators/guides/migrate-to-arbitrum.mdx` | `move` | `v2/pages/05_orchestrators/quickstart/overview (legacy IA target; confirm shipped path)` | `HIGH` | `needs_validation` |

### Top Gap-Fill Candidates (API / SDK / CLI / snippets)

| v1 path | action | target | priority | validation |
|---|---|---|---|---|
| `v1/ai/api-reference/audio-to-text.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/audio-to-text.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/image-to-image.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/image-to-image.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/image-to-text.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/image-to-text.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/image-to-video.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/image-to-video.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/llm.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/llm.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/overview.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/ai.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/segment-anything-2.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/segment-anything-2.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/text-to-image.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/text-to-image.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/text-to-speech.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/text-to-speech.mdx` | `HIGH` | `validated` |
| `v1/ai/api-reference/upscale.mdx` | `merge` | `v2/gateways/references/api-reference/AI-API/upscale.mdx` | `HIGH` | `validated` |
| `v1/ai/sdks/go.mdx` | `merge` | `v2/developers/technical-references/sdks.mdx` | `HIGH` | `needs_validation` |
| `v1/ai/sdks/javascript.mdx` | `merge` | `v2/developers/technical-references/sdks.mdx` | `HIGH` | `needs_validation` |

## Deliverable C: Developers Broken Pages Repair (Path-Only)

### Local Static Findings (current repo checkout)
- `docs.json` developer routes found: `27`
- Missing developer routes (file not found): `0`
- Potential broken internal links in `v2/developers/**` (static scan): `0`

Interpretation: the reported breakage is likely in deployed routing/redirect behavior, canonical URLs, or external links after path restructuring, not obvious missing files in the local shipped developers tree.

### Path-Only Repair Backlog (guardrails)
1. Reproduce failures from deployed/preview URLs and capture exact paths.
2. Build legacy -> current path crosswalk for failing developers URLs.
3. Patch path/reference surfaces only (`docs.json`, MDX links, path maps, tests/scripts).
4. Keep content/layout edits out of this repair track.
5. Validate developers navigation and links after each fix batch.

### Path-Risk Signals
- Nested `README` routes in developers quickstart/realtime docs should be included in deployed route checks.
- `v2/developers/moved-to-about-livepeer-protocol/**` pages are cleanup/redirect risk hotspots.

## Deliverable D: Full Site Cleanup & Edit Backlog (Prioritized)

### Priority 1: Placeholder / `ComingSoonCallout` pages (shipped v2)
- Detected shipped pages with `ComingSoonCallout`: `38` files (x-pages excluded).
- High-impact cluster: Gateway AI API + CLI HTTP reference pages that have endpoint pages but still render placeholder callouts.

- `v2/developers/portal.mdx`
- `v2/gateways/guides-and-resources/community-guides.mdx`
- `v2/gateways/guides-and-resources/community-projects.mdx`
- `v2/gateways/references/api-reference/AI-API/audio-to-text.mdx`
- `v2/gateways/references/api-reference/AI-API/hardware-info.mdx`
- `v2/gateways/references/api-reference/AI-API/hardware-stats.mdx`
- `v2/gateways/references/api-reference/AI-API/health.mdx`
- `v2/gateways/references/api-reference/AI-API/image-to-image.mdx`
- `v2/gateways/references/api-reference/AI-API/image-to-text.mdx`
- `v2/gateways/references/api-reference/AI-API/image-to-video.mdx`
- `v2/gateways/references/api-reference/AI-API/live-video-to-video.mdx`
- `v2/gateways/references/api-reference/AI-API/llm.mdx`
- `v2/gateways/references/api-reference/AI-API/segment-anything-2.mdx`
- `v2/gateways/references/api-reference/AI-API/text-to-image.mdx`
- `v2/gateways/references/api-reference/AI-API/text-to-speech.mdx`
- `v2/gateways/references/api-reference/AI-API/upscale.mdx`
- `v2/gateways/references/api-reference/CLI-HTTP/activateorchestrator.mdx`
- `v2/gateways/references/api-reference/CLI-HTTP/bond.mdx`
- `v2/gateways/references/api-reference/CLI-HTTP/protocolparameters.mdx`
- `v2/gateways/references/api-reference/CLI-HTTP/rebond.mdx`
- ... plus `18` more

### Priority 2: Ultra-thin / zero-byte shipped pages
- Shipped `.mdx` files under 220 bytes (x-pages excluded): `42`
- These should be triaged as remove / merge / content-complete candidates.

- `v2/community/resources/awesome-livepeer.mdx` (0 bytes)
- `v2/community/resources/guides.mdx` (0 bytes)
- `v2/developers/developer-platforms/all-ecosystem/ecosystem-products.mdx` (0 bytes)
- `v2/gateways/run-a-gateway/gateway-operator-opportunities.mdx` (0 bytes)
- `v2/gateways/using-gateways/gateway-providers/cloud-spe-gateway.mdx` (0 bytes)
- `v2/gateways/using-gateways/gateway-providers/daydream-gateway.mdx` (0 bytes)
- `v2/gateways/using-gateways/gateway-providers/livepeer-studio-gateway.mdx` (0 bytes)
- `v2/platforms/ecosystem-products.mdx` (0 bytes)
- `v2/developers/ai-inference-on-livepeer/livepeer-ai/ai-101.mdx` (9 bytes)
- `v2/developers/livepeer-real-time-video/page-1.mdx` (9 bytes)
- `v2/gateways/guides-and-resources/page-2.mdx` (9 bytes)
- `v2/developers/developer-tools/gateways.mdx` (11 bytes)
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-actors/gateways.mdx` (11 bytes)
- `v2/developers/guides-and-resources/resources.mdx` (12 bytes)
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-actors/end-users.mdx` (12 bytes)
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-actors/delegators.mdx` (13 bytes)
- `v2/developers/ai-inference-on-livepeer/livepeer-ai/README.mdx` (14 bytes)
- `v2/developers/ai-inference-on-livepeer/livepeer-ai/realtime-ai.mdx` (14 bytes)
- `v2/developers/ai-inference-on-livepeer/livepeer-ai/ai-apis-move-to-tech-section/api-reference.mdx` (16 bytes)
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-actors/orchestrators.mdx` (16 bytes)
- ... plus `22` more

### Priority 3: Moved/duplicate page cleanup
- Shipped pages inside `moved-to-*` folders detected: `11`
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-actors/README.mdx`
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-actors/delegators.mdx`
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-actors/end-users.mdx`
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-actors/gateways.mdx`
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-actors/orchestrators.mdx`
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-governance.mdx`
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-protocol/README.mdx`
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-protocol/livepeer-whitepaper.mdx`
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-protocol/technical-overview.mdx`
- `v2/developers/moved-to-about-livepeer-protocol/livepeer-token-economics.mdx`
- `v2/developers/moved-to-about-livepeer-protocol/technical-roadmap.mdx`

### Cleanup Rules (Applied)
- Remove/deprecate duplicate or placeholder pages only with explicit target/redirect plan.
- Preserve safety/security/destructive-action warnings; remove decorative/redundant callouts first.
- Do not use `v2/x-pages` as justification for keeping/removing shipped pages.
- Keep cleanup changes separate from developers path-repair commits.

## Notes on `v2/x-pages`
- `v2/x-pages` was not used as source input, evidence, or drafting material in this implementation pass.
- Gaps without GitHub/official-backed coverage remain blocked pending stakeholder/Rick review.

## Next Required Inputs
1. Stakeholder-approved AI Jobs default flow and model(s) for the published example.
2. Rick (TD) review on Transcoding Jobs quickstart accuracy and realtime boundary wording.
3. Concrete examples of deployed developers pages currently failing after URL restructure (for path-only repair execution).
