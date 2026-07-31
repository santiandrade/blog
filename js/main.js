(function () {
  var root = document.documentElement;

  function syncPlaceholder(lang) {
    var input = document.querySelector("[data-search]");
    if (input) input.placeholder = lang === "en" ? "Search…" : "Buscar…";
  }

  function initState() {
    root.dataset.route = "home";
    root.dataset.theme = localStorage.getItem("sa-theme") || "light";
    root.dataset.lang = localStorage.getItem("sa-lang") || "es";
    syncPlaceholder(root.dataset.lang);
  }

  function goTo(route) {
    root.dataset.route = route;
    window.scrollTo(0, 0);
  }

  function toggleTheme() {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("sa-theme", next);
  }

  function setLang(lang) {
    if (root.dataset.lang === lang) return;
    root.dataset.lang = lang;
    syncPlaceholder(lang);
    localStorage.setItem("sa-lang", lang);
  }

  function onSearch(e) {
    var q = e.target.value.toLowerCase().trim();
    var shown = 0;
    document.querySelectorAll("[data-post-card]").forEach(function (card) {
      var haystack = (card.dataset.terms + " " + card.textContent).toLowerCase();
      var ok = !q || haystack.includes(q);
      card.style.display = ok ? "" : "none";
      if (ok) shown++;
    });
    var empty = document.querySelector("[data-empty]");
    if (empty) empty.hidden = shown > 0;
  }

  function copyCode(btn) {
    var block = btn.closest(".code-block");
    var pre = block && block.querySelector("pre");
    if (!pre) return;
    if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent);
    var prev = btn.textContent;
    btn.textContent = root.dataset.lang === "en" ? "Copied" : "Copiado";
    setTimeout(function () {
      btn.textContent = prev;
    }, 1400);
  }

  document.addEventListener("click", function (e) {
    var goEl = e.target.closest("[data-go]");
    if (goEl) {
      e.preventDefault();
      goTo(goEl.dataset.go);
      return;
    }
    var copyBtn = e.target.closest("[data-copy-btn]");
    if (copyBtn) {
      copyCode(copyBtn);
      return;
    }
    var langBtn = e.target.closest("[data-set-lang]");
    if (langBtn) setLang(langBtn.dataset.setLang);
  });

  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  var searchInput = document.querySelector("[data-search]");
  if (searchInput) searchInput.addEventListener("input", onSearch);

  initState();
})();
