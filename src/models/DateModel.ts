import mongoose,{Document, Schema, PopulatedDoc, Types} from "mongoose";
import { IUser } from "./UserModel";
export interface IDate extends Document{
    _id:Types.ObjectId,
    clientId:PopulatedDoc<IUser & Document>,
    date:string,
    time:string,
    service:string
}

const DateSchema: Schema = new Schema({
   
    clientId:{
        type:Types.ObjectId,
        ref:'User'
    },
    date:{
        type: String,
        required:true,
    },
    time:{
        type: String,
        required:true,
    },
    service:{
        type:String,
        required:true
    }

})
const Date = mongoose.model<IDate>('Date', DateSchema)
export default Date