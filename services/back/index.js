const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql");

const APIKEYS = require("./apiKeys");
const config = require("./config");
const IMAGE_PATH = config.IMAGE_PATH || path.resolve(__dirname, "tmp");
const GIF_CAPTION_SVC = config.GIF_CAPTION_SVC;

const mysqlPoolConfig = {
  host: config.MYSQL_HOST,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASS,
  database: config.MYSQL_DB,
  connectionLimit: 100
}; 

const pool = mysql.createPool(mysqlPoolConfig);

const app = express();

let serverStatus = {
  status: "running",
  timestamp: 0,
  ready: false,
  db: false
};

const getStatus = () => {
  let status = serverStatus;
  status.timestamp = (new Date()).getTime();
  return status;
};

function downloadFile(fileUrl, filename) {
  let outputLocationPath = path.resolve(IMAGE_PATH, `${filename}.gif`);
  const writer = fs.createWriteStream(outputLocationPath);

  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then(response => {
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', err => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          resolve(outputLocationPath);
        }
      });
    });
  });
}

app.use(cors());

app.get("/health", (req, res) => {
  res.send(getStatus()).status(200);
});

app.get("/image/:image", (req, res) => {
  let file = path.resolve(IMAGE_PATH, req.params.image);
  console.log(` Fetch ${file}`)
  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.sendFile(path.resolve(__dirname, "assets", "404.gif"));
  }
});

app.get("/blankimage/:query?/:reqId?", (req, res) => {
  let query = req.params.query || "random";
  let limit = 100; //Number of images to receive
  axios
    .get(`http://api.giphy.com/v1/gifs/search?api_key=${APIKEYS.GIPHY}&q=${query}&limit=${limit}`)
    .then(resp => {
      let numImg = resp.data.data.length;
      let numId = Math.round(Math.random()*numImg);
      let url = resp.data.data[numId].images.original.url;
      return downloadFile(url, req.params.reqId);
    })
    .then(file => {
      console.log(file);
      res.sendFile(file);
    }).catch(e => console.log(e));
});

app.get("/caption/:file/:caption", (req, res) => {
  axios.get(`http://${GIF_CAPTION_SVC}/${req.params.file}/${req.params.caption}`).then(data => {
    res.sendFile(path.resolve(IMAGE_PATH, req.params.file + "-caption.gif"));
  }).catch(() => {
    console.error("Error getting image from captionizer service");
    res.sendStatus(500);
  });
});

app.get("/saved/images", (req, res) => {
  pool.query("SELECT * FROM images", (err, results, fields) => {
    if (err) console.log(err);
    res.send(results).status(200);
  });
});

app.post("/image/:caption/:filename", (req, res) => {
  pool.query(`INSERT INTO images(caption, filename) VALUES ("${req.params.caption}", "${req.params.filename}-caption.gif");`, (err, results) => {
    if (err) console.log(err);
    res.send("").status(200);
  });
});

app.listen(3000, () => {
  console.log("Server running");
});
