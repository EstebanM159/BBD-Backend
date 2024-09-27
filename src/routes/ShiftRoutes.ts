import Router from 'express'
import {body, param } from 'express-validator'
import { ShiftController } from '../controllers/ShiftController'
import { handleInputErrors } from '../middlewares/validation'
import { dateExists } from '../middlewares/date'
import { authenticate } from '../middlewares/auth'
import { hasDate } from '../middlewares/hasDate'


const router = Router()
// Obtener turnos
router.param('dateId',dateExists)
// Obtener turno por id
router.get('/',
    authenticate,
    handleInputErrors,
    ShiftController.getDateByClientId
)
// Crear turno
router.post ('/new',
    authenticate,
    hasDate,
    body('date').isString().withMessage('El dia es obligatorio'),
    body('time').isString().withMessage('La hora es obligatoria'),
    body('service').isString().withMessage('El servicio es obligatorio'),
    handleInputErrors,
    ShiftController.createDate
)
router.put ('/:dateId/edit',
    authenticate,
    dateExists,
    body('date').isString().withMessage('El dia es obligatorio'),
    body('time').isString().withMessage('La hora es obligatoria'),
    body('service').isString().withMessage('El servicio es obligatorio'),
    handleInputErrors,
    ShiftController.updateDate
)
router.get('/times-avaibles/:dateDay',
    ShiftController.getDatesByDay
)
router.get('/:dateId',
    param('dateId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    ShiftController.getDateById
)
router.delete ('/:dateId',
    handleInputErrors,
    ShiftController.deleteDate
)
// traer turnos
// router.get('/',
//     authenticate,
//      ShiftController.getDates)
export default router