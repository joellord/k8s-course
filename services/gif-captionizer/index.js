const express = require("express");
const path = require("path");
const fs = require("fs");
const gifFrames = require("gif-frames");
const imageSize = require("image-size");
const gifEncoder = require("gifencoder");
const pngFileStream = require("png-file-stream");
const jimp = require("jimp");

const config = require("./config");

const IMAGE_PATH = config.IMAGE_PATH || path.resolve(__dirname, "tmp");
const PORT = process.env.PORT || 4000;

const app = express();

function addCaptionToImage(image, caption) {
  console.log(`Adding ${caption} to ${image}`);
  let gifDimensions = imageSize(image);
  let fileName = image.substr(image.lastIndexOf("/")+1);
  let fileNameNoExt = fileName.replace(".gif", "");
  let dirName = fileNameNoExt.replace(/[^0-9a-f]/ig, "");

  if (!fs.existsSync(path.resolve(IMAGE_PATH, dirName))) {
    fs.mkdirSync(path.resolve(IMAGE_PATH, dirName));
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
        let frameImageName = `${IMAGE_PATH}/${dirName}/${dirName}-` + index + '.jpg';
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
      const outputImageName = `${IMAGE_PATH}/${fileName.replace(".gif", "-caption.gif")}`;

      const stream = pngFileStream(path.resolve(IMAGE_PATH, dirName, "*-caption.png"))
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

app.get("/:file/:caption", (req, res) => {
  console.log(`Getting ready to captionize ${req.params.file} with ${req.params.caption}.`);
  let file = path.resolve(IMAGE_PATH, req.params.file + ".gif");
  addCaptionToImage(file, req.params.caption).then(file => {
    console.log("Sending image " + file);
    res.sendFile(path.resolve(IMAGE_PATH, req.params.file + "-caption.gif"));
  });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));