const { initAuthCreds, proto } = require('@whiskeysockets/baileys')
const createMySQLAdapter = require('./adapters/mysql')
const createMongoAdapter = require('./adapters/mongodb')
const { config } = require('./config/config')

async function useDatabaseAuthState(dbType, cfg) {
  // Se não passar nada, usa o .env automaticamente
  const resolvedType   = dbType || config.dbType
  const resolvedConfig = cfg    || { ...config[resolvedType], session: config.session }

  let adapter

  if (resolvedType === 'mysql') {
    adapter = await createMySQLAdapter(resolvedConfig)
  } else if (resolvedType === 'mongodb') {
    adapter = await createMongoAdapter(resolvedConfig)
  } else {
    throw new Error(`DB type inválido: "${resolvedType}". Use "mysql" ou "mongodb".`)
  }

  let creds = await adapter.readAuth('creds')
  if (!creds) {
    creds = initAuthCreds()
    await adapter.writeAuth('creds', creds)
  }

  const state = {
    creds,
    keys: {
      get: async (type, ids) => {
        const result = {}
        for (const id of ids) {
          const key = `${type}-${id}`
          let data = await adapter.readAuth(key)
          if (type === 'app-state-sync-key' && data) {
            data = proto.Message.AppStateSyncKeyData.fromObject(data)
          }
          result[id] = data
        }
        return result
      },
      set: async (data) => {
        for (const [type, ids] of Object.entries(data)) {
          for (const [id, value] of Object.entries(ids ?? {})) {
            const key = `${type}-${id}`
            if (value) {
              await adapter.writeAuth(key, value)
            } else {
              await adapter.removeAuth(key)
            }
          }
        }
      },
    },
  }

  async function saveCreds() {
    await adapter.writeAuth('creds', state.creds)
  }

  return { state, saveCreds, db: adapter }
}

module.exports = {
  useDatabaseAuthState,
  createMySQLAdapter,
  createMongoAdapter,
  config,
}
