import type { Request,Response, NextFunction } from "express";
import Date from "../models/DateModel";
export async function hasDate (req:Request,res:Response,next:NextFunction){
    const date = await Date.find({clientId:req.user._id})
    console.log(date)
    if(date.length !== 0){
        const error = new Error('Ya posee un turno')
        return res.status(401).json({error:error.message})
    }
    next()
}