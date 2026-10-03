# Tracking upstream Isomer

Morph follows [opengovsg/isomer](https://github.com/opengovsg/isomer) so that
bug fixes and features from the upstream CMS continue to flow into Morph.

## Remote setup

```
origin    = your Morph repository
upstream  = https://github.com/opengovsg/isomer.git
```

`upstream` is already configured in this clone. Set `origin` to your own
repository when you create it.

## Sync procedure

Morph keeps a linear history **on top of** upstream — do not squash or rebase
away the upstream history, otherwise every future sync becomes a diff
nightmare.

```bash
# 1. Fetch the latest upstream
git fetch upstream

# 2. Merge into the Morph branch (the fork point is tagged upstream-baseline)
git checkout morph
git merge upstream/main

# 3. Resolve conflicts per the table in MORPH.md
#    - files in deleted government modules: accept our deletion (git rm)
#    - branding/config files: take upstream, re-apply the Morph values
#    - anything unclear: read MORPH.md first

# 4. Run the verification suite (install, typecheck, unit + e2e tests)
#    before pushing.
```

## Reviewing the Morph-only diff

```bash
git diff upstream/main...HEAD --stat   # everything Morph changed
git log --oneline upstream/main..HEAD  # the Morph commit series (one commit per area)
```

Each Morph commit is scoped to a single concern (auth, gov modules,
infrastructure, branding, content, tests), so `git bisect` and conflict
resolution stay tractable.
