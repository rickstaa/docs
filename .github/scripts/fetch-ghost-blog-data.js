/**
 * @script fetch-ghost-blog-data
 * @summary Utility script for .github/scripts/fetch-ghost-blog-data.js.
 * @owner docs
 * @scope .github/scripts
 *
 * @usage
 *   node .github/scripts/fetch-ghost-blog-data.js
 *
 * @inputs
 *   No required CLI flags; optional flags are documented inline.
 *
 * @outputs
 *   - Console output and/or file updates based on script purpose.
 *
 * @exit-codes
 *   0 = success
 *   1 = runtime or validation failure
 *
 * @examples
 *   node .github/scripts/fetch-ghost-blog-data.js
 *
 * @notes
 *   Keep script behavior deterministic and update script indexes after changes.
 */
const https = require("https");
const fs = require("fs");

// Fetch JSON from URL
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

// Safe HTML escape - only escape backticks for template literals
function safeHTML(html) {
  return (html || "").replace(/`/g, "\\`");
}

// Format date
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function main() {
  console.log("Fetching Ghost blog posts...");

  const apiUrl =
    "https://livepeer-studio.ghost.io/ghost/api/content/posts/?key=eaf54ba5c9d4ab35ce268663b0&limit=4&include=tags,authors";

  const response = await fetchJSON(apiUrl);

  if (!response.posts || response.posts.length === 0) {
    console.log("No posts found");
    return;
  }

  console.log(`Found ${response.posts.length} posts`);

  // Process posts
  const posts = response.posts.map((p) => ({
    title: p.title,
    href: p.url,
    author: p.primary_author?.name
      ? `By ${p.primary_author.name}`
      : "By Livepeer Team",
    content: safeHTML(p.html),
    datePosted: formatDate(p.published_at),
    img: p.feature_image || "",
    excerpt: safeHTML(p.excerpt),
    readingTime: p.reading_time || 0,
  }));

  // Generate JavaScript export with template literals
  let jsExport = "export const ghostData = [\n";

  posts.forEach((post, index) => {
    jsExport += "{\n";
    jsExport += `  title: \`${post.title}\`,\n`;
    jsExport += `  href: \`${post.href}\`,\n`;
    jsExport += `  author: \`${post.author}\`,\n`;
    jsExport += `  content: \`${post.content}\`,\n`;
    jsExport += `  datePosted: \`${post.datePosted}\`,\n`;
    jsExport += `  img: \`${post.img}\`,\n`;
    jsExport += `  excerpt: \`${post.excerpt}\`,\n`;
    jsExport += `  readingTime: ${post.readingTime}\n`;
    jsExport += "}";

    if (index < posts.length - 1) {
      jsExport += ",";
    }
    jsExport += "\n";
  });

  jsExport += "];\n";

  // Write to file
  const outputPath = "snippets/automations/ghost/ghostBlogData.jsx";
  fs.mkdirSync("snippets/automations/ghost", { recursive: true });
  fs.writeFileSync(outputPath, jsExport);
  console.log(`Written to ${outputPath}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
