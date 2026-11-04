/*
 * wikiLogic.js — pure functions for "Build a Wikipedia Viewer".
 *
 * UMD: window.WikiLogic in the browser, require()-able in Node. No DOM,
 * no network. Builds MediaWiki (Wikipedia) request URLs and parses the
 * two responses the app uses: opensearch (list of entries) and
 * list=random (a single article title).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.WikiLogic = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var API = "https://en.wikipedia.org/w/api.php";

  // opensearch returns a JSON array:
  //   [queryTerm, [titles], [descriptions], [thumbs]]
  // We build a fully-qualified, CORS-friendly URL (origin=*).
  function buildSearchUrl(query, limit) {
    var lim = limit || 10;
    return (
      API +
      "?action=opensearch" +
      "&search=" + encodeURIComponent(query) +
      "&limit=" + lim +
      "&namespace=0" +
      "&redirect=1" +
      "&format=json" +
      "&origin=*"
    );
  }

  // list=random gives us a random article's title in the main namespace.
  function buildRandomUrl() {
    return (
      API +
      "?action=query" +
      "&list=random" +
      "&rnnamespace=0" +
      "&rnlimit=1" +
      "&format=json" +
      "&origin=*"
    );
  }

  // Canonical article URL: spaces become underscores, and the title is
  // URL-encoded so names with special characters survive.
  function buildArticleUrl(title) {
    return "https://en.wikipedia.org/wiki/" +
      encodeURIComponent(String(title).replace(/ /g, "_"));
  }

  function parseOpensearch(json, query) {
    if (!Array.isArray(json)) return [];
    var titles = json[1] || [];
    var descs = json[2] || [];
    var thumbs = json[3] || [];
    return titles.map(function (t, i) {
      return {
        title: t,
        description: descs[i] || "",
        thumb: thumbs[i] || "",
        url: buildArticleUrl(t),
        query: query != null ? query : (json[0] || "")
      };
    });
  }

  function parseRandom(json) {
    var title =
      json && json.query && json.query.random &&
      json.query.random[0] && json.query.random[0].title;
    if (!title) return null;
    return { title: title, url: buildArticleUrl(title) };
  }

  return {
    buildSearchUrl: buildSearchUrl,
    buildRandomUrl: buildRandomUrl,
    buildArticleUrl: buildArticleUrl,
    parseOpensearch: parseOpensearch,
    parseRandom: parseRandom
  };
});
