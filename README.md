# baileys-database

Persistência de sessão para [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) usando **MySQL** ou **MongoDB**.

## Instalação

```bash
npm install baileys-database
```

Instala também o driver do banco que vais usar:

```bash
npm install mysql2     # para MySQL
npm install mongodb    # para MongoDB
```

---

## Configuração

Copia o `.env.example` para `.env` e preenche os valores:

```bash
cp .env.example .env
```

```env
DB_TYPE=mysql
DB_SESSION=default

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=baileys

MONGO_URI=mongodb://localhost:27017
MONGO_DATABASE=baileys
```

---

## Uso

### Automático via `.env`

```js
const makeWASocket = require('@whiskeysockets/baileys').default
const { useDatabaseAuthState } = require('baileys-database')

const { state, saveCreds } = await useDatabaseAuthState()

const sock = makeWASocket({ auth: state })
sock.ev.on('creds.update', saveCreds)
```

### Passando só o tipo

```js
const { state, saveCreds } = await useDatabaseAuthState('mongodb')
```

### Controlo total manual

```js
const { state, saveCreds } = await useDatabaseAuthState('mysql', {
  host: 'localhost',
  user: 'root',
  password: 'secret',
  database: 'baileys',
  session: 'meu-bot',
})
```

---

## Múltiplos bots

Usa o campo `session` para separar bots no mesmo banco:

```js
const bot1 = await useDatabaseAuthState('mysql', { ...config, session: 'bot-1' })
const bot2 = await useDatabaseAuthState('mysql', { ...config, session: 'bot-2' })
```

---

## API

### `useDatabaseAuthState(dbType?, config?)`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `dbType` | `'mysql' \| 'mongodb'` | Tipo de banco. Opcional se definido no `.env` |
| `config` | `object` | Configuração do banco. Opcional se definido no `.env` |

**Retorna:** `{ state, saveCreds, db }`

| Retorno | Descrição |
|---------|-----------|
| `state` | Auth state para passar ao `makeWASocket` |
| `saveCreds` | Função para passar ao evento `creds.update` |
| `db` | Adapter do banco para operações manuais |

---

## Licença

MIT
