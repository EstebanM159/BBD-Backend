import { Request,Response } from "express"
import Date from "../models/DateModel"
import { checkPassword, hashPassword } from "../utils"
import { generateJWT } from "../utils/jwt"
import User from "../models/UserModel"
export class AdminController {
    static getDateByDay = async (req:Request, res:Response) => {
        // const {dateString} = req.body
        // const dates = await Date.find({date:dateString})
        //                         .populate({path:'clientId', select:'_id userName picture'})
        const dates = await Date.find().sort({ date: -1, time:1}).populate({path:'clientId', select:'_id userName picture'})
        res.json(dates)
    }
    static deletePastAppointments = async (req:Request, res:Response) => {
        const {day, time} = req.body
        await Date.deleteMany({
            $or:[
                {
                    date:{$lt: day},
                },{
                    date: day,
                    time:{$lt: time},
                }
            ]
        })
        res.send('Turnos actualizados')
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
    static login = async (req:Request,res:Response)=>{
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            // verifico si existe el usuario
            if(!user){
                const error = new Error('Admin no registrado')
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
}