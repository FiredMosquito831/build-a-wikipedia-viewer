/*
 * demo-data.js — bundled, offline fallback for the Wikipedia Viewer.
 * A few well-known entries (as opensearch-shaped rows) and a "random"
 * article, so the app shows results even with no network.
 * UMD: window.DemoData in the browser, require()-able in Node.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.DemoData = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var entries = [
    {
      title: "JavaScript",
      description: "High-level, interpreted programming language",
      thumb: "",
      url: "https://en.wikipedia.org/wiki/JavaScript"
    },
    {
      title: "Web development",
      description: "Construction and maintenance of websites",
      thumb: "",
      url: "https://en.wikipedia.org/wiki/Web_development"
    },
    {
      title: "Free software",
      description: "Software licensed to be usable by anyone",
      thumb: "",
      url: "https://en.wikipedia.org/wiki/Free_software"
    }
  ];
  var random = {
    title: "Responsive web design",
    url: "https://en.wikipedia.org/wiki/Responsive_web_design"
  };
  return { entries: entries, random: random, source: "bundled demo data (offline)" };
});
