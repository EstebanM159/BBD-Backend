import Router from 'express'
import {body, param} from 'express-validator'
import { ShiftController } from '../controllers/ShiftController'
import { handleInputErrors } from '../middlewares/validation'
import { dateExists } from '../middlewares/date'


const router = Router()

// Crear turno
router.post ('/new',
    body('clientName').isString().withMessage('El nombre del cliente es obligario'),
    body('date').isString().withMessage('El dia es obligatorio'),
    body('time').isString().withMessage('La hora es obligatoria'),
    body('service').isString().withMessage('El servicio es obligatorio'),
    handleInputErrors,
    ShiftController.createDate
)
router.put ('/:dateId/edit',
    dateExists,
    body('clientName').isString().withMessage('El nombre del cliente es obligario'),
    body('date').isString().withMessage('El dia es obligatorio'),
    body('time').isString().withMessage('La hora es obligatoria'),
    body('service').isString().withMessage('El servicio es obligatorio'),
    handleInputErrors,
    ShiftController.updateDate
)
router.delete ('/:dateId',
    dateExists,
    ShiftController.deleteDate
)
// traer turnos
router.get('/', ShiftController.getDates)
// react-facebook-login devuelve un objeto info del usuario
export default router