import type { Request, Response } from "express";
import User from "../models/UserModel";
import { checkPassword, hashPassword } from "../utils";
import { generateJWT } from "../utils/jwt";

export class AuthController {
    static CreateAccountWithFacebook = async (req:Request, res:Response) => {
        try {
            const {email, id} = req.body
            console.log(id)
            const userExists = await User.findOne({email})
            if(userExists){
                const error = new Error('El usuario ya esta registrado')
                return res.status(409).json({error : error.message})
            }
            const user = new User(req.body)
            user.facebook_id = id
            await user.save()
            res.send('Cuenta creada correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({error:'Hubo un error'})
        }
    }
    static createAccount = async (req:Request,res:Response)=>{
        try {
            console.log(req.body)
            const {password, email} = req.body
            const userExists = await User.findOne({email})
            if(userExists){
                const error = new Error('El usuario ya esta registrado')
                return res.status(409).json({error:error.message})
            }
            const user = new User(req.body)
            user.password = await hashPassword(password)
            await user.save()
            res.send('Cuenta creada correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({error:'Hubo un error'})
        }
    }
    static login = async (req:Request,res:Response)=>{
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            // verifico si existe el usuario
            if(!user){
                const error = new Error('Usuario no registrado')
                return res.status(404).json({error : error.message})
            }
            // Verifico si tiene contraseña
            if(password){
                const isPasswordCorrect = await checkPassword(password, user.password)
                if(!isPasswordCorrect){
                    const error = new Error('Password incorrecto.')
                    return res.status(401).json({error : error.message})
                }
            }
            // // Si los datos son correctos se genera el AUTH_TOKEN y lo devuelve
            // const token = generateJWT({id:user._id})
            // // Esto se consume en el frontend
            // res.send(token)
        } catch (error) {
            console.log(error)
            res.status(500).json({error:'Hubo un error'})
        }
    }
}