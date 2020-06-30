const config = {
  MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
  MYSQL_USER: process.env.MYSQL_USER || "root",
  MYSQL_PASS: process.env.MYSQL_PASS || "root",
  MYSQL_DB: process.env.MYSQL_DB || "images"
}

module.exports = config;