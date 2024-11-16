import type { Request, Response } from "express";
import User from "../models/UserModel";
import { checkPassword, hashPassword } from "../utils";

export class ProfileController {

    static changePassword = async (req:Request, res:Response) => {
        try {
            const {currentPassword, newPassword} = req.body
            // Busco el usuario
            const user = await User.findById(req.user._id)
            if(user.password === null){
                const error = new Error('No necesita contraseña.')
                return res.status(401).json({error : error.message})
            }
            const isPasswordCorrect = await checkPassword(currentPassword, user.password)
            if(!isPasswordCorrect){
                const error = new Error('Contraseña actual incorrecta.')
                return res.status(401).json({error : error.message})
            }
            // Hasheo password
            user.password = await hashPassword(newPassword)
            // Guardo la contraseña y borro el token
            await Promise.allSettled([user.save()])
            res.send('La contraseña se cambió correctamente')
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
    }
      static updateProfile = async (req:Request, res:Response) => {
        // agregar telefono
       try {
            const {userName,email, phone} = req.body
            const userExists = await User.findOne({email})
            if(userExists && userExists._id.toString() !== req.user.id.toString() ){
                const error = new Error('Este email ya esta registrado')
                return res.status(401).json({message:error.message})
            }
            req.user.userName = userName
            req.user.email = email
            req.user.phone = phone
            await req.user.save()
            res.send('Perfil actualizado correctamente')
       } catch (error) {
        res.status(500).json({error:'Hubo un error'})
       }
      }
    
}