import type { Request, Response } from "express";
import User from "../models/UserModel";
import { checkPassword, hashPassword } from "../utils";
import  jwt, { decode }  from "jsonwebtoken";
import { generateJWT } from "../utils/jwt";
import DateModel from "../models/DateModel";
import { AuthEmail } from "../emails/AuthEmail";
import { generateToken } from "../utils/token";
import Token from "../models/Token";

export class AuthController {

    static CreateAccountWithFacebook = async (req:Request, res:Response) => {
        try {
            const {email, id, name, picture} = req.body
            const userExists = await User.findOne({email})
            if(userExists){
                const error = new Error('El usuario ya esta registrado')
                return res.status(409).json({error : error.message})
            }
            const user = new User({
                email:email,
                facebook_id : id,
                userName: name,
                picture: picture.data.url
            })
            await user.save()
            res.send('Cuenta creada correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({error:'Hubo un error'})
        }
    }
    static createAccount = async (req:Request,res:Response)=>{
        try {
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
    static loginWithFacebook = async ( req:Request,res:Response)=>{
        try {
            const {email} = req.body
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('Usuario no registrado')
                return res.status(404).json({error : error.message})
            }
            const token = generateJWT({id:user._id})
            res.send(token)
        } catch (error) {
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
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect){
                const error = new Error('Contraseña incorrecta.')
                return res.status(401).json({error : error.message})
            }
            // Si los datos son correctos se genera el AUTH_TOKEN y lo devuelve
            const token = generateJWT({id:user._id})
            res.send(token)
            // Esto se consume en el frontend
        } catch (error) {
            console.log(error)
            res.status(500).json({error:'Hubo un error'})
        }
    }
    static createAccountWithGoogle = async (req:Request,res:Response)=>{
        const {credential} = req.body
        const decoded = jwt.decode(credential)
        if(decoded && typeof decoded === 'object' ){
            // Crear la cuenta
            const {email,name,sub,picture} = decoded
            const userExists = await User.findOne({email})
            if(userExists){
                const error = new Error('El usuario ya esta registrado')
                return res.status(409).json({error:error.message})
            }
            const user = new User({
                    userName: name,
                    email:email,
                    google_id:sub,
                    picture:picture
                })
            
            await user.save()
        }
        res.send('Cuenta creada correctamente')
    }
    static loginWithGoogle = async (req:Request,res:Response)=>{
        const {credential} = req.body
        const decoded = jwt.decode(credential)
        try {
            if(decoded && typeof decoded === 'object' ){
            const {email} = decoded
            const user = await User.findOne({email}) 
            if(!user){
                const error = new Error('Usuario no registrado')
                return res.status(404).json({error : error.message})
            }
            const token = generateJWT({id:user._id})
            res.send(token)
            }
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
    }
    static user = async (req:Request,res:Response)=>{
            // console.log(req.user)
             return res.json(req.user)
    }
    static forgotPassword = async (req:Request, res:Response) => {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            const error = new Error('Usuario no registrado')
            return res.status(404).json({error:error.message})
        }
        const token = new Token()
        token.token = generateToken()
        token.user=user.id
        await token.save()
        
        AuthEmail.sendPasswordResetToken({
                email:user.email,
                userName:user.userName,
                token: token.token,
                tokenId: token._id
        })
        res.send('Email enviado')
    }
    static validateToken = async (req:Request, res:Response) => {
        try {
            const {token,tokenId} = req.body
        const tokenExists = await Token.findOne({token})
        if(!tokenExists){
            const error = new Error('Token no valido')
            return res.status(404).json({error:error.message}) 
        }
        if(tokenExists._id.toString() !== tokenId.toString()){
            const error = new Error('Token no valido')
            return res.status(401).json({error:error.message}) 
        }
        res.send('Token valido, Define tu nueva contraseña')
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
            
        }
    }
    static updatePasswordWithToken = async (req:Request, res:Response) => {
        try {
            const {token} = req.params
            const {password} = req.body
            // Verifico que el token existe
            const tokenExists = await Token.findOne({token})
            if(!tokenExists){
                const error = new Error('Token no valido')
                return res.status(401).json({error : error.message})
            }
            // Busco el usuario
            const user = await User.findById(tokenExists.user)
            // Hasheo password
            user.password = await hashPassword(password)
            // Guardo la contraseña y borro el token
            await Promise.allSettled([user.save(),tokenExists.deleteOne()])
            res.send('La contraseña se modificó correctamente')
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
    }
    static deleteAccount = async (req:Request,res:Response) =>{
        try {
            await req.user.deleteOne()
            res.send('Usuario Eliminado')
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
    }
    
}