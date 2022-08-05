import express from 'express'
import { authenticateToken, getPins } from '../controllers/CategoryContoller.js'

const pinsRouter = express.Router()

pinsRouter.use(authenticateToken)


pinsRouter.get('/', getPins)


export default pinsRouter