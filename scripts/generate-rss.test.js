"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const vm = require("node:vm");

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

test("the automation post is registered with a physical bilingual shell", () => {
  const root = path.resolve(__dirname, "..");
  const posts = loadPosts(path.join(root, "js", "data", "posts-meta.js"));
  const automationPost = posts.find((item) => item.id === "automatizaciones-ia-que-saben-cuando-callarse");

  assert.ok(automationPost, "falta la metadata del nuevo post");
  assert.equal(automationPost.number, "03");
  assert.equal(automationPost.date, "2026.08.03");
  assert.equal(automationPost.readMin, 8);
  assert.deepEqual(automationPost.tags, ["automatizacion", "agentes", "hermes"]);
  assert.ok(automationPost.title.es);
  assert.ok(automationPost.title.en);
  assert.ok(automationPost.excerpt.es);
  assert.ok(automationPost.excerpt.en);
  assert.equal(automationPost.toc.length, 7);

  const bodyPath = path.join(root, "js", "data", "posts", automationPost.id + ".js");
  assert.ok(fs.existsSync(bodyPath), "falta el cuerpo bilingüe del post");
  const bodySource = fs.readFileSync(bodyPath, "utf8");
  const context = vm.createContext({ window: {} });
  vm.runInContext(bodySource, context, { timeout: 1000 });
  const body = context.window.SITE_POST_BODIES[automationPost.id];
  assert.ok(body.introHtml);
  assert.ok(body.bodyHtml);
  const headingIds = [...body.bodyHtml.matchAll(/<h2 id="([^"]+)">/g)].map((match) => match[1]);
  assert.deepEqual(headingIds, automationPost.toc.map((entry) => entry.id));
  assert.equal((bodySource.match(/data-l="es"/g) || []).length, (bodySource.match(/data-l="en"/g) || []).length);
  assert.match(bodySource, /class="code-block"/);
  assert.match(bodySource, /class="code-block-pre"/);
  assert.match(bodySource, /https:\/\/hermes-agent\.nousresearch\.com\/docs\/user-guide\/features\/cron/);
  assert.doesNotMatch(bodySource, /\/Users\/|NOTION_API_KEY|\bTODO\b/);
  assert.doesNotMatch(bodySource, /placeholder/i);

  const shellPath = path.join(root, automationPost.id, "index.html");
  const shell = fs.readFileSync(shellPath, "utf8");
  assert.match(shell, /name="initial-post" content="automatizaciones-ia-que-saben-cuando-callarse"/);
  assert.match(shell, /<base href="\.\.\/">/);
  assert.match(shell, /rel="canonical" href="https:\/\/santiandrade\.github\.io\/blog\/automatizaciones-ia-que-saben-cuando-callarse\/"/);
});

test("language and theme controls expose at least 30 px touch targets", () => {
  const stylesheet = fs.readFileSync(path.resolve(__dirname, "..", "css", "styles.css"), "utf8");
  assert.match(stylesheet, /\.lang-btn\{[^}]*min-width:30px[^}]*min-height:30px/);
  assert.match(stylesheet, /\.theme-toggle\{[^}]*width:30px[^}]*height:30px/);
});

test("every production HTML shell exposes both feeds and every post script", () => {
  const root = path.resolve(__dirname, "..");
  const shells = [
    "index.html",
    "hermes-agent/index.html",
    "segundo-cerebro-obsidian-hermes/index.html",
    "automatizaciones-ia-que-saben-cuando-callarse/index.html"
  ];
  const postScripts = [
    "js/data/posts/hermes-agent.js",
    "js/data/posts/segundo-cerebro-obsidian-hermes.js",
    "js/data/posts/automatizaciones-ia-que-saben-cuando-callarse.js"
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
    for (const postScript of postScripts) {
      assert.match(html, new RegExp(`<script src="${postScript.replaceAll("/", "\\/")}" defer><\\/script>`), `${shell}: ${postScript}`);
    }
  }
});
