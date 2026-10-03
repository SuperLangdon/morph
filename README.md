# Morph

Morph is an open-source CMS and static site publishing platform. Editors write
pages in a block-based editor, manage media, collections and navigation, and
publish a fully static website — no government infrastructure, no proprietary
identity provider, no vendor lock-in.

Morph is derived from [Isomer](https://github.com/opengovsg/isomer) by Open
Government Products; it is an independent, unaffiliated distribution. See
[NOTICE.md](./NOTICE.md) for attribution and
[MORPH.md](./MORPH.md) for the exact differences from upstream.

## Monorepo layout

| Path | What it is |
| --- | --- |
| `apps/studio` | The CMS application (Next.js 16, tRPC, Prisma + Kysely) |
| `apps/template` | The published-site renderer / local preview target |
| `packages/components` | Site component library and rendering engine |
| `packages/db` | Prisma schema and migrations |
| `tooling/build` | Publishing pipeline (database → static export) |
| `brand/` | SVG source of truth for Morph brand assets |

## Getting started

The monorepo uses pnpm and Turborepo. From the repository root:

```bash
corepack enable
pnpm install
```

### Run locally

```bash
# from the repo root
pnpm setup   # starts PostgreSQL (Docker) + migrations + seed data
pnpm dev     # Studio on :3000, published-site preview on :3001
```

Sign in with **email OTP**: enter one of the seeded accounts (see
`apps/studio/prisma/seed.ts`, e.g. `admin@example.com`), request a login code,
and read the code from the Studio server console — when no SMTP server is
configured, outgoing mail (including OTPs) is logged to the console instead of
being sent.

To send real email, set the `SMTP_*` variables in your env (any SMTP provider
works). See `.env.example`.

### Local publishing

With your local Studio environment and database set up, run `pnpm dev` from the
repository root. Studio runs at `http://localhost:3000` and the template preview
at `http://localhost:3001`.

When `NEXT_PUBLIC_APP_ENV=development`, publishing in Studio queues a local
export instead of starting CodeBuild. The publisher uses Studio's `DATABASE_URL`
when provided; otherwise it falls back to its `DB_*` connection settings.

- Studio logs `Local publish queued`, `Local publish started`, and
  `Local publish finished`, including the site ID, number of waiting publishes
  (excluding the running publish), queue wait time, and run duration.
- Wait for `Published site to the local template at http://localhost:3001` before
  checking the preview. The template checks for file changes every second;
  recompilation can take longer. Studio's publish response only confirms enqueueing.
- Exports run one at a time and replace `apps/template/.local-publish` after
  successful generation. This directory is gitignored and initially seeded from
  the template fixtures. The most recently completed publish determines which
  site appears in the preview.
- On macOS/Linux, an exporter that runs for more than two minutes is terminated
  along with its child processes. Failed output is removed, the previous preview
  is retained, and the next queued publish proceeds. Check `Local publish failed`
  for errors.
- Replacement uses a backup and two renames, with rollback if installation fails;
  it is not an atomic directory swap.

No AWS account or other external service is needed for the local loop. For
production publishing, Studio can drive AWS CodeBuild per site (generic AWS SDK
usage — bring your own account); see `apps/studio/src/server/modules/aws/`.

### Running database migrations

Against your own database (local or self-hosted):

```bash
# from apps/studio
pnpm migrate:dev    # create/apply migrations
pnpm db:seed        # optional: seed demo data
```

## Tracking upstream

Morph tracks the upstream Isomer repository so fixes and features continue to
flow in. See [UPSTREAM.md](./UPSTREAM.md) for the sync procedure and
[MORPH.md](./MORPH.md) for conflict-resolution rules per change category.

## License

MIT (inherited from upstream Isomer, including its arbitration rider) — see
[LICENSE](./LICENSE) and [NOTICE.md](./NOTICE.md).
