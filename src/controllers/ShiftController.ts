import type { Request, Response } from "express";
import DateModel from "../models/DateModel";
export class ShiftController {
    static getDatesByDay = async (req:Request,res:Response) =>{
        try {
            const {dateDay} = req.params
            const dates = await DateModel.find({date: dateDay})
            const timeAvaibles = dates.map(date=> date.time)
            res.json(timeAvaibles)
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
    }
    static getDateById =  async(req:Request,res:Response) =>{
        try {
            res.json(req.date)
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})

        }
    }
    static createDate =  async(req:Request,res:Response) =>{
        try {
            const date = new DateModel(req.body)
            date.clientId = req.user.id
            await date.save()
            res.send('Turno creado')
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})

        }
    }
    static updateDate = async (req:Request,res:Response) =>{
        // Verificar que el usuario que la creo sea el que esta editando
        if (req.date.clientId.toString() !== req.user._id.toString()){
            const error = new Error('No esta autorizado')
            return res.status(401).json({error:error.message})
        }
        console.log(req.body.date,req.body.time,req.body.service)
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
            res.status(500).json({error:'Hubo un error'})

        }
    }
     static getDateByClientId = async (req:Request,res:Response) =>{
        try {
            const date = await DateModel.find({clientId: req.user?.id})
            if(date.length === 0){
                return res.send({date:'No tenes turno', time: '',_id:'',clientId:'',service:''})
            }
            res.json(date[0])
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})

        }
    }
    
}