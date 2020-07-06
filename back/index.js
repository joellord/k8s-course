const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const gifFrames = require("gif-frames");
const imageSize = require("image-size");
const gifEncoder = require("gifencoder");
const pngFileStream = require("png-file-stream");
const jimp = require("jimp");
const mysql = require("mysql");

const APIKEYS = require("./apiKeys");
const config = require("./config");

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
  db: false
};

if (!fs.existsSync("./tmp")){
  fs.mkdirSync("./tmp");
}

const getStatus = () => {
  let status = serverStatus;
  status.timestamp = (new Date()).getTime();
  let promise = new Promise((resolve, reject) => {
    pool.query("SELECT * FROM images", (err, results, fields) => {
      if (err) {
        console.log(err);
        status.db = false;
        reject(err);
      }
      status.db = true;
      resolve(status);
    });
  });
  return promise;
};

function downloadFile(fileUrl, filename) {
  let outputLocationPath = path.resolve(__dirname, "tmp", `${filename}.gif`);
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

function addCaptionToImage(image, caption) {
  console.log(`Adding ${caption} to ${image}`);
  let gifDimensions = imageSize(image);
  let fileName = image.substr(image.lastIndexOf("/")+1);
  let fileNameNoExt = fileName.replace(".gif", "");
  let dirName = fileNameNoExt.replace(/[^0-9a-f]/ig, "");

  if (!fs.existsSync(path.resolve(__dirname, "tmp", dirName))) {
    fs.mkdirSync(path.resolve(__dirname, "tmp", dirName));
  }

  let textData = {
    text: caption.toUpperCase(), 
    maxWidth: gifDimensions.width - 20, 
    maxHeight: 20, 
    placementX: 0, 
    placementY: gifDimensions.height - 20
  };

  return gifFrames({url: image, frames: "all", outputType: "jpg", cumulative: true})
    .then(frameData => {
      
      let imageProcessingPromises = [];
      
      for (let i = 0; i < frameData.length; i++) {
        let frame = frameData[i];
        let index = frame.frameIndex.toString();
        if (index < 100) index = "0" + index;
        if (index < 10) index = "0" + index;
        let frameImageName = `tmp/${dirName}/${dirName}-` + index + '.jpg';
        let frameImage = frame.getImage().pipe(fs.createWriteStream(frameImageName));

        let frameImagePromise = new Promise((resolve, reject) => {
          frameImage.on("finish", () => resolve(frameImageName));
          frameImage.on("error", reject);
        });

        imageProcessingPromises.push(frameImagePromise);
      }

      return Promise.all(imageProcessingPromises);
    })
    .catch( e => {console.log(e); process.exit();})
    .then(images => {
      let imageCaptioningPromises = [];

      for (let i = 0; i < images.length; i++) {
        let imageName = images[i];
        if (imageName === undefined) continue;
        let imageActiveName = imageName.replace(".jpg", "-active.jpg");
        let imageCaptionedName = imageName.replace(".jpg", "-caption.png");

        let imageCaptionPromise = jimp.read(imageName)
          .then(tpl => (tpl.clone().write(imageActiveName, e => e ? console.log(e) : "")))
          .then(() => jimp.read(imageActiveName))
          .then(tpl => {
            return jimp.loadFont(jimp.FONT_SANS_64_WHITE)
              .then(font => ([tpl, font]))
          })
          .then(data => {
            tpl = data[0];
            font = data[1];
            return tpl.print(font, textData.placementX, textData.placementY, {
              text: textData.text,
              alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
              alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
            }, textData.maxWidth, textData.maxHeight);
          })
          .then(tpl => tpl.quality(100).write(imageCaptionedName))
          .then(_ => imageCaptionedName)
          .catch(e => console.log(e))
        imageCaptioningPromises.push(imageCaptionPromise);
      }

      return Promise.all(imageCaptioningPromises);
    })
    .then(captions => {
      captions = captions.filter(item => item !== undefined);
      
      const FPS = 10;
      const encoder = new gifEncoder(gifDimensions.width, gifDimensions.height, {highWaterMark: 100 * 1024 * 1024});
      const outputImageName = `tmp/${fileName.replace(".gif", "-caption.gif")}`;

      const stream = pngFileStream(path.resolve(__dirname, "tmp", dirName, "*-caption.png"))
      .pipe(encoder.createWriteStream({
        repeat: 0,
        delay: 1000/FPS,
        quality: 10
      }))
      .pipe(fs.createWriteStream(outputImageName));
      return new Promise((resolve, reject) => {
        stream.on("finish", () => resolve(outputImageName));
        stream.on("error", reject);
      });
    });
}

app.use(cors());

app.get("/health", (req, res) => {
  getStatus().then(status => {
    console.log(status);
    res.send(status).status(200);
  }).catch(err => {
    console.log(err);
    res.send(err).status(500);
  });
});

app.get("/image/:image", (req, res) => {
  let file = path.resolve(__dirname, "tmp", req.params.image);
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
  let file = path.resolve(__dirname, "tmp", req.params.file + ".gif");
  addCaptionToImage(file, req.params.caption).then(file => {
    console.log("Sending image " + file);
    res.sendFile(path.resolve(__dirname, "tmp", req.params.file + "-caption.gif"));
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
