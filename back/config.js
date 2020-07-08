const config = {
  MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
  MYSQL_USER: process.env.MYSQL_USER || "root",
  MYSQL_PASS: process.env.MYSQL_PASS || "root",
  MYSQL_DB: process.env.MYSQL_DB || "images",
  IMAGE_PATH: process.env.IMAGE_PATH || "/tmp",
  GIF_CAPTION_SVC: process.env.GIF_CAPTION_SVC || "localhost:4000"
}

module.exports = config;
