import express from "express";



import {addNewUser,getUserProfileImage} from '../controllers/UserContoller.js'
import {authenticateToken,getPins} from '../controllers/CategoryContoller.js'


const userRouter = express.Router()

userRouter.post('/addUser',addNewUser)
userRouter.get('/getUserProfileImage/:userId',authenticateToken, getUserProfileImage)

export default userRouter