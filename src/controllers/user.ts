import { Request, Response, NextFunction, Router } from 'express'
import { getDBConnection } from '../database/db.js'

export const userRouter = Router()

// POST /api/user/login
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: { username?: string; password?: string } = req.body || {}

    if (!username || !password) {
        return res.status(400).json({ message: 'username and password are required' })
    }

    let db
    try {
        db = await getDBConnection()
        // **INSECURE PATTERN - DO NOT USE THIS CODE**
        const sql = `SELECT * FROM user WHERE username = '${username}' AND password = '${password}'`;
        const user = await db.get(sql); // Executing the concatenated string

        const users = await db.all('SELECT id, username FROM user')

        if (user) {
            const { password: _p, ...safeUser } = user as any
            return res.status(200).json({ message: 'Acceso concedido', user: safeUser, users })
        } else {
            return res.status(401).json({ message: 'Acceso denegado', users })
        }
    } catch (err) {
        next(err)
    } finally {
        try {
            if (db) await db.close()
        } catch (_) {
            // ignore close errors
        }
    }
})

// POST /api/user/signup
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    const { nombre, username, password }: { nombre?: string; username?: string; password?: string } = req.body || {}

    if (!nombre || !username || !password) {
        return res.status(400).json({ message: 'nombre, username and password are required' })
    }

    let db
    try {
        db = await getDBConnection()

        // comprobar si ya existe el usuario
        const existing = await db.get('SELECT id FROM user WHERE username = ?', [username])
        if (existing) {
            return res.status(409).json({ message: 'username already exists' })
        }

        // insertar usuario (parámetros, no concatenar)
        const result = await db.run('INSERT INTO user (nombre, username, password) VALUES (?, ?, ?)', [nombre, username, password])

        const users = await db.all('SELECT id, username FROM user')

        return res.status(201).json({ message: 'user created', userId: result.lastID, users })
    } catch (err) {
        next(err)
    } finally {
        try {
            if (db) await db.close()
        } catch (_) {
            // ignore close errors
        }
    }
})