import mongoose,{Schema,Document, Types} from "mongoose";
export interface IUser extends Document {
    _id:Types.ObjectId
    email:string
    password:string
    userName:string
    picture:string
    facebook_id:string
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
    password:{
        type:String,
        default:null,
        trim:true

    },
    userName:{
        type:String,
        require:true,
    },
    picture:{
            data:{
                height:{
                    type:Number,
                    default:0
                },
                width:{
                    type:Number,
                    default:0
                },
                url:{
                    type:String,
                    trim:true,
                    default:''
                }
            }
    }
})

const User = mongoose.model<IUser>('User',UserSchema)
export default User