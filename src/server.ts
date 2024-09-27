import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';
import ShiftRoutes from './routes/ShiftRoutes'
import AuthRoutes from './routes/authRoutes'
import AdminRoutes from './routes/adminRoutes'
import ProfileRoutes from './routes/profileRoutes'
dotenv.config();
connectDB();
const app = express()
app.use(cors(corsConfig))
app.use(express.json())
app.use('/api/auth',AuthRoutes)
app.use('/api/dates',ShiftRoutes)
app.use('/api/admin',AdminRoutes)
app.use('/api/profile',ProfileRoutes)
export default app