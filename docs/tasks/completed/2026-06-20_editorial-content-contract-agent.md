# Editorial content contract and agent

## Objective

Convert the recurring editorial workflow failures into a durable contract and local agent playbook so future posts and landings are generated end-to-end with coherent copy, Quicksand-style visuals, dashboard availability and SEO/GEO/AIO metadata.

## Context

Recent roadmap iterations exposed repeated operational failures:

- new content not appearing in the dashboard;
- landings/services overlapping with Blog;
- unclear publication counts;
- images generated but not assigned;
- missing or weak image alt text and slugs;
- visual claims exceeding evidence;
- inconsistent image typography/style.

## Affected systems

- Documentation contracts
- ADR index
- Editorial dashboard sync policy
- Editorial visual generation policy
- Future content generation workflow

## Implementation plan

1. Extend ADR-004 with explicit dashboard failure prevention.
2. Extend ADR-005 with copy, claim, Quicksand and end-to-end assignment rules.
3. Add ADR-006 as the cross-system editorial content generation contract.
4. Add `docs/contracts/editorial-content-generation-contract.md`.
5. Add `docs/agents/biocultor-editorial-content-agent.md`.
6. Update `docs/decisions.md` so the active ADR set is discoverable.
7. Validate documentation references and git diff.

## Decisions

- Keep the agent as repository documentation, not an external autonomous process, because the immediate problem is workflow consistency and reviewer memory.
- Treat dashboard absence as a blocking failure for future content batches.
- Treat generated images as incomplete until they are assigned, alt-tagged and visible in dashboard.

## Risks

- Documentation alone cannot enforce behavior if future work ignores it.
- A later automated lint/check script may be useful if content volume continues growing.

## Validation checklist

- [x] ADR-004 includes concrete recurrent failures.
- [x] ADR-005 includes Quicksand, claim and assignment rules.
- [x] ADR-006 exists and links the full workflow.
- [x] Contract exists under `docs/contracts`.
- [x] Agent exists under `docs/agents`.
- [x] `docs/decisions.md` lists ADR-003 through ADR-006.
- [x] Git diff reviewed; no runtime behavior or schema changed.

## Completion notes

Completed on 2026-06-20. This task added the editorial content generation contract, local editorial content agent and ADR updates that make dashboard availability, image assignment, alt text, Quicksand styling and cautious claims mandatory for future content batches.

## Rollback considerations

Rollback is removing the added docs and reverting ADR/documentation updates. No runtime behavior or schema is changed.
