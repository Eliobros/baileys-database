const mysql = require('mysql2/promise')
const { serialize, deserialize } = require('../utils/serialize')

async function createMySQLAdapter(config) {
  const pool = mysql.createPool({
    host: config.host || 'localhost',
    port: config.port || 3306,
    user: config.user || 'root',
    password: config.password || '',
    database: config.database || 'baileys',
    waitForConnections: true,
    connectionLimit: 10,
  })

  const session = config.session || 'default'

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS baileys_auth (
      \`session\` VARCHAR(100) NOT NULL,
      \`key\`     VARCHAR(255) NOT NULL,
      \`value\`   LONGTEXT NOT NULL,
      PRIMARY KEY (\`session\`, \`key\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)

  async function readAuth(key) {
    const [rows] = await pool.execute(
      'SELECT `value` FROM `baileys_auth` WHERE `session` = ? AND `key` = ?',
      [session, key]
    )
    return rows.length ? deserialize(rows[0].value) : null
  }

  async function writeAuth(key, value) {
    await pool.execute(
      'INSERT INTO `baileys_auth` (`session`, `key`, `value`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
      [session, key, serialize(value)]
    )
  }

  async function removeAuth(key) {
    await pool.execute(
      'DELETE FROM `baileys_auth` WHERE `session` = ? AND `key` = ?',
      [session, key]
    )
  }

  async function close() {
    await pool.end()
  }

  return { readAuth, writeAuth, removeAuth, close }
}

module.exports = createMySQLAdapter
