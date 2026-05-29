const { BufferJSON } = require('@whiskeysockets/baileys')

function serialize(data) {
  return JSON.stringify(data, BufferJSON.replacer)
}

function deserialize(raw) {
  if (!raw) return null
  return JSON.parse(raw, BufferJSON.reviver)
}

module.exports = { serialize, deserialize }
