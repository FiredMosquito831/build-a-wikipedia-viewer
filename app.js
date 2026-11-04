/*
 * app.js — DOM wiring for the Wikipedia Viewer.
 * Search + Random via WikiLogic URL builders. On any fetch failure the
 * app falls back to bundled demo entries so it still works offline.
 */
(function () {
  "use strict";
  var W = window.WikiLogic;
  var Demo = window.DemoData;
  var $ = function (id) { return document.getElementById(id); };

  function renderList(rows, note) {
    var list = $("results");
    list.innerHTML = "";
    var empty = document.createElement("li");
    empty.className = "note";
    empty.textContent =
      rows.length ? (note || "") : "No results.";
    if (rows.length) list.appendChild(empty);

    rows.forEach(function (row) {
      var li = document.createElement("li");
      li.className = "result";
      var a = document.createElement("a");
      a.href = row.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "title";
      a.textContent = row.title;
      li.appendChild(a);
      if (row.description) {
        var d = document.createElement("p");
        d.className = "desc";
        d.textContent = row.description;
        li.appendChild(d);
      }
      list.appendChild(li);
    });
  }

  function renderRandom(rnd, note) {
    var box = $("random-box");
    box.innerHTML = "";
    if (note) {
      var n = document.createElement("p");
      n.className = "note";
      n.textContent = note;
      box.appendChild(n);
    }
    var a = document.createElement("a");
    a.href = rnd.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "rand-title";
    a.textContent = "Random article: " + rnd.title;
    box.appendChild(a);
  }

  async function search(q) {
    try {
      var r = await fetch(W.buildSearchUrl(q));
      if (!r.ok) throw new Error("HTTP " + r.status);
      var rows = W.parseOpensearch(await r.json(), q);
      renderList(rows);
    } catch (e) {
      // Offline -> demo rows, but keep the query label.
      renderList(Demo.entries, "Offline — showing bundled demo entries.");
    }
  }

  async function random() {
    try {
      var r = await fetch(W.buildRandomUrl());
      if (!r.ok) throw new Error("HTTP " + r.status);
      var rnd = W.parseRandom(await r.json()) || Demo.random;
      renderRandom(rnd);
    } catch (e) {
      renderRandom(Demo.random, "Offline — showing a bundled demo article.");
    }
  }

  $("search-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var q = $("search-input").value.trim();
    if (q) search(q);
  });
  $("random-btn").addEventListener("click", random);

  // On load: show demo entries so the page is never empty, then let the
  // user search / random.
  renderList(Demo.entries, "Bundled starter results — search above.");
  renderRandom(Demo.random, "Bundled starter article — or hit Random.");
})();
