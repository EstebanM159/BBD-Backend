import { Request,Response } from "express"
import DateModel from "../models/DateModel"
import { checkPassword, hashPassword } from "../utils"
import { generateJWT } from "../utils/jwt"
import User from "../models/UserModel"
export class AdminController {
    static getAllDates = async (req:Request, res:Response) => {
        
        const dates = await DateModel.find().sort({ date: 'asc', time:1}).populate({path:'clientId', select:'_id userName picture'})
        res.json(dates)
    }
    static getDatesByDay = async (req:Request, res:Response) => {
        const {dateString} = req.params
        const dates = await DateModel.find({date:dateString})
                                .sort({ date: 'asc', time:1})
                                .populate({path:'clientId', select:'_id userName picture'})
        res.json(dates)
    }
    static deletePastAppointments = async (req:Request, res:Response) => {
        const {dateString, time} = req.params
            const todayDate = new Date(dateString);
            const allAppointments = await DateModel.find({})
            // Filtrar y eliminar los turnos anteriores a la fecha actual
            const pastAppointments = allAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate < todayDate;
            });
            const deletePromises = pastAppointments.map(appointment =>
                DateModel.deleteOne({ _id: appointment._id })
            );
            await Promise.all(deletePromises);
            // await DateModel
            // console.log(todayDate)
        // await DateModel.deleteMany({
        //     $or:[
        //         {
        //             date:{$lt: dateString},
        //         },{
        //             date: dateString,
        //             time:{$lt: time},
        //         }
        //     ]
        // })
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
    static deleteDate = async (req:Request,res:Response)=>{
        const {dateId} = req.params
        const date = await DateModel.findById(dateId)
        if(!date){
            const error = new Error('No existe el turno')
            return res.status(404).json({error:error.message})
        }
        await DateModel.deleteOne({_id: date._id})
        res.status(200).send('Turno eliminado')
    }
}