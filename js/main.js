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
    renderTags();
    renderPostList();
    renderAbout();
    var posts = window.SITE_POSTS_META || [];
    if (posts[0]) renderPost(posts[0].id);
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
            '<h2><a href="#" data-go="post" data-post-id="' + post.id + '">' + dualSpan(post.title) + "</a></h2>" +
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

  var currentPostId = null;

  function renderPost(postId) {
    var posts = window.SITE_POSTS_META || [];
    var post = posts.find(function (p) { return p.id === postId; }) || posts[0];
    if (!post) return;
    var content = (window.SITE_POST_BODIES || {})[post.id];
    if (!content) return;
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
          '<a href="#" class="post-pair-link" data-go="home">' +
            '<span class="post-pair-kicker">' + dualSpan({ es: "Volver", en: "Back" }) + "</span>" +
            "<strong>" + dualSpan({ es: "Todos los posts", en: "All posts" }) + "</strong>" +
          "</a>" +
        "</nav>";
    }
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

  document.addEventListener("click", function (e) {
    var goEl = e.target.closest("[data-go]");
    if (goEl) {
      e.preventDefault();
      if (goEl.dataset.go === "post" && goEl.dataset.postId) {
        renderPost(goEl.dataset.postId);
      }
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
    var tagBtn = e.target.closest("[data-tagbar] [data-tag]");
    if (tagBtn) onTag(tagBtn);
  });

  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  var searchInput = document.querySelector("[data-search]");
  if (searchInput) searchInput.addEventListener("input", onSearch);

  initState();
})();
