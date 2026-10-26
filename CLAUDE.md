# Day.js

A ~2 KB immutable date library that copies Moment.js's API. A small core
(`src/index.js`) is extended by opt-in plugins and locales. Behavior is checked
against Moment, which is installed as a devDependency for tests.

## Layout
- `src/index.js`: the `Dayjs` class and the `dayjs()` factory. `src/constant.js` holds
  unit names and the parse/format regexes. `src/utils.js` holds helpers exported under
  one-letter keys (`Utils.s` padStart, `.p` prettyUnit, `.u` isUndefined, ...).
- `src/plugin/<name>/index.js`: one directory per plugin. `src/locale/<code>.js`: one file per locale.
- `types/index.d.ts` and `types/plugin/<name>.d.ts`: hand-written typings, shipped as-is.
- `test/*.test.js` (core), `test/plugin/<name>.test.js`, `test/locale/<code>.test.js`.
- `build/`: rollup (UMD) and ESM build scripts. `docs/`: translated READMEs.

## Commands (npm, Node LTS; CI runs `npm install && npm run lint && npm test`)
- One test file: `TZ=UTC npx jest test/plugin/dayOfYear.test.js --coverage=false`
- Full suite: `TZ=UTC npm test`. It runs the timezone tests under several fixed TZs,
  then all of jest with a **100% line-coverage** gate.
- Lint: `npm run lint` (ESLint 4, airbnb-base, over `src/* test/* build/*`). A
  `pre-commit` hook runs it.
- Build: `NODE_OPTIONS=--openssl-legacy-provider npm run build` (UMD bundles, then
  `size-limit`). ESM build: `npm run babel`.

## Conventions
- No semicolons, no trailing commas, single quotes, 2-space indent. Lint enforces these.
- Plugins: `export default (o, c, d) => { const proto = c.prototype; proto.foo = function () {...} }`.
  `o` is the option object, `c` the Dayjs class, `d` the factory. Use `function`, not arrows,
  so `this` binds. Methods must return new instances (wrap with `d(this)` or `this.clone()`),
  never mutate.
- Internal fields are terse: `$d` Date, `$y $M $D $W $H $m $s $ms`, `$L` locale, `$u` utc, `$x` extras.
- Tests import from source: `import dayjs from '../../src'` and `'../../src/plugin/<name>'`.
  They wrap `MockDate.set(new Date())`/`MockDate.reset()` in `beforeEach`/`afterEach`, use
  flat `it()` blocks, and assert against `moment(...)` where Moment has the same API.
- Locale files start with `// <English name> [<code>]` and `import dayjs from 'dayjs'`.
  Jest maps `'dayjs'` to `src/` through `test/__mocks__/dayjs.js`. `test/locale/keys.test.js`
  checks every locale's shape.
- A new plugin needs a matching `types/plugin/<name>.d.ts`; `test/plugin/declarations.test.js` enforces it.
- Commit messages are semantic (`fix(plugin): ...`, `feat: ...`). semantic-release uses them to
  choose the version. PRs target `dev`; `master` is the release branch.

## Guardrails
- **Without `TZ=UTC`, tests fail on a non-UTC machine.** The final step of `npm test` uses
  the host timezone, and in America/Los_Angeles `dayOfYear`, `localizedFormat` and
  plugin `timezone` tests fail. CI runs on Ubuntu in UTC. Don't "fix" those assertions.
- Size budget: `dayjs.min.js` must stay under 2.99 KB gzipped. Put new behavior in a plugin, not in core.
- Never edit build output: root `dayjs.min.js`, `index.d.ts`, `locale.json`, `locale/`,
  `plugin/`, `esm/`. These are gitignored and come from `src/` and `types/`. Root `plugin/`
  is **not** `src/plugin/`.
- `CHANGELOG.md` is written by semantic-release, so don't edit it by hand. `patches/` is applied only at release.
- Don't bump the pinned `moment`/`moment-timezone` versions; tests compare against their exact output.
