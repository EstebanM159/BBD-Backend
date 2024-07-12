import type { Request, Response } from "express";
import Date from "../models/DateModel";
export class ShiftController {
    static getDates = async (req:Request,res:Response) =>{
        res.send('Desde getDates')
    }
    static createDate =  async(req:Request,res:Response) =>{
        try {
            const date = new Date(req.body)
            date.clientId = req.user?.id
            await date.save()
            res.send('Turno creado')
        } catch (error) {
            console.log(error)
        }
    }
    static updateDate = async (req:Request,res:Response) =>{
        // Lo busco con el middleware
        // Verificar que el usuario que la creo sea el que esta editando
        req.date.date = req.body.date
        req.date.time = req.body.time
        req.date.service = req.body.service
        await req.date.save()
        res.send('Turno Actualizado')
    }
    static deleteDate = async (req:Request,res:Response) =>{
        try {
            await req.date.deleteOne()
            res.send('Turno eliminado')
        } catch (error) {
            console.log(error)
        }
    }
     static getDateById = async (req:Request,res:Response) =>{
        try {
            const date = await Date.find({clientId: req.user?.id})
            if(date.length === 0){
                return res.send({date:'No tenes turno', time: ''})
            }
            res.json({ date: date[0].date, time: date[0].time })
        } catch (error) {
            console.log(error)
        }
    }
    
}