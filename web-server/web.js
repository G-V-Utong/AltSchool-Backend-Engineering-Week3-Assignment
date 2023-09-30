const path = require("path");
const fs = require("fs");
const http = require("http");

const webPath = path.join(__dirname, "index.html");
const errorPath = path.join(__dirname, "error.html");

const PORT = 5000;

function requestHandler(req, res) {
  if (req.url === "/") {
    getWeb(req, res);
  }

  if (req.url.endsWith(".html") && req.method === "GET") {
    try {
      getWebSought(req, res);
    } catch (error) {
      getWebError(req, res);
    }
  }
}

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`server has started running at http://localhost:${PORT}`);
});


// Handlers
function getWeb(req, res) {
  res.setHeader("content-type", "text/html");
  res.writeHead(200);
  res.end(fs.readFileSync(webPath));
}

function getWebSought(req, res) {
  const file = req.url.split("/")[1];
  const actualFilePath = path.join(__dirname, file);
  const web = fs.readFileSync(actualFilePath);
  res.setHeader("content-type", "text/html");
  res.writeHead(200);
  res.end(web);
}

function getWebError(req, res) {
  res.setHeader("content-type", "text/html");
  res.writeHead(404);
  res.end(fs.readFileSync(errorPath));
}
