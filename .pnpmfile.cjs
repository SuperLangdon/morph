// Empty pnpmfile.
//
// pnpm 11 made .pnpmfile.mjs the default and loads it via dynamic import.
// When NODE_OPTIONS injects an ESM register hook (e.g. dd-trace's
// --import register.js used by Datadog Test Visibility), a missing file
// is surfaced as a fatal ERR_MODULE_NOT_FOUND instead of pnpm's usual
// silent skip, which breaks `pnpm exec` in CI. Keeping this file present
// (even empty) avoids that import failure.
//
// Morph note: this is the CommonJS variant of upstream's .pnpmfile.mjs.
// pnpm 12 loads the .mjs variant via ESM dynamic import using a bare
// absolute path, which throws ERR_UNSUPPORTED_ESM_URL_SCHEME on Windows
// ("e:" is not a valid URL scheme) and hard-breaks `pnpm install`. The
// .cjs variant is loaded via require and works on all platforms.
module.exports = {}
