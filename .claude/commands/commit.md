Create a new commit for all of our uncommitted changes during our current session. Only commit what we have worked on as there could be other files others have worked on.
run git status && git diff HEAD && git status --porcelain to see what files are uncommitted
add the untracked and changed files

Add an atomic commit message with an appropriate message

add a tag such as "feat", "fix", "docs", etc. that reflects our work

## Post-Commit: Update Tracker

After committing, check if the work completed in this session affects any features tracked in `TRACKER.md`:

1. Read `TRACKER.md`
2. If any tracked features were implemented or progressed in this session:
   - Update their status (⬜ → 🟡 or 🟡 → ✅ Done)
   - Add the commit hash as evidence
   - Update the "Current Sprint" section if priorities shifted
   - Update the "Last updated" date
3. Stage and include the TRACKER.md changes in the same commit (amend) or as a follow-up commit
4. If no tracked features were affected, skip this step
