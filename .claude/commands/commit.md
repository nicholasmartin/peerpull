Create a new commit for all of our uncommitted changes during our current session. Only commit what we have worked on as there could be other files others have worked on.
run git status && git diff HEAD && git status --porcelain to see what files are uncommitted
add the untracked and changed files

Add an atomic commit message with an appropriate message

add a tag such as "feat", "fix", "docs", etc. that reflects our work
