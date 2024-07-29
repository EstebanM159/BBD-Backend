import type { Request,Response, NextFunction } from "express";
import DateModel from "../models/DateModel";
export async function hasDate (req:Request,res:Response,next:NextFunction){
    const date = await DateModel.find({clientId:req.user._id})
    if(date.length !== 0){
        const error = new Error('Ya posee un turno')
        return res.status(401).json({error:error.message})
    }
    next()
}