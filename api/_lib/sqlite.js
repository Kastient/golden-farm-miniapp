import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import initSqlJs from 'sql.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..', '..')
const DATA_DIR = path.join(ROOT_DIR, 'data')
const DATABASE_PATH = path.join(DATA_DIR, 'leaderboard.sqlite')
const WASM_PATH = path.join(ROOT_DIR, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm')

const SCHEMA_SQL = `
  create table if not exists leaderboard_players (
    telegram_id text primary key,
    username text not null,
    coins real not null default 0,
    lifetime_collected real not null default 0,
    total_farms integer not null default 0,
    updated_at text not null
  );

  create index if not exists leaderboard_players_coins_idx
    on leaderboard_players (coins desc, updated_at asc);
`

let sqlPromise = null
let cachedDatabase = null

const getSqlJs = async () => {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({
      locateFile: () => WASM_PATH,
    })
  }

  return sqlPromise
}

const loadDatabase = async () => {
  if (cachedDatabase) {
    return cachedDatabase
  }

  const SQL = await getSqlJs()
  await fs.mkdir(DATA_DIR, { recursive: true })

  try {
    const file = await fs.readFile(DATABASE_PATH)
    cachedDatabase = new SQL.Database(file)
  } catch {
    cachedDatabase = new SQL.Database()
  }

  cachedDatabase.run(SCHEMA_SQL)
  return cachedDatabase
}

const persistDatabase = async (database) => {
  const bytes = database.export()
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(DATABASE_PATH, Buffer.from(bytes))
}

export const withDatabase = async (callback) => {
  const database = await loadDatabase()
  const result = await callback(database)
  await persistDatabase(database)
  return result
}

export const getDatabasePath = () => DATABASE_PATH
