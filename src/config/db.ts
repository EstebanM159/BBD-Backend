import mongoose from 'mongoose'
import {exit} from  'node:process'
export const connectDB = async ()=>{
    try {
        const {connection} = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.host}:${connection.port}`
        console.log(`MongoDB conectado en : ${url}`)
    } catch (error) {
        console.log('Error al conectar a MongoDB', error)
        exit(1)
    }
}