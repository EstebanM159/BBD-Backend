import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import User,{IUser} from '../models/UserModel'

declare global {
    namespace Express{
        interface Request{
            user?:IUser
        }
    }
}

export const authenticate = async (req:Request,res:Response, next:NextFunction) => {
    const palabra = process.env.JWT_SECRET

    const bearer = req.headers.authorization
    if(!bearer){
        const error = new Error('No esta autorizado para ingresar a esta sección')
        return res.status(401).json({error:error.message})
    }
    const [,token] = bearer.split(' ')
    try {
        const decoded = jwt.verify(token, palabra)
        if(typeof decoded === 'object' && decoded.id){
            const user = await User.findById(decoded.id).select('_id userName email picture')
            if(user){
                req.user = user
                next()
            }else{
                res.status(500).json({error:'Token no valido'})
            }
        }
    } catch (error) {
        res.status(500).json({error:'Token no valido'})
    }
}