const fs = require('fs');
const path = require('path');
const http = require('http');

const itemsPath = path.join(__dirname, 'items.json');

const PORT = 5000;

// Request Handler

requestHandler = (req, res) => {
    if (req.method === 'GET' && req.url === '/items') {
        getAllItems(req, res);
    }

    if (req.method === 'POST' && req.url === '/items') {
        postItem(req, res);
    }

    if (req.method === 'GET' && req.url.startsWith('/items/')) {
        getOneItem(req, res);
    }

    if (req.method === "PATCH" && req.url.startsWith("/items/")) {
        updateItem(req, res);
    }
    
    if (req.method === "DELETE" && req.url.startsWith("/items/")) {
        deleteItem(req, res);
    }

}

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log(`Server has started running at http://localhost:${PORT}`);
});


// error handler functions

function serverError(){
    res.writeHead("500");
    res.end("internal server error");
}
  
function clientError(){
    res.writeHead("404");
    res.end("item not found");
}

// handler functions

// GET items

function getAllItems(req, res) {
    fs.readFile(itemsPath, "utf8", (err, data) => {
      if (err) {
       serverError()
      }
      res.end(data);
    });
}

// GET only one item

function getOneItem(req, res) {
    const id = req.url.split("/")[2];
    const items = fs.readFileSync(itemsPath);
    const itemsArrayOfObj = JSON.parse(items);
  
    const itemIndex = itemsArrayOfObj.findIndex((item) => {
      return item.id === id;
    });
    if (itemIndex === -1) {
      clientError()
    }
    res.end(JSON.stringify(itemsArrayOfObj[itemIndex]));
  }

// POST item

function postItem(req, res) {
    const readItems = fs.readFileSync(itemsPath)
    const  itemsArrayOfObj = JSON.parse(readItems)
  
    const bodyObj = [];
    req.on("data", (chunk) => {
      bodyObj.push(chunk);
    });
  
    req.on("end", () => {
      const parsedBody = Buffer.concat(bodyObj).toString();
      const itemToPost = JSON.parse(parsedBody);
  
      itemsArrayOfObj.push({
        ...itemToPost,
        id: Math.floor(Math.random() * 500).toString(),
      });
  
      fs.writeFile(itemsPath, JSON.stringify(itemsArrayOfObj), (err) => {
        if (err) {
         serverError()
        }
  
        res.end(JSON.stringify(itemToPost));
      });
    });
}

// UPDATE item

function updateItem(req, res) {
    const id = req.url.split("/")[2];
  
    const items = fs.readFileSync(itemsPath);
    const itemsArrayOfObj = JSON.parse(items);
  
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
  
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const update = JSON.parse(parsedBody);
  
      const itemIndex = itemsArrayOfObj.findIndex((item) => {
        return item.id === id;
      });
  
      if (itemIndex == -1) {
        res.end(`item not found`);
      }
  
      itemsArrayOfObj[itemIndex] = { ...itemsArrayOfObj[itemIndex], ...update };
  
      fs.writeFile(itemsPath, JSON.stringify(itemsArrayOfObj), (err) => {
        if (err) {
          serverError()
        }
        res.end(JSON.stringify(itemsArrayOfObj[itemIndex]));
      });
    });
  }

// DELETE item

function deleteItem(req, res) {
    const id = req.url.split("/")[2];
  
    const items = fs.readFileSync(itemsPath);
    const itemsArrayOfObj = JSON.parse(items);
  
    const itemIndex = itemsArrayOfObj.findIndex((item) => {
      return item.id === id;
    });
  
    if (itemIndex == -1) {
      res.end(`item not found`);
    }
  
    itemsArrayOfObj.splice(itemIndex, 1);
  
    fs.writeFile(itemsPath, JSON.stringify(itemsArrayOfObj), (err) => {
      if (err) {
        serverError()
      }
  
      res.end(`item successfully deleted`);
    });
  }