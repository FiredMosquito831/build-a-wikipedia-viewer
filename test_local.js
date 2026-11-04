// Tests for the "Build a Wikipedia Viewer" logic module.
// Run:  node test_local.js   (exits 0 + prints PASS when green)
"use strict";

const path = require("path");
const WikiLogic = require(path.join(__dirname, "logic.js"));
const DemoData = require(path.join(__dirname, "demo-data.js"));
const osFixture = require(path.join(__dirname, "fixtures", "opensearch.json"));
const randomFixture = require(path.join(__dirname, "fixtures", "random.json"));

let pass = 0;
let fail = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) {
    pass += 1;
    console.log("PASS  " + name + (detail ? "  [" + detail + "]" : ""));
  } else {
    fail += 1;
    failures.push(name);
    console.log("FAIL  " + name + (detail ? "  [" + detail + "]" : ""));
  }
}

// --- URL builders ----------------------------------------------------------
const su = WikiLogic.buildSearchUrl("javascript", 5);
check(
  "search URL has opensearch + origin + limit",
  su.indexOf("action=opensearch") !== -1 &&
    su.indexOf("origin=*") !== -1 &&
    su.indexOf("limit=5") !== -1 &&
    su.indexOf("search=javascript") !== -1
);
check(
  "search URL encodes spaces",
  WikiLogic.buildSearchUrl("New York").indexOf("search=New%20York") !== -1
);
check(
  "random URL is a valid query",
  WikiLogic.buildRandomUrl().indexOf("list=random") !== -1 &&
    WikiLogic.buildRandomUrl().indexOf("origin=*") !== -1
);
check(
  "article URL turns spaces into underscores",
  WikiLogic.buildArticleUrl("Foo Bar") === "https://en.wikipedia.org/wiki/Foo_Bar"
);
check(
  "article URL encodes special chars",
  WikiLogic.buildArticleUrl("a (b)").indexOf("a_(b)") !== -1
);

// --- opensearch parsing ----------------------------------------------------
const rows = WikiLogic.parseOpensearch(osFixture, "javascript");
check("opensearch -> 4 entries", rows.length === 4, "len " + rows.length);
check(
  "first entry title + description + url",
  rows[0].title === "JavaScript" &&
    rows[0].description === "High-level, interpreted programming language" &&
    rows[0].url === "https://en.wikipedia.org/wiki/JavaScript"
);
check(
  "missing description/thumb degrade to empty",
  rows[1].description === "" && rows[1].thumb === ""
);
check(
  "article URLs built per entry",
  rows[3].url === "https://en.wikipedia.org/wiki/JavaScript_(programming_language)"
);

// --- random parsing --------------------------------------------------------
const rnd = WikiLogic.parseRandom(randomFixture);
check("random -> title", rnd && rnd.title === "Cat");
check("random -> canonical URL", rnd.url === "https://en.wikipedia.org/wiki/Cat");
check(
  "parseRandom of empty payload -> null",
  WikiLogic.parseRandom({}) === null
);

// --- offline demo shape ----------------------------------------------------
check(
  "demo entries parse through the same entry shape",
  DemoData.entries.length === 3 &&
    DemoData.entries[0].title === "JavaScript" &&
    typeof DemoData.entries[0].url === "string"
);
check("demo random has a title + url",
  DemoData.random.title && DemoData.random.url);

// --- summary ---------------------------------------------------------------
console.log("");
const total = pass + fail;
console.log("SUMMARY: " + pass + " passed, " + fail + " failed / " + total);
if (fail === 0) {
  console.log("PASS");
  process.exit(0);
} else {
  console.log("FAILED: " + failures.join(", "));
  process.exit(1);
}
