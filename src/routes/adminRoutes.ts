import { Router } from "express";
import {body, param } from 'express-validator'
import { handleInputErrors } from '../middlewares/validation'
import { AdminController } from "../controllers/AdminController";
import { AuthController } from "../controllers/AuthController";
const router = Router()
router.get('/',
    AdminController.getAllDates
)
router.get('/:dateString',
    AdminController.getDatesByDay
)
router.post('/auth/create-account',
    body('userName').notEmpty().withMessage('El nombre es obligatorio'),
    body('password').isLength({min:8}).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
    body('password_confirmation').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Las contraseñas deben ser iguales')
        }
        return true
    }),
    body('email').isEmail().withMessage('Email no valido'),
    body('phone').isNumeric().withMessage('El telefono debe ser un numero'),
    handleInputErrors,
    AdminController.createAccount
)
router.post('/auth/login',
    body('email').isEmail().withMessage('Email no valido'),
    body('password').notEmpty().withMessage('La password no puede ir vacio'),
    handleInputErrors,
    AuthController.login
)
router.delete('/:dateString/:time/deletePastDates',
    AdminController.deletePastAppointments
)
router.delete('/:dateId',
    AdminController.deleteDate
)
export default router
