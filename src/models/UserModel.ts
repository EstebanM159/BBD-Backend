import mongoose,{Document, Schema, PopulatedDoc, Types} from "mongoose";
export interface IUser extends Document {
    email:string
    password:string
    name:string
    pic:string
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
        unique:true,
        default:null
    },

    password:{
        type:String,
        default:null,
        trim:true

    },
    name:{
        type:String,
        require:true,
        
    },
    picture:{
            data:{
                height:{
                    type:Number
                },
                width:{
                    type:Number
                },
                url:{
                    type:String,
                    trim:true
                }
            }
    }
})

const User = mongoose.model<IUser>('User',UserSchema)
export default User