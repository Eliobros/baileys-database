require('dotenv').config()

const config = {
  dbType:  process.env.DB_TYPE    || 'mysql',
  session: process.env.DB_SESSION || 'default',

  mysql: {
    host:     process.env.MYSQL_HOST     || 'localhost',
    port:     process.env.MYSQL_PORT     || 3306,
    user:     process.env.MYSQL_USER     || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'baileys',
  },

  mongodb: {
    uri:      process.env.MONGO_URI      || 'mongodb://localhost:27017',
    database: process.env.MONGO_DATABASE || 'baileys',
  }
}

module.exports = { config }
