import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import { connectDB } from './config/db';
import ShiftRoutes from './routes/ShiftRoutes'
import AuthRoutes from './routes/authRoutes'
import { corsConfig } from './config/cors';
dotenv.config()
connectDB()
const app = express();
app.use(cors(corsConfig))
app.use(express.json());
app.get('/', (req,res)=>{
    res.send('hello world')
})
app.use('/api/dates',ShiftRoutes)
app.use('/api/auth',AuthRoutes)
export default app