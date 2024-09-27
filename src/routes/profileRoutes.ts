import Router from 'express'
import {body, param } from 'express-validator'
import { handleInputErrors } from '../middlewares/validation'
import { authenticate } from '../middlewares/auth'
import { ProfileController } from '../controllers/ProfileController'
const router = Router()
router.put('/change-password', 
    authenticate,
    body('currentPassword').isLength({min:8}).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
    body('newPassword').isLength({min:8}).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
    body('newPassword_confirmation').custom((value,{req})=>{
        if(value !== req.body.newPassword){
            throw new Error('Las contraseñas deben ser iguales')
        }
        return true
    }),
    handleInputErrors,
    ProfileController.changePassword
)
router.put('/update-profile',
    authenticate,
    body('userName').notEmpty().withMessage('El nombre es obligatorio'),
    // body('phone').isNumeric().withMessage('El telefono debe ser un numero'),
    body('email').isEmail().withMessage('Email no valido'),
    handleInputErrors,
    ProfileController.updateProfile
)
export default router
// router.post('/validate-token', 
//     AuthController.validateToken)
//     router.post('/update-password/:token',
//     param('token').isNumeric().withMessage('token no valido'),
//     body('password').isLength({min:8}).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
//     body('password_confirmation').custom((value,{req})=>{
//         if(value !== req.body.password){
//             throw new Error('Las contraseñas deben ser iguales')
//         }
//         return true
//     }),
//     handleInputErrors,
//     AuthController.updatePasswordWithToken
// ) 