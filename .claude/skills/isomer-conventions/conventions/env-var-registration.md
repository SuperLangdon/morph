---
title: Register a new env var in .env.example, .env.test (and turbo.json if read by a task)
category: Configuration
type: best-practice
---

## Pattern

Adding a new environment variable is never a one-file change. Beyond declaring
it in the `env.mjs` schema + `runtimeEnv` (where it's validated and consumed),
propagate it to:

1. **`apps/studio/.env.example`** — the documented template every dev copies to
   `.env`. A var missing here is invisible to the next person setting up.
2. **`apps/studio/.env.test`** — so the test runner can load it. Because
   `env.mjs` validates the whole schema at import, a `z.string().min(1)` var
   that's absent from `.env.test` makes the env import throw and takes the test
   suite down with it.
3. **Root `turbo.json` `globalEnv`** — *if the var is read during any
   Turbo-run task* (build, typecheck, lint, test). Turbo hashes its cache on the
   declared env; an undeclared var is neither passed through to tasks nor keyed
   into the cache, so stale builds silently ignore it. In practice any app var
   validated by `env.mjs` is read during these tasks, so it usually belongs here.

## Why

These targets are easy to forget because the code compiles and runs locally
without them — the failure shows up elsewhere: a teammate's broken setup
(`.env.example`), a red CI test suite that fails at import (`.env.test`), or a
Turbo cache that serves output computed without the var (`turbo.json`). Keeping
all touchpoints in lockstep is the only way the var behaves the same in every
environment.

## Bad

```jsonc
// turbo.json — new var consumed in app code + env.mjs, but not declared here
"globalEnv": [
  "DATABASE_URL",
  "SESSION_SECRET"
  // SMTP_PASS used at runtime/build but missing → not passed to tasks,
  // not part of the cache key
]
```
…and `.env.example` / `.env.test` left untouched, so setup docs and CI drift.

## Good

```jsonc
// turbo.json
"globalEnv": [
  "DATABASE_URL",
  "SESSION_SECRET",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS"
]
```
plus the same three keys added to `apps/studio/.env.example` and
`apps/studio/.env.test`, and to the `env.mjs` schema + `runtimeEnv`. See the
`SMTP_*` rollout (`turbo.json` `globalEnv`) for a live precedent.

## How to detect

When a diff adds a key to `env.mjs` (schema or `runtimeEnv`), check the same key
exists in `apps/studio/.env.example`, `apps/studio/.env.test`, and — if it's
read by a build/test/lint/typecheck task — `turbo.json` `globalEnv`. Grep the
var name across all four:

```bash
grep -rn "SMTP_PASS" turbo.json apps/studio/.env.example apps/studio/.env.test apps/studio/src/env.mjs
```

A hit count below four (when the var is task-read) is the smell.
