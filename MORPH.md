# Morph — fork notes

This document records how Morph differs from upstream Isomer, and how to keep
the diff small and mergeable. Read this before merging `upstream/main`.

## Design rule

Morph is a **de-governmentalized** distribution of Isomer, not a rewrite.
Business logic, the data model, the block editor, the publishing pipeline and
the API surface are kept identical to upstream wherever possible. Internal
identifiers are deliberately **not** renamed:

- package names and import paths (`@opengovsg/isomer-components`,
  `@isomer/*`, `isomer-studio`, `isomer-base-template`, …)
- TypeScript type names (`IsomerSchema`, `IsomerAdmin`, …)
- database table/column names
- environment-variable names that are not government-specific

Only user-visible branding, government-specific providers, government
infrastructure and government content are changed.

## Categories of change (and how to resolve conflicts)

| Category | Typical files | On `git merge upstream/main` |
| --- | --- | --- |
| **Deleted government modules** | `apps/studio/src/server/modules/auth/singpass/`, `…/modules/gazette/`, `…/modules/searchsg/`, `packages/algolia/`, gov site components under `packages/components/src/templates/next/components/`, `tooling/site-launch/`, gov deploy workflows | Accept our deletion (`git rm`) unless upstream shipped a *non-government* fix inside the deleted module — then cherry-pick that fix onto the replacement code path |
| **Rebranding (text/assets)** | `apps/studio/src/constants/misc.ts`, email templates, `apps/*/public/**`, `brand/**` | Take upstream's change and re-apply the Morph string/asset on top; these files are small |
| **Config defaults** | `apps/studio/src/env.mjs`, `.env.example`, `apps/studio/src/server/modules/site/site.service.ts` (site defaults), `next.config.mjs` CSP | Merge manually; keep Morph defaults (`Morph`, `example.com`, no gov domains) |
| **Auth simplification** | `apps/studio/src/server/modules/auth/email/email.router.ts` | Upstream edits to the Singpass branch can be dropped; keep edits to the email-OTP path |
| **Generic replacements** | `apps/studio/src/lib/mail.ts` (SMTP), `packages/pgboss/src/client.ts` (TZ), favicon/brand generation scripts | Take upstream's change if it touches the same generic mechanism, then re-verify the generic provider is intact |
| **Docs** | `README.md`, `CONTEXT.md`, `CLAUDE.md`, this file, `NOTICE.md`, `UPSTREAM.md` | Keep Morph's version; port any genuinely useful upstream doc additions manually |

## The government modules removed

- **Singpass / Mockpass authentication** (OIDC IdP + local mock). Email OTP is
  the only sign-in method; local development needs only PostgreSQL.
- **Gazettes** (Singapore Government Gazette ingestion + Algolia search) —
  feature, server module, cron job, `PushDocumentJob` table, mail templates.
- **SearchSG** integration (site search admin API + document push).
- **Published-site government components**: Masthead ("A Singapore Government
  Agency Website"), government copyright footer, Wogaa analytics, FormSG form
  embed, Askgov, Vica chatbot, OneMap/Maps.gov.sg map embed, data.gov.sg
  dataset block, AntiScam banner, Polyglot, SearchSG search box.
- **Government deploy infrastructure**: gov-account AWS deploy workflows,
  per-site launch tooling (ACM/SearchSG/Amplify/1Password/DNS), gov RDS
  bastion access, gov ops scripts.
- **Government content**: seed users/whitelists (`@open.gov.sg`), MTI demo
  content, gov support links (`isomer.gov.sg`, `go.gov.sg`, `ask.gov.sg`).

## Generic replacements added

- Email delivery: any SMTP server via `SMTP_*` env vars (console fallback).
- Timezone: `TZ`/server local timezone instead of hardcoded `Asia/Singapore`.
- Brand assets: see [`brand/`](./brand) (SVG source of truth + favicon
  generation script).
- Demo/seed content: neutral `example.com` accounts and pages.

## Database

One migration beyond upstream's history drops the government-specific columns
and tables (`User.singpassUuid`, `PushDocumentJob`). Everything else is
untouched, so an upstream database remains schema-compatible except for those
drops.
