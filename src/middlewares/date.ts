import type {Request, Response, NextFunction} from 'express'
import Date, {IDate} from '../models/DateModel'
declare global {
    namespace Express{
        interface Request{
            date: IDate
        }
    }
}

export async function dateExists(req:Request, res:Response, next:NextFunction) {
    try {
        const {dateId} = req.params
        const date = await Date.findById(dateId)
        if(!date){
            const error = new Error('Turno no encontrado')
            return res.status(404).json({error: error.message})
        }
        req.date = date
        next()
    } catch (error) {
        console.log(error)
    }
}