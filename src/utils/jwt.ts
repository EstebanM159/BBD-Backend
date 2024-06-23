import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
type UserPayload = {
    id: Types.ObjectId
}
// el payload va a tener el id del usuario
export const generateJWT = (payload:UserPayload)=>{
    const secretOrPrivateKey = process.env.JWT_SECRET
    const token = jwt.sign(payload, secretOrPrivateKey!,{expiresIn: '180d'})
    return token
}