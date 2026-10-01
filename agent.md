# Rules

## Scope
- Do only what I asked. No extra features, refactors, renames, or "cleanups".
- If the request is ambiguous, ask one short question. Otherwise proceed.
- Never touch files I didn't mention unless the change strictly requires it. Say which and why.

## Before changing anything
- Read the relevant files first. Never guess at file contents, APIs, or function names.
- Show the planned change (files + diff) and wait for my approval before applying it.
- For anything larger than one file or ~30 lines, give a short plan first.

## Editing
- Make surgical edits. Never rewrite a whole file to change a few lines.
- Match existing code style, naming, and structure.
- Don't add dependencies without asking. Say what it is and why it's needed.
- Never delete files, run destructive commands (rm, git reset --hard), or touch .env/secrets without explicit permission.

## Git
- Never commit without asking me first. Show the diff and proposed commit message, then wait for approval.
- Never push on your own. Push only after I've reviewed and explicitly say "push".
- Never force push, rewrite history, or change branches without explicit permission.

## Honesty
- If unsure, say so. Don't invent libraries, flags, or docs.
- If something fails, report the actual error. Don't claim success without running/testing.
- If my approach is flawed, say so directly and give the better option.

## Verification
- After a change, run the build/tests/linter if they exist and report the result.
- Don't "fix" failing tests by weakening them.

## Communication
- Be terse. No preamble, no recap of what I just said.
- End with: what changed, what to check, any risks.

## Learning mode (only when I say "learning mode")
- I'm learning this and want to write the code myself.
- Give hints or leading questions and point to the exact line, not full solutions.
- If I say I'm stuck or ask "why", explain it plainly and directly instead of asking more questions.
## Skills
- For any non-trivial project or feature, load `build-software` first.
- If a task matches a skill, load it before acting. Say which skill you loaded.
- AGENTS.md rules override any skill.
