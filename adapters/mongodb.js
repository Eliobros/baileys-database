const { MongoClient } = require('mongodb')
const { serialize, deserialize } = require('../utils/serialize')

async function createMongoAdapter(config) {
  const client = new MongoClient(config.uri || 'mongodb://localhost:27017')
  await client.connect()

  const db = client.db(config.database || 'baileys')
  const session = config.session || 'default'
  const authCol = db.collection('baileys_auth')

  await authCol.createIndex({ session: 1, key: 1 }, { unique: true })

  async function readAuth(key) {
    const doc = await authCol.findOne({ session, key })
    return doc ? deserialize(doc.value) : null
  }

  async function writeAuth(key, value) {
    await authCol.updateOne(
      { session, key },
      { $set: { value: serialize(value) } },
      { upsert: true }
    )
  }

  async function removeAuth(key) {
    await authCol.deleteOne({ session, key })
  }

  async function close() {
    await client.close()
  }

  return { readAuth, writeAuth, removeAuth, close }
}

module.exports = createMongoAdapter
