(function () {
  var root = document.documentElement;
  var siteBasePath = (document.querySelector('meta[name="site-base"]') || {}).content || "/";
  var siteOrigin = (document.querySelector('meta[name="site-origin"]') || {}).content || window.location.origin;
  var currentPostId = null;
  var navigationToken = 0;
  var rssCopyToken = 0;

  if (siteBasePath.charAt(0) !== "/") siteBasePath = "/" + siteBasePath;
  if (siteBasePath.slice(-1) !== "/") siteBasePath += "/";

  function postPath(postId) {
    return siteBasePath + encodeURIComponent(postId) + "/";
  }

  function absoluteUrl(path) {
    return siteOrigin.replace(/\/$/, "") + path;
  }

  function setMeta(selector, value) {
    var element = document.querySelector(selector);
    if (element) element.setAttribute("content", value);
  }

  function updateDocumentMetadata(route, postId) {
    var lang = root.dataset.lang === "en" ? "en" : "es";
    var posts = window.SITE_POSTS_META || [];
    var post = posts.find(function (item) { return item.id === postId; });
    var title = "Santi Andrade / Blog";
    var description = lang === "en"
      ? "Notes and reflections on artificial intelligence by Santi Andrade."
      : "Notas y reflexiones sobre inteligencia artificial de Santi Andrade.";
    var url = absoluteUrl(siteBasePath);
    var type = "website";

    if (route === "post" && post) {
      title = post.title[lang] + " / Santi Andrade";
      description = post.excerpt[lang];
      url = absoluteUrl(postPath(post.id));
      type = "article";
    }

    document.title = title;
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", url);
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="og:type"]', type);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
  }

  function routeFromLocation() {
    var posts = window.SITE_POSTS_META || [];
    var initialPost = (document.querySelector('meta[name="initial-post"]') || {}).content;
    var postId = initialPost || null;

    if (window.location.protocol !== "file:") {
      var path = window.location.pathname;
      if (path.indexOf(siteBasePath) === 0) {
        var relativePath = path.slice(siteBasePath.length).replace(/^\/+|\/+$/g, "");
        if (relativePath && relativePath.indexOf("/") === -1) {
          try {
            postId = decodeURIComponent(relativePath);
          } catch (error) {
            postId = relativePath;
          }
        } else if (!relativePath) {
          postId = null;
        }
      }
    }

    var postExists = posts.some(function (post) { return post.id === postId; });
    return postExists ? { route: "post", postId: postId } : { route: "home", postId: null };
  }

  function updateNavigationHrefs() {
    document.querySelectorAll('[data-go="home"]').forEach(function (link) {
      link.setAttribute("href", siteBasePath);
    });
    document.querySelectorAll('[data-go="about"]').forEach(function (link) {
      link.setAttribute("href", siteBasePath);
    });
  }

  var loadingPosts = {};

  function ensurePostLoaded(postId, callback) {
    if ((window.SITE_POST_BODIES || {})[postId]) {
      callback(true);
      return;
    }
    if (loadingPosts[postId]) {
      loadingPosts[postId].push(callback);
      return;
    }

    loadingPosts[postId] = [callback];
    var script = document.createElement("script");
    var scriptBase = window.location.protocol === "file:" ? "" : siteBasePath;
    script.src = scriptBase + "js/data/posts/" + encodeURIComponent(postId) + ".js";
    script.onload = function () {
      var loaded = Boolean((window.SITE_POST_BODIES || {})[postId]);
      loadingPosts[postId].forEach(function (done) { done(loaded); });
      delete loadingPosts[postId];
    };
    script.onerror = function () {
      loadingPosts[postId].forEach(function (done) { done(false); });
      delete loadingPosts[postId];
    };
    document.head.appendChild(script);
  }

  function syncPlaceholder(lang) {
    var input = document.querySelector("[data-search]");
    if (input) input.placeholder = lang === "en" ? "Search…" : "Buscar…";
  }

  function initState() {
    root.dataset.theme = localStorage.getItem("sa-theme") || "light";
    root.dataset.lang = localStorage.getItem("sa-lang") === "en" ? "en" : "es";
    root.lang = root.dataset.lang;
    syncPlaceholder(root.dataset.lang);
    renderTags();
    renderPostList();
    renderAbout();
    updateNavigationHrefs();
    var initialRoute = routeFromLocation();
    root.dataset.route = initialRoute.route;
    updateDocumentMetadata(initialRoute.route, initialRoute.postId);
    if (initialRoute.route === "post") {
      var initialNavigationToken = ++navigationToken;
      ensurePostLoaded(initialRoute.postId, function (loaded) {
        if (loaded && initialNavigationToken === navigationToken) renderPost(initialRoute.postId);
      });
    }
    if (window.location.protocol !== "file:" && window.history.replaceState) {
      window.history.replaceState(initialRoute, "", window.location.href);
    }
    var yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function goTo(route, postId, options) {
    options = options || {};
    if (options.navigationToken && options.navigationToken !== navigationToken) return;
    if (!options.navigationToken) options.navigationToken = ++navigationToken;
    if (route === "post") {
      if (!(window.SITE_POST_BODIES || {})[postId]) {
        ensurePostLoaded(postId, function (loaded) {
          if (loaded && options.navigationToken === navigationToken) goTo(route, postId, options);
        });
        return;
      }
      if (!renderPost(postId)) return;
      postId = currentPostId;
    }
    root.dataset.route = route;
    updateDocumentMetadata(route, postId);
    if (!options.fromHistory && window.location.protocol !== "file:" && window.history.pushState) {
      var path = route === "post" ? postPath(postId) : siteBasePath;
      window.history.pushState({ route: route, postId: postId || null }, "", path);
    }
    if (!options.keepScroll) window.scrollTo(0, 0);
  }

  function toggleTheme() {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("sa-theme", next);
  }

  function setLang(lang) {
    if (root.dataset.lang === lang) return;
    root.dataset.lang = lang;
    root.lang = lang;
    rssCopyToken++;
    syncPlaceholder(lang);
    var rssCopyStatus = document.querySelector("[data-rss-copy-status]");
    if (rssCopyStatus) rssCopyStatus.textContent = "";
    localStorage.setItem("sa-lang", lang);
    updateDocumentMetadata(root.dataset.route, currentPostId);
  }

  function dualSpan(value) {
    if (typeof value === "string") return value;
    return (
      '<span data-l="es">' + value.es + "</span>" +
      '<span data-l="en">' + value.en + "</span>"
    );
  }

  function renderTags() {
    var bar = document.querySelector("[data-tagbar]");
    if (!bar) return;
    var tags = window.SITE_TAGS || [];
    var html = '<button type="button" class="tag-btn is-active" data-tag="all">' +
      dualSpan({ es: "Todo", en: "All" }) + "</button>";
    tags.forEach(function (tag) {
      html += '<button type="button" class="tag-btn" data-tag="' + tag.id + '">' +
        dualSpan({ es: tag.es, en: tag.en }) + "</button>";
    });
    bar.innerHTML = html;
  }

  function tagLabel(tagId) {
    var tag = (window.SITE_TAGS || []).find(function (t) { return t.id === tagId; });
    return tag ? dualSpan({ es: tag.es, en: tag.en }) : tagId;
  }

  function renderPostList() {
    var list = document.querySelector("[data-postlist]");
    if (!list) return;
    var posts = window.SITE_POSTS_META || [];
    var empty = list.querySelector("[data-empty]");
    var cardsHtml = posts.map(function (post) {
      return (
        '<article class="post-card" data-r="card" data-post-card data-post-id="' + post.id + '" data-tags="' + post.tags.join(" ") + '" data-terms="' + post.terms + '">' +
          '<div class="post-card-meta">' +
            "<span>POST " + post.number + "</span>" +
            "<span>" + post.date + "</span>" +
            "<span>" + dualSpan({ es: post.readMin + " MIN", en: post.readMin + " MIN" }) + "</span>" +
          "</div>" +
          '<div class="post-card-content">' +
            '<h2><a href="' + postPath(post.id) + '" data-go="post" data-post-id="' + post.id + '">' + dualSpan(post.title) + "</a></h2>" +
            "<p>" + dualSpan(post.excerpt) + "</p>" +
            '<div class="post-card-tags">' +
              post.tags.map(tagLabel).map(function (l) { return "<span>" + l + "</span>"; }).join("") +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }).join("");
    if (empty) {
      empty.insertAdjacentHTML("beforebegin", cardsHtml);
    } else {
      list.innerHTML = cardsHtml + list.innerHTML;
    }
  }

  function renderPost(postId) {
    var posts = window.SITE_POSTS_META || [];
    var post = posts.find(function (p) { return p.id === postId; });
    if (!post) return false;
    var content = (window.SITE_POST_BODIES || {})[post.id];
    if (!content) return false;
    currentPostId = post.id;

    var header = document.querySelector("[data-post-header]");
    if (header) {
      header.innerHTML =
        '<p class="post-kicker">' + dualSpan(post.kicker) + "</p>" +
        '<h1 class="post-title">' + dualSpan(post.title) + "</h1>" +
        '<div class="post-meta">' +
          "<span>" + post.date + "</span>" +
          "<span>" + dualSpan({ es: post.readMin + " min de lectura", en: post.readMin + " min read" }) + "</span>" +
          "<span>" + post.tags.map(tagLabel).join(" · ") + "</span>" +
        "</div>" +
        '<div class="post-actions">' +
          '<button type="button" class="post-share" data-share-post aria-live="polite">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M18 8a3 3 0 1 0-2.83-4A3 3 0 0 0 15 5c0 .18.02.36.05.53L8.91 9.02a3 3 0 1 0 0 5.96l6.14 3.49A3 3 0 0 0 15 19a3 3 0 1 0 .91-2.15l-6.14-3.49c.15-.43.15-.89 0-1.32l6.14-3.49A3 3 0 0 0 18 8Z" fill="currentColor"/></svg>' +
            dualSpan({ es: "Compartir", en: "Share" }) +
          "</button>" +
        "</div>";
    }

    var toc = document.querySelector("[data-post-toc]");
    if (toc) {
      var tocLabel = toc.querySelector(".post-toc-label");
      toc.innerHTML = "";
      if (tocLabel) toc.appendChild(tocLabel);
      post.toc.forEach(function (entry, index) {
        var num = String(index + 1).padStart(2, "0");
        toc.insertAdjacentHTML(
          "beforeend",
          '<a href="#' + entry.id + '">' + num + " " + dualSpan({ es: entry.es, en: entry.en }) + "</a>"
        );
      });
    }

    var body = document.querySelector("[data-post-body]");
    if (body) {
      body.innerHTML =
        '<p class="post-intro">' + content.introHtml + "</p>" +
        content.bodyHtml +
        '<nav class="post-pair post-pair--single" data-r="pair">' +
          '<a href="' + siteBasePath + '" class="post-pair-link" data-go="home">' +
            '<span class="post-pair-kicker">' + dualSpan({ es: "Volver", en: "Back" }) + "</span>" +
            "<strong>" + dualSpan({ es: "Todos los posts", en: "All posts" }) + "</strong>" +
          "</a>" +
        "</nav>";
    }

    setupTocObserver();
    return true;
  }

  var tocObserver = null;

  function setupTocObserver() {
    if (tocObserver) {
      tocObserver.disconnect();
      tocObserver = null;
    }
    var toc = document.querySelector("[data-post-toc]");
    var body = document.querySelector("[data-post-body]");
    if (!toc || !body) return;
    var links = toc.querySelectorAll("a[href^='#']");
    if (!links.length) return;

    var linkByHash = {};
    links.forEach(function (link) {
      linkByHash[link.getAttribute("href").slice(1)] = link;
    });

    function setActive(id) {
      links.forEach(function (link) {
        link.classList.toggle("is-active", link === linkByHash[id]);
      });
    }

    var headings = Array.prototype.slice.call(body.querySelectorAll("h2[id]"));
    if (!headings.length) return;

    tocObserver = new IntersectionObserver(
      function (entries) {
        var visible = entries.filter(function (entry) { return entry.isIntersecting; });
        if (visible.length) {
          visible.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );
    headings.forEach(function (heading) { tocObserver.observe(heading); });
    setActive(headings[0].id);
  }

  function renderAbout() {
    var about = window.SITE_ABOUT;
    if (!about) return;

    var heroText = document.querySelector("[data-about-hero-text]");
    if (heroText) {
      heroText.innerHTML =
        "<h1>" + dualSpan(about.hero.title) + "</h1>" +
        '<p class="about-lede">' + dualSpan(about.hero.lede) + "</p>" +
        '<p class="about-muted">' + dualSpan(about.hero.muted) + "</p>";
    }

    var portrait = document.querySelector("[data-about-portrait]");
    if (portrait) {
      portrait.innerHTML =
        '<img class="about-portrait-img" src="' + about.portrait.src + '" alt="' + about.portrait.alt + '">';
    }

    var toolsLabel = document.querySelector("[data-about-tools-label]");
    if (toolsLabel) toolsLabel.innerHTML = dualSpan(about.toolsLabel);

    var tools = document.querySelector("[data-about-tools]");
    if (tools) {
      tools.innerHTML = about.tools.map(function (tool) {
        return (
          '<div class="tool-card">' +
            "<strong>" + tool.name + "</strong>" +
            "<span>" + dualSpan({ es: tool.es, en: tool.en }) + "</span>" +
          "</div>"
        );
      }).join("");
    }

    var contactLabel = document.querySelector("[data-about-contact-label]");
    if (contactLabel) contactLabel.innerHTML = dualSpan(about.contactLabel);

    var contact = document.querySelector("[data-about-contact]");
    if (contact) {
      contact.innerHTML = about.contactLinks.map(function (link) {
        return '<a href="' + link.href + '">' + link.label + "</a>";
      }).join("");
    }
  }

  var activeTag = "all";

  function filterPosts() {
    var q = (document.querySelector("[data-search]") || {}).value || "";
    q = q.toLowerCase().trim();
    var tag = activeTag !== "all" ? activeTag : null;
    var shown = 0;
    document.querySelectorAll("[data-post-card]").forEach(function (card) {
      var haystack = (card.dataset.terms + " " + card.textContent).toLowerCase();
      var matchesQuery = !q || haystack.includes(q);
      var matchesTag = !tag || (card.dataset.tags || "").split(" ").includes(tag);
      var ok = matchesQuery && matchesTag;
      card.style.display = ok ? "" : "none";
      if (ok) shown++;
    });
    var empty = document.querySelector("[data-empty]");
    if (empty) empty.hidden = shown > 0;
  }

  function onSearch() {
    filterPosts();
  }

  function onTag(btn) {
    activeTag = btn.dataset.tag;
    var bar = btn.closest("[data-tagbar]");
    bar.querySelectorAll("[data-tag]").forEach(function (b) {
      b.classList.toggle("is-active", b === btn);
    });
    filterPosts();
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

  function showShareFeedback(btn, copied) {
    var previous = btn.innerHTML;
    btn.textContent = copied
      ? (root.dataset.lang === "en" ? "Link copied" : "Enlace copiado")
      : (root.dataset.lang === "en" ? "Could not copy" : "No se pudo copiar");
    setTimeout(function () { btn.innerHTML = previous; }, 1600);
  }

  function copyShareUrl(url, btn) {
    function legacyCopy() {
      var input = document.createElement("textarea");
      input.value = url;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      var copied = false;
      try { copied = document.execCommand("copy"); } catch (error) { copied = false; }
      document.body.removeChild(input);
      showShareFeedback(btn, copied);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        Promise.resolve(navigator.clipboard.writeText(url))
          .then(function () { showShareFeedback(btn, true); })
          .catch(legacyCopy);
      } catch (error) {
        legacyCopy();
      }
    } else {
      legacyCopy();
    }
  }

  function copyRssUrl(btn) {
    var url = btn.dataset.copyRss;
    var status = document.querySelector("[data-rss-copy-status]");
    if (!url || !status) return;
    var copyToken = ++rssCopyToken;
    status.textContent = "";

    function report(copied) {
      if (copyToken !== rssCopyToken) return;
      var feedLang = /feed-en\.xml$/.test(url) ? "EN" : "ES";
      if (copied) {
        status.textContent = root.dataset.lang === "en"
          ? (feedLang === "EN" ? "English RSS URL copied." : "Spanish RSS URL copied.")
          : "URL de RSS " + feedLang + " copiada.";
      } else {
        status.textContent = root.dataset.lang === "en"
          ? "Could not copy the RSS URL. Open the feed and copy its address."
          : "No se pudo copiar la URL. Abre el feed y copia su dirección.";
      }
    }

    function legacyCopy() {
      if (copyToken !== rssCopyToken) return;
      var previousFocus = document.activeElement;
      var input = document.createElement("textarea");
      input.value = url;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      var copied = false;
      try { copied = document.execCommand("copy"); } catch (error) { copied = false; }
      document.body.removeChild(input);
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
      report(copied);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        Promise.resolve(navigator.clipboard.writeText(url))
          .then(function () { report(true); })
          .catch(legacyCopy);
      } catch (error) {
        legacyCopy();
      }
    } else {
      legacyCopy();
    }
  }

  function shareCurrentPost(btn) {
    var post = (window.SITE_POSTS_META || []).find(function (item) { return item.id === currentPostId; });
    if (!post) return;
    var lang = root.dataset.lang === "en" ? "en" : "es";
    var data = {
      title: post.title[lang],
      text: post.excerpt[lang],
      url: siteOrigin.replace(/\/$/, "") + postPath(post.id)
    };
    if (typeof navigator.share === "function") {
      try {
        Promise.resolve(navigator.share(data)).catch(function (error) {
          if (!error || error.name !== "AbortError") copyShareUrl(data.url, btn);
        });
      } catch (error) {
        if (!error || error.name !== "AbortError") copyShareUrl(data.url, btn);
      }
    } else {
      copyShareUrl(data.url, btn);
    }
  }

  document.addEventListener("click", function (e) {
    var tocLink = e.target.closest("[data-post-toc] a[href^='#']");
    if (tocLink) {
      var target = document.getElementById(tocLink.getAttribute("href").slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    var goEl = e.target.closest("[data-go]");
    if (goEl) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      goTo(goEl.dataset.go, goEl.dataset.postId);
      return;
    }
    var copyBtn = e.target.closest("[data-copy-btn]");
    if (copyBtn) {
      copyCode(copyBtn);
      return;
    }
    var shareBtn = e.target.closest("[data-share-post]");
    if (shareBtn) {
      shareCurrentPost(shareBtn);
      return;
    }
    var rssCopyBtn = e.target.closest("[data-copy-rss]");
    if (rssCopyBtn) {
      copyRssUrl(rssCopyBtn);
      return;
    }
    var langBtn = e.target.closest("[data-set-lang]");
    if (langBtn) setLang(langBtn.dataset.setLang);
    var tagBtn = e.target.closest("[data-tagbar] [data-tag]");
    if (tagBtn) onTag(tagBtn);
  });

  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  var searchInput = document.querySelector("[data-search]");
  if (searchInput) searchInput.addEventListener("input", onSearch);

  window.addEventListener("popstate", function (event) {
    var state = event.state || routeFromLocation();
    goTo(state.route || "home", state.postId, { fromHistory: true });
  });

  initState();
})();
