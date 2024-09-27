import mongoose,{Schema,Document, Types} from "mongoose";
export interface IUser extends Document {
    _id:Types.ObjectId
    email:string
    password:string
    userName:string
    picture:string
    role:string
    facebook_id:string
    google_id:string
    phone:number
}

const UserSchema : Schema = new Schema({
    email:{
        type:String,
        require:true,
        lowercase:true,
        trim:true,
        unique:true
    },
    facebook_id:{
        type:String,
        default:null
    },
    google_id:{
        type:String,
        default:null
    },
    phone:{
        type:Number,
        default:null
    },
    password:{
        type:String,
        default:null,
        trim:true

    },
    role:{
        type:String,
        default:'client'
    },
    userName:{
        type:String,
        require:true,
    },
    picture:{
        type:String,
        trim:true,
        default:''
    }
})

const User = mongoose.model<IUser>('User',UserSchema)
export default User