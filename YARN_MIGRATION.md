# YARN 2 MIGRATION DOC

## Remaining todos:

### fix all missing dependencies

to see problems, run `yarn dlx @yarnpkg/doctor`. note: `yarn global` no longer exists. instead, yarn has the equivalent of `npx` (roughly) via `yarn dlx`.

additionally, root dependencies can no longer be implicitly used by packages. all dependencies used in a package must be explicitly added to package's package.json.

### fix frontend dockerfile

I kinda did a first pass on it, but it should probably be cleaned up.

NOTE: `yarn install --immutable` requires ALL package.jsons, otherwise it will error (see frontend dockerfile)

to get frontend build to work, i just copied all the root devDeps to common package.json, but it doesn't need all of them, so remove the non-important ones.

### re-configure shared build scripts and dependencies

so to build, we use babel. that's fine (it can remain at top-level) but the way we use it needs to be updated.

see https://yarnpkg.com/getting-started/qa#how-to-share-scripts-between-workspaces
