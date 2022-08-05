import express from 'express'
import {addComment,
    getCategoriesNames, 
    addNewPin,
    getOnePin,
    deletePost,
    deleteComment,
    savePost,
    unSavePost,
    getSavedPins,
    getCreatedPins,
    authenticateToken,
    setPostFeel,
    clearPostFeel,
    editComment,
    } from '../controllers/CategoryContoller.js'


const categoriesRouter = express.Router()

categoriesRouter.use(authenticateToken)


categoriesRouter.get('/names',getCategoriesNames )
categoriesRouter.post('/add-pin',addNewPin)
categoriesRouter.get('/get-one-pin/:pinId', getOnePin)
categoriesRouter.put('/:pinId/add-comment',addComment)
categoriesRouter.delete('/:pinId',deletePost)
categoriesRouter.put('/delete/:pinId/:commentId', deleteComment)
categoriesRouter.put('/edit/:pinId/:commentId', editComment)
categoriesRouter.put('/save/:pinId/:userId', savePost)
categoriesRouter.put('/unsave/:pinId/:userId', unSavePost)
categoriesRouter.get('/savedPins/:userId', getSavedPins)
categoriesRouter.get('/createdPins/:userId', getCreatedPins)
categoriesRouter.put('/setFeel/:pinId/:userId', setPostFeel)
categoriesRouter.put('/clearFeel/:pinId/:userId', clearPostFeel)

export default categoriesRouter