import type { Request, Response } from "express";
import Date from "../models/DateModel";
export class ShiftController {
    static getDates = async (req:Request,res:Response) =>{
        res.send('Desde getDates')
    }
    static getDatesByDay = async (req:Request,res:Response) =>{
        try {
            const {dateDay} = req.params
            console.log(dateDay)
            const dates = await Date.find({date: dateDay})
            const timeAvaibles = dates.map(date=> date.time)
            res.json(timeAvaibles)
        } catch (error) {
            console.log(error)
        }
    }
    static getDateById =  async(req:Request,res:Response) =>{
        try {
            res.json(req.date)
        } catch (error) {
            console.log(error)
        }
    }
    static createDate =  async(req:Request,res:Response) =>{
        try {
            const date = new Date(req.body)
            date.clientId = req.user.id
            await date.save()
            res.send('Turno creado')
        } catch (error) {
            console.log(error)
        }
    }
    static updateDate = async (req:Request,res:Response) =>{
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
     static getDateByClientId = async (req:Request,res:Response) =>{
        try {
            const date = await Date.find({clientId: req.user?.id})
            if(date.length === 0){
                return res.send({date:'No tenes turno', time: '',_id:'',clientId:'',service:''})
            }
            res.json(date[0])
        } catch (error) {
            console.log(error)
        }
    }
    
}