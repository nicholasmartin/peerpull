---
description: "Review project progress and update TRACKER.md"
---

# Status: Project Progress Review

## Objective

Review recent work and update `TRACKER.md` to reflect current project state.

## Process

### 1. Read Current Tracker

Read `TRACKER.md` at project root. Understand what was previously marked as done, in progress, and not started.

### 2. Check Recent Activity

Run these commands to see what's changed:

```bash
git log --oneline -20
git status
```

Cross-reference commits against tracker entries. Identify:
- Features that were completed but not yet marked done
- Features marked "in progress" that may now be complete
- New work that isn't tracked yet

### 3. Verify Completion Claims

For any feature being moved to ✅ Done, verify the evidence:
- Check that the relevant code/migration actually exists
- Confirm it was merged to main (not on a stale branch)
- Note the commit hash

### 4. Update TRACKER.md

Apply changes:
- Move completed items to ✅ Done with commit evidence
- Update "Current Sprint" section with the next priorities
- Update the "Last updated" date at the top
- Add any new features or tech debt discovered during the session
- Remove or archive items that are no longer relevant

### 5. Report

Provide a concise summary:

**Completed since last update:**
- List items moved to Done

**Currently in progress:**
- List active work items

**Up next:**
- List the top 3 priorities from the Current Sprint

**New issues discovered:**
- Any tech debt, bugs, or blockers found

Keep the report scannable — bullet points, no prose.
