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
        if (user) {
            // In a real app do NOT return the password or sensitive fields
            const { password: _p, ...safeUser } = user as any
            return res.status(200).json({ message: 'Acceso concedido', user: safeUser })
        } else {
            return res.status(401).json({ message: 'Acceso denegado' })
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