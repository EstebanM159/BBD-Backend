import type { Request, Response } from "express";
import Date from "../models/DateModel";
export class ShiftController {
    static getDates = async (req:Request,res:Response) =>{
        res.send('Desde getDates')
    }
    static createDate =  async(req:Request,res:Response) =>{
        const date = new Date(req.body)
        try {
            await date.save()
            res.send('Turno creado')
        } catch (error) {
            console.log(error)
        }
    }
    static updateDate = async (req:Request,res:Response) =>{
        // Lo busco con el middleware
        req.date.clientName = req.body.clientName
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
}