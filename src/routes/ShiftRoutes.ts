import Router from 'express'
import {body, param} from 'express-validator'
import { ShiftController } from '../controllers/ShiftController'
import { handleInputErrors } from '../middlewares/validation'
import { dateExists } from '../middlewares/date'
import { authenticate } from '../middlewares/auth'


const router = Router()
// Obtener turnos

// Obtener turno por id
router.get('/',
    authenticate,
    handleInputErrors,
    ShiftController.getDateById
)
// Crear turno
router.post ('/new',
    authenticate,
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