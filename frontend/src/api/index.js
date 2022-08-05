import axios from 'axios'
import { CreateInterseptor,CreateInterseptor2 } from './utils'

const server = 'http://localhost:4000'

const SHARE_ME = axios.create({
    baseURL: server,
    timeout: 20000,
})
const SHARE_ME2 = axios.create({
    baseURL: server,
    timeout: 20000,
})

CreateInterseptor(SHARE_ME)
CreateInterseptor2(SHARE_ME)


const api = {
    users : {
        create : (userDetails) =>{
            return (SHARE_ME2.post('/users/addUser',userDetails ))
        },
        getUserProfileImage: (userId) =>{
            return (SHARE_ME.get(`/users/getUserProfileImage/${userId}`))
        }
    },
    categories : {
        getCategoriesNames : () =>{
            return (SHARE_ME.get('/categories/names'))
        },
        addNewPin : (pinDetails) =>{
            return (SHARE_ME.post('/categories/add-pin',pinDetails))
        },
        getOnePin :(pinId) =>{
            return (SHARE_ME.get(`/categories/get-one-pin/${pinId}`))
        },
        addCommentToPin : (pinId,commentData) =>{
            return (SHARE_ME.put(`/categories/${pinId}/add-comment`,commentData))
        },
        deletePost : (pinId) =>{
            return (SHARE_ME.delete(`/categories/${pinId}`))
        },
        deleteComment : (pinId, commentId) =>{
            return (SHARE_ME.put(`/categories/delete/${pinId}/${commentId}`,{}))
        },
        editComment : (pinId, commentId,newComment) =>{
            return (SHARE_ME.put(`/categories/edit/${pinId}/${commentId}`,{newComment}))
        },
        savePost : (pinId,userId) =>{
            return (SHARE_ME.put(`/categories/save/${pinId}/${userId}`,{}))
        },
        unSavePost : (pinId,userId) =>{
            return (SHARE_ME.put(`/categories/unsave/${pinId}/${userId}`,{}))
        },
        getSavedPins: (userId) =>{
            return (SHARE_ME.get(`/categories/savedPins/${userId}`))
        },
        getCreatedPins: (userId) =>{
            return (SHARE_ME.get(`/categories/createdPins/${userId}`))
        },
        setFeel : (pinId,userId,feel) =>{
            return (SHARE_ME.put(`/categories/setFeel/${pinId}/${userId}`,{feel}))
        },
        clearFeel : (pinId,userId) =>{
            return (SHARE_ME.put(`/categories/clearFeel/${pinId}/${userId}`,{}))
        },
        getPins : ({categoryId='',createdBy='', savedBy='', searchTerm = '',pageNum = 1,cancelToken}) => {
            return (SHARE_ME.get(`/pins?categoryId=${categoryId}&createdBy=${createdBy}&savedBy=${savedBy}&pageNum=${pageNum}&searchTerm=${searchTerm}`,{
                cancelToken
            }))
        }
        

    },
}

export default api


