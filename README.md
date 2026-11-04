# Build a Wikipedia Viewer

**A freeCodeCamp Legacy Front-End certification project.**

## What it does

A static, no-build Wikipedia search app built against the published user
stories:

1. I can search Wikipedia entries in a search box and see the resulting
   entries (title, description, and a link to the article).
2. I can click a button to see a random Wikipedia entry.

It uses the free **Wikipedia MediaWiki API** (opensearch + list=random) with
`origin=*` so it works cross-origin from a static page.

## Tech stack

- Vanilla HTML / CSS / JavaScript — no build step.
- The request builders and response parsers live in `logic.js`, a UMD
  module usable in the browser (`window.WikiLogic`) and in Node
  (`require("./logic.js")`).

## Graceful offline fallback

If the MediaWiki API is unreachable, the app falls back to bundled demo
entries (`demo-data.js`) and labels them, so it always shows results.

## How to run

Static app — open `index.html`, or:

```bash
python -m http.server 8000   # then open http://localhost:8000
```

## How to test

```bash
node test_local.js
```

14 assertions over the pure logic module: URL builders (opensearch,
random, canonical article URLs incl. space/special-char encoding),
opensearch array parsing, random-title parsing, safe defaults, and the
offline demo shape. Exits `0` and prints `PASS` when green; output
committed as `local-test.log`.

## Files

| file | role |
|---|---|
| `index.html` | UI |
| `styles.css` | styling |
| `logic.js` | pure, testable logic (UMD) |
| `demo-data.js` | offline fallback entries (UMD) |
| `app.js` | DOM wiring + fetch + fallback |
| `fixtures/*.json` | sample MediaWiki responses for tests |
| `test_local.js` | Node test runner |

## Licence

MIT © 2026 FiredMosquito831. Written from scratch against the published
user stories; no freeCodeCamp starter or reference-solution code was used.


## Verification

Built and tested locally before publication: **14/14 assertions passing**
(`node test_local.js`). Captured output committed as [`local-test.log`](local-test.log).

Core logic lives in `logic.js (window.WikiLogic)`; the test exercises it in Node without a browser.

## Source

Written from scratch against the project's published freeCodeCamp specification. No freeCodeCamp
starter or reference-solution code was used.
