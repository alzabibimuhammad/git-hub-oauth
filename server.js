require("module-alias/register");
require("./module-alias");

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const cron = require("node-cron");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.CUSTOM_NEXT_PORT || 3001;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Use dynamic import for ESM modules
async function fetchUserRepos() {
  const module = await import("./src/lib/fetchUserRepo.mjs");
  return module.fetchUserRepos();
}

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === "/a") {
        await app.render(req, res, "/a", query);
      } else if (pathname === "/b") {
        await app.render(req, res, "/b", query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);

      cron.schedule("1 * * * *", fetchUserRepos);
      console.log("Cron job scheduled to run every hour");
    });
});
