import type { Request, Response } from "express";
import User from "../models/UserModel";
import { hashPassword } from "../utils";

export class AuthController {
    static CreateAccountWithFacebook = async (req:Request, res:Response) => {
        try {
            console.log(req.body)
            const {name,email,id, picture} = req.body
            const userExists = await User.findOne({email})
            if(userExists){
                const error = new Error('El usuario ya esta registrado')
                return res.status(409).json({error : error.message})
            }
            const user = new User(req.body)
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
}