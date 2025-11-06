import { Request, Response, NextFunction, Router } from 'express'

export const userRouter = Router()

// Login
userRouter.post('/login', (req: Request, res: Response) => {
    const { username, password }: { username: string, password: string } = req.body
})