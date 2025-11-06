import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

const __dirname = import.meta.dirname

export async function getDBConnection() {
    const dbPath = path.join(__dirname, 'database.db')
    return open({
        filename: dbPath,
        driver: sqlite3.Database
    })
} 