"use strict";

var fs = require("node:fs");
var path = require("node:path");
var vm = require("node:vm");

function escapeXml(value) {
  var text = String(value);
  for (var character of text) {
    var codePoint = character.codePointAt(0);
    var allowed = codePoint === 0x09 || codePoint === 0x0a || codePoint === 0x0d ||
      (codePoint >= 0x20 && codePoint <= 0xd7ff) ||
      (codePoint >= 0xe000 && codePoint <= 0xfffd) ||
      (codePoint >= 0x10000 && codePoint <= 0x10ffff);
    if (!allowed) throw new Error("El texto contiene un carácter no permitido por XML 1.0");
  }
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toRfc822(value) {
  if (typeof value !== "string") throw new Error("La fecha debe usar el formato AAAA.MM.DD");
  var match = /^(\d{4})\.(\d{2})\.(\d{2})$/.exec(value);
  if (!match) throw new Error("La fecha debe usar el formato AAAA.MM.DD");

  var isoDate = match[1] + "-" + match[2] + "-" + match[3];
  var date = new Date(isoDate + "T00:00:00Z");
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== isoDate) {
    throw new Error("La metadata debe contener una fecha válida");
  }
  return date.toUTCString();
}

function validatePosts(posts) {
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error("La metadata debe contener al menos un post");
  }

  var seenIds = new Set();
  posts.forEach(function (post, index) {
    var prefix = "Post " + index + ": ";
    if (!post || typeof post !== "object") throw new Error(prefix + "metadata inválida");
    if (typeof post.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.id)) {
      throw new Error(prefix + "id debe ser un slug válido");
    }
    if (seenIds.has(post.id)) throw new Error(prefix + "slug duplicado: " + post.id);
    seenIds.add(post.id);
    toRfc822(post.date);

    ["title", "excerpt"].forEach(function (field) {
      ["es", "en"].forEach(function (lang) {
        if (!post[field] || typeof post[field][lang] !== "string" || !post[field][lang].trim()) {
          throw new Error(prefix + field + "." + lang + " es obligatorio");
        }
      });
    });
  });
}

var SITE_URL = "https://santiandrade.github.io/blog/";
var TRACKING_QUERY = "?utm_source=rss&utm_medium=rss&utm_campaign=blog_feed";

function buildFeed(posts, lang) {
  validatePosts(posts);
  if (lang !== "es" && lang !== "en") throw new Error("Idioma de feed no soportado: " + lang);

  var feedName = lang === "es" ? "feed.xml" : "feed-en.xml";
  var channelDescription = lang === "es"
    ? "Notas y reflexiones sobre inteligencia artificial de Santi Andrade."
    : "Notes and reflections on artificial intelligence by Santi Andrade.";
  var items = posts.map(function (post) {
    var permalink = SITE_URL + post.id + "/";
    var trackedLink = permalink + TRACKING_QUERY;
    return [
      "    <item>",
      "      <title>" + escapeXml(post.title[lang]) + "</title>",
      "      <description>" + escapeXml(post.excerpt[lang]) + "</description>",
      "      <pubDate>" + toRfc822(post.date) + "</pubDate>",
      "      <guid isPermaLink=\"true\">" + escapeXml(permalink) + "</guid>",
      "      <link>" + escapeXml(trackedLink) + "</link>",
      "    </item>"
    ].join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>Santi Andrade / Blog</title>",
    "    <link>" + SITE_URL + "</link>",
    "    <description>" + escapeXml(channelDescription) + "</description>",
    "    <language>" + (lang === "es" ? "es-ES" : "en") + "</language>",
    "    <atom:link href=\"" + SITE_URL + feedName + "\" rel=\"self\" type=\"application/rss+xml\"/>",
    items,
    "  </channel>",
    "</rss>",
    ""
  ].join("\n");
}

function loadPosts(metadataPath) {
  var source = fs.readFileSync(metadataPath, "utf8");
  var sandbox = Object.create(null);
  sandbox.window = Object.create(null);
  var context = vm.createContext(sandbox, {
    codeGeneration: { strings: false, wasm: false },
    microtaskMode: "afterEvaluate"
  });
  var serialized;
  try {
    serialized = vm.runInContext(source + "\nJSON.stringify(window.SITE_POSTS_META);", context, {
      filename: metadataPath,
      timeout: 1000
    });
  } catch (ignored) {
    throw new Error("No se pudo evaluar posts-meta.js de forma segura");
  }
  if (typeof serialized !== "string") {
    throw new Error("posts-meta.js debe registrar window.SITE_POSTS_META");
  }
  var posts = JSON.parse(serialized);
  validatePosts(posts);
  return posts;
}

function generateFeeds(rootDir, check) {
  var posts = loadPosts(path.join(rootDir, "js", "data", "posts-meta.js"));
  var outputs = {
    "feed.xml": buildFeed(posts, "es"),
    "feed-en.xml": buildFeed(posts, "en")
  };
  var problems = [];

  Object.entries(outputs).forEach(function (entry) {
    var fileName = entry[0];
    var expected = entry[1];
    var outputPath = path.join(rootDir, fileName);
    if (check) {
      if (!fs.existsSync(outputPath)) {
        problems.push(fileName + " no existe");
      } else if (fs.readFileSync(outputPath, "utf8") !== expected) {
        problems.push(fileName + " está desactualizado");
      }
    } else {
      fs.writeFileSync(outputPath, expected, "utf8");
    }
  });

  if (problems.length) throw new Error(problems.join("; "));
  return outputs;
}

function runCli() {
  var args = process.argv.slice(2);
  if (args.some(function (arg) { return arg !== "--check"; }) || args.length > 1) {
    throw new Error("Uso: node scripts/generate-rss.js [--check]");
  }
  var check = args[0] === "--check";
  generateFeeds(path.resolve(__dirname, ".."), check);
  process.stdout.write(check ? "Feeds RSS actualizados.\n" : "Feeds RSS generados.\n");
}

if (require.main === module) {
  try {
    runCli();
  } catch (error) {
    process.stderr.write("Error: " + error.message + "\n");
    process.exitCode = 1;
  }
}

module.exports = {
  escapeXml,
  toRfc822,
  validatePosts,
  buildFeed,
  loadPosts,
  generateFeeds
};
