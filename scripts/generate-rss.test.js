"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const {
  escapeXml,
  toRfc822,
  validatePosts,
  buildFeed,
  loadPosts,
  generateFeeds
} = require("./generate-rss.js");

function post(overrides = {}) {
  return {
    id: "hermes-agent",
    date: "2026.08.01",
    title: { es: "Título", en: "Title" },
    excerpt: { es: "Resumen", en: "Summary" },
    ...overrides
  };
}

test("escapeXml escapes every XML-reserved character", () => {
  assert.equal(
    escapeXml(`Hermes & <TARS> "RSS" 'feed'`),
    "Hermes &amp; &lt;TARS&gt; &quot;RSS&quot; &apos;feed&apos;"
  );
});

test("escapeXml rejects characters forbidden by XML 1.0", () => {
  assert.throws(() => escapeXml("control:\u0001"), /XML 1\.0/);
  assert.throws(() => escapeXml("surrogate:\ud800"), /XML 1\.0/);
  assert.equal(escapeXml("tab:\tline:\n"), "tab:\tline:\n");
});

test("toRfc822 converts a metadata date to midnight GMT", () => {
  assert.equal(toRfc822("2026.08.01"), "Sat, 01 Aug 2026 00:00:00 GMT");
  assert.throws(() => toRfc822(["2026.08.01"]), /AAAA\.MM\.DD/);
  assert.throws(() => toRfc822("2026-08-01"), /AAAA\.MM\.DD/);
  assert.throws(() => toRfc822("2026.02.30"), /fecha válida/);
});

test("validatePosts accepts complete bilingual metadata", () => {
  assert.doesNotThrow(() => validatePosts([post()]));
});

test("validatePosts rejects invalid or duplicate post metadata", () => {
  assert.throws(() => validatePosts([]), /al menos un post/);
  assert.throws(() => validatePosts([post({ id: "Hermes Agent" })]), /slug/);
  assert.throws(() => validatePosts([post({ title: { es: "Título", en: "" } })]), /title\.en/);
  assert.throws(() => validatePosts([post(), post()]), /duplicado/);
});

test("buildFeed creates a localized summarized RSS document", () => {
  const posts = [post({
    title: { es: "IA & criterio", en: "AI & judgement" },
    excerpt: { es: "Resumen <breve>", en: "Short <summary>" }
  })];
  const spanish = buildFeed(posts, "es");
  const english = buildFeed(posts, "en");

  assert.match(spanish, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(spanish, /<rss version="2\.0" xmlns:atom="http:\/\/www\.w3\.org\/2005\/Atom">/);
  assert.match(spanish, /<language>es-ES<\/language>/);
  assert.match(spanish, /<atom:link href="https:\/\/santiandrade\.github\.io\/blog\/feed\.xml" rel="self" type="application\/rss\+xml"\/>/);
  assert.match(spanish, /<title>IA &amp; criterio<\/title>/);
  assert.match(spanish, /<description>Resumen &lt;breve&gt;<\/description>/);
  assert.match(spanish, /<pubDate>Sat, 01 Aug 2026 00:00:00 GMT<\/pubDate>/);
  assert.match(spanish, /<guid isPermaLink="true">https:\/\/santiandrade\.github\.io\/blog\/hermes-agent\/<\/guid>/);
  assert.match(spanish, /<link>https:\/\/santiandrade\.github\.io\/blog\/hermes-agent\/\?utm_source=rss&amp;utm_medium=rss&amp;utm_campaign=blog_feed<\/link>/);
  assert.doesNotMatch(spanish, /Short|bodyHtml|introHtml/);

  assert.match(english, /<language>en<\/language>/);
  assert.match(english, /feed-en\.xml/);
  assert.match(english, /<title>AI &amp; judgement<\/title>/);
  assert.match(english, /<description>Short &lt;summary&gt;<\/description>/);
  assert.doesNotMatch(english, /Resumen/);
});

function createFixture(t, posts = [post()]) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "blog-rss-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const metadataPath = path.join(root, "js", "data", "posts-meta.js");
  fs.mkdirSync(path.dirname(metadataPath), { recursive: true });
  fs.writeFileSync(
    metadataPath,
    "window.SITE_POSTS_META = " + JSON.stringify(posts) + ";\n",
    "utf8"
  );
  return { root, metadataPath };
}

test("loadPosts reads and validates the JavaScript metadata registry", (t) => {
  const fixture = createFixture(t);
  assert.deepEqual(loadPosts(fixture.metadataPath), [post()]);
});

test("loadPosts does not expose host constructors to metadata code", (t) => {
  const fixture = createFixture(t);
  fs.writeFileSync(
    fixture.metadataPath,
    "window.SITE_POSTS_META = " + JSON.stringify([post()]) + ";\n" +
      "window.SITE_POSTS_META[0].title.es = window.constructor.constructor('return process')().version;\n",
    "utf8"
  );
  assert.throws(() => loadPosts(fixture.metadataPath), /constructor|Code generation|Cannot read|evaluar posts-meta/);

  fs.writeFileSync(
    fixture.metadataPath,
    "window.SITE_POSTS_META = " + JSON.stringify([post()]) + ";\n" +
      "window.SITE_POSTS_META[0].title.es = globalThis.constructor.constructor('return process')().version;\n",
    "utf8"
  );
  assert.throws(() => loadPosts(fixture.metadataPath), /Code generation from strings disallowed|evaluar posts-meta/);
});

test("loadPosts never exposes thrown VM values to host error handling", (t) => {
  const fixture = createFixture(t);
  fs.writeFileSync(
    fixture.metadataPath,
    "throw { get message() { while (true) {} } };\n",
    "utf8"
  );
  const generatorPath = path.join(__dirname, "generate-rss.js");
  const probe = spawnSync(
    process.execPath,
    [
      "-e",
      "try { require(" + JSON.stringify(generatorPath) + ").loadPosts(" +
        JSON.stringify(fixture.metadataPath) +
        "); } catch (error) { process.stdout.write(error.message); }"
    ],
    { encoding: "utf8", timeout: 2500 }
  );
  assert.equal(probe.status, 0, probe.error && probe.error.message);
  assert.match(probe.stdout, /No se pudo evaluar posts-meta\.js de forma segura/);
});

test("loadPosts keeps metadata getters inside the VM timeout", (t) => {
  const fixture = createFixture(t);
  fs.writeFileSync(
    fixture.metadataPath,
    "window.SITE_POSTS_META = [{ get id() { while (true) {} } }];\n",
    "utf8"
  );
  const generatorPath = path.join(__dirname, "generate-rss.js");
  const probe = spawnSync(
    process.execPath,
    [
      "-e",
      "try { require(" + JSON.stringify(generatorPath) + ").loadPosts(" +
        JSON.stringify(fixture.metadataPath) +
        "); } catch (error) { process.stdout.write(error.message); process.exit(0); } process.exit(2);"
    ],
    { encoding: "utf8", timeout: 2500 }
  );
  assert.equal(probe.status, 0, probe.error && probe.error.message);
  assert.match(probe.stdout, /No se pudo evaluar posts-meta\.js de forma segura/);
});

test("loadPosts includes queued VM microtasks in its timeout", (t) => {
  const fixture = createFixture(t);
  fs.writeFileSync(
    fixture.metadataPath,
    "window.SITE_POSTS_META = " + JSON.stringify([post()]) + ";\n" +
      "Promise.resolve().then(function () { while (true) {} });\n",
    "utf8"
  );
  const generatorPath = path.join(__dirname, "generate-rss.js");
  const probe = spawnSync(
    process.execPath,
    [
      "-e",
      "try { require(" + JSON.stringify(generatorPath) + ").loadPosts(" +
        JSON.stringify(fixture.metadataPath) +
        "); process.stdout.write('returned'); } catch (error) { process.stdout.write(error.message); }"
    ],
    { encoding: "utf8", timeout: 2500 }
  );
  assert.equal(probe.status, 0, probe.error && probe.error.message);
  assert.match(probe.stdout, /No se pudo evaluar posts-meta\.js de forma segura/);
});

test("generateFeeds writes deterministic feeds and check mode detects drift", (t) => {
  const fixture = createFixture(t);

  generateFeeds(fixture.root, false);
  const spanishPath = path.join(fixture.root, "feed.xml");
  const englishPath = path.join(fixture.root, "feed-en.xml");
  const initialSpanish = fs.readFileSync(spanishPath, "utf8");
  const initialEnglish = fs.readFileSync(englishPath, "utf8");

  assert.doesNotThrow(() => generateFeeds(fixture.root, true));
  generateFeeds(fixture.root, false);
  assert.equal(fs.readFileSync(spanishPath, "utf8"), initialSpanish);
  assert.equal(fs.readFileSync(englishPath, "utf8"), initialEnglish);

  fs.writeFileSync(spanishPath, "stale\n", "utf8");
  assert.throws(() => generateFeeds(fixture.root, true), /feed\.xml.*desactualizado/);
});

test("check mode fails when feeds are absent or metadata changes", (t) => {
  const fixture = createFixture(t);
  assert.throws(() => generateFeeds(fixture.root, true), /no existe/);

  generateFeeds(fixture.root, false);
  const changedPosts = [
    post({ id: "nuevo-post", title: { es: "Nuevo", en: "New" } }),
    post()
  ];
  fs.writeFileSync(
    fixture.metadataPath,
    "window.SITE_POSTS_META = " + JSON.stringify(changedPosts) + ";\n",
    "utf8"
  );
  assert.throws(() => generateFeeds(fixture.root, true), /desactualizado/);
});

test("post card excerpts use the full content column width", () => {
  const root = path.resolve(__dirname, "..");
  const styles = fs.readFileSync(path.join(root, "css", "styles.css"), "utf8");
  const rule = styles.match(/\.post-card-content>p\{([^}]*)\}/);

  assert.ok(rule, "post-card excerpt rule must exist");
  assert.match(rule[1], /width:100%/);
  assert.doesNotMatch(rule[1], /max-width/);
});

test("the automation post is registered with a physical permalink and local hero", () => {
  const root = path.resolve(__dirname, "..");
  const slug = "automatizaciones-ia-que-saben-cuando-callarse";
  const posts = loadPosts(path.join(root, "js", "data", "posts-meta.js"));
  const post = posts.find((item) => item.id === slug);

  assert.ok(post, "the new post must be listed in metadata");
  assert.equal(post.number, "03");
  assert.ok(fs.existsSync(path.join(root, "js", "data", "posts", `${slug}.js`)));
  assert.ok(fs.existsSync(path.join(root, slug, "index.html")));
  assert.ok(fs.existsSync(path.join(root, "assets", "posts", `${slug}.png`)));

  const body = fs.readFileSync(path.join(root, "js", "data", "posts", `${slug}.js`), "utf8");
  assert.match(body, /heroHtml:/);
  assert.match(body, new RegExp(`assets/posts/${slug}\\.png`));
  assert.match(body, /<figure[^>]*class="post-hero"/);
  assert.match(body, /data-alt-es="Ilustración editorial de una automatización que decide entre callar, avisar y fallar\./);
  assert.match(body, /data-alt-en="Editorial illustration of an automation deciding whether to stay quiet, notify or fail\./);
  assert.match(body, /<figcaption>/);

  const shell = fs.readFileSync(path.join(root, slug, "index.html"), "utf8");
  assert.match(shell, new RegExp(`initial-post" content="${slug}"`));
  assert.match(shell, new RegExp(`js/data/posts/${slug}\\.js`));
});

test("the automation card places its local editorial image between excerpt and tags", () => {
  const root = path.resolve(__dirname, "..");
  const slug = "automatizaciones-ia-que-saben-cuando-callarse";
  const posts = loadPosts(path.join(root, "js", "data", "posts-meta.js"));
  const post = posts.find((item) => item.id === slug);
  const main = fs.readFileSync(path.join(root, "js", "main.js"), "utf8");

  assert.deepEqual(post.cardImage, {
    src: `assets/posts/${slug}.png`,
    alt: {
      es: "Ilustración editorial de una automatización que decide entre callar, avisar y fallar.",
      en: "Editorial illustration of an automation deciding whether to stay quiet, notify or fail."
    }
  });
  assert.match(main, /class="post-card-image"/);
  assert.match(main, /post\.cardImage/);
  assert.match(main, /data-alt-es=/);
  assert.match(main, /data-alt-en=/);
  const titleIndex = main.indexOf("'<h2><a href=\"' + postPath(post.id)");
  const excerptIndex = main.indexOf('"<p>" + dualSpan(post.excerpt)');
  const imageIndex = main.indexOf('class="post-card-image"');
  const tagsIndex = main.indexOf('class="post-card-tags"');
  assert.ok(titleIndex < excerptIndex && excerptIndex < imageIndex && imageIndex < tagsIndex);
});

test("the first two posts register local PNG illustrations for cards and article heroes", () => {
  const root = path.resolve(__dirname, "..");
  const posts = loadPosts(path.join(root, "js", "data", "posts-meta.js"));
  const expected = {
    "hermes-agent": {
      es: "Ilustración editorial de una persona y un agente de IA colaborando en un flujo de trabajo con controles de seguridad.",
      en: "Editorial illustration of a person and an AI agent collaborating in a workflow with security controls."
    },
    "segundo-cerebro-obsidian-hermes": {
      es: "Ilustración editorial de un agente de IA organizando fuentes y conocimiento con revisión humana.",
      en: "Editorial illustration of an AI agent organising sources and knowledge with human review."
    }
  };

  for (const [slug, alt] of Object.entries(expected)) {
    const post = posts.find((item) => item.id === slug);
    assert.ok(post, `${slug} must be listed in metadata`);
    assert.deepEqual(post.cardImage, { src: `assets/posts/${slug}.png`, alt });
    assert.ok(fs.existsSync(path.join(root, "assets", "posts", `${slug}.png`)));

    const body = fs.readFileSync(path.join(root, "js", "data", "posts", `${slug}.js`), "utf8");
    assert.match(body, /heroHtml:/);
    assert.match(body, new RegExp(`assets/posts/${slug}\\.png`));
    assert.match(body, /<figure[^>]*class="post-hero"/);
    assert.match(body, new RegExp(`data-alt-es="${alt.es}"`));
    assert.match(body, new RegExp(`data-alt-en="${alt.en}"`));
    assert.match(body, /<figcaption>/);
  }
});

test("every physical shell registers the complete post list", () => {
  const root = path.resolve(__dirname, "..");
  const shells = [
    "index.html",
    "hermes-agent/index.html",
    "segundo-cerebro-obsidian-hermes/index.html",
    "automatizaciones-ia-que-saben-cuando-callarse/index.html"
  ];
  const slug = "automatizaciones-ia-que-saben-cuando-callarse";

  for (const shell of shells) {
    const html = fs.readFileSync(path.join(root, shell), "utf8");
    assert.match(html, /3 posts/);
    assert.match(html, new RegExp(`js/data/posts/${slug}\\.js`));
  }
});

test("every production HTML shell exposes both feeds", () => {
  const root = path.resolve(__dirname, "..");
  const shells = [
    "index.html",
    "hermes-agent/index.html",
    "segundo-cerebro-obsidian-hermes/index.html",
    "automatizaciones-ia-que-saben-cuando-callarse/index.html"
  ];

  for (const shell of shells) {
    const html = fs.readFileSync(path.join(root, shell), "utf8");
    assert.equal((html.match(/type="application\/rss\+xml"/g) || []).length, 2, shell);
    assert.equal((html.match(/class="rss-link"/g) || []).length, 2, shell);
    assert.equal((html.match(/data-copy-rss=/g) || []).length, 2, shell);
    assert.match(html, /data-copy-rss="https:\/\/santiandrade\.github\.io\/blog\/feed\.xml"/);
    assert.match(html, /data-copy-rss="https:\/\/santiandrade\.github\.io\/blog\/feed-en\.xml"/);
    assert.match(html, /data-rss-copy-status[^>]*role="status"[^>]*aria-live="polite"/);
    assert.match(html, /Copia la URL y añádela a tu lector RSS\./);
    assert.match(html, /Copy the URL and add it to your RSS reader\./);
    assert.match(html, /href="https:\/\/santiandrade\.github\.io\/blog\/feed\.xml"/);
    assert.match(html, /href="https:\/\/santiandrade\.github\.io\/blog\/feed-en\.xml"/);
    assert.match(html, /Suscribirse:/);
    assert.match(html, /Subscribe:/);
  }
});
