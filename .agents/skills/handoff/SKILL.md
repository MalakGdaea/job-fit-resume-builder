---
name: handoff
description: Transfer agent context from one session to another with no return path. Use when the user asks to create a handoff, continue work in a fresh session, preserve decisions before clearing context, prepare an AFK run, split work across sessions, or summarize current state for another agent.
---

# Handoff

Create a self-contained context transfer for a future agent or session. Assume the receiving agent starts with zero conversation history and cannot ask the previous session for clarification.

## When Creating A Handoff

Write a handoff artifact when the current session has important context that must survive a session switch, context clear, compaction, long-running implementation pass, or parallel agent handoff.

Prefer a file artifact when the handoff may be reused, reviewed, corrected, or read by multiple sessions. A chat summary is acceptable only for short, immediate continuation where no durable artifact is needed.

## Handoff Artifact Contents

Include only information the next agent needs to continue correctly:

- Current objective and success criteria
- Relevant repo, branch, environment, and command context
- Decisions already made and the reasons behind them
- Files changed or inspected, with paths and important details
- Current implementation state, including completed and pending work
- Known blockers, risks, assumptions, and open questions
- Commands already run and their outcomes, especially failed checks
- Next recommended steps in execution order

Do not include irrelevant transcript history, speculation, or generic project explanation that the next agent can rediscover cheaply.

## Writing Standard

Make the handoff stand on its own. Record why decisions were made, not only what was decided. The main failure mode is relitigation: the next agent reopens settled choices because the reasoning was missing.

Use concrete paths, exact command names, and current status. If the state is uncertain, say what is uncertain and how to verify it.

## Suggested Format

```md
# Handoff: <task name>

## Objective
<What the next session should accomplish.>

## Current State
<What has been done, what exists now, and where things stand.>

## Decisions
- <Decision>: <reason>

## Files And Context
- `<path>`: <why it matters>

## Verification
- `<command>`: <result>

## Risks Or Blockers
- <risk/blocker and what to do about it>

## Next Steps
1. <first concrete step>
2. <second concrete step>
3. <third concrete step>
```

## After Writing

Tell the user where the handoff artifact was written, what it covers, and any known gaps. If no file was requested or created, provide the handoff directly in the final response.
