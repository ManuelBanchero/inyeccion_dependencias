import { getDBConnection } from './db.js'

async function createTable() {

    const db = await getDBConnection()
    await db.run(`CREATE TABLE user (id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL)`)

    await db.close()
    console.log('table created')
}

createTable()