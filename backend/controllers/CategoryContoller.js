import db from '../db.js'
import Jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']

    if (token == null) return res.sendStatus(401)

    Jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

        if (err) return res.json({ message: "your token is no longer valid", logout: true })

        if (!err) {

            next()
        }
    })
}

export const getCategoriesNames = (req, res) => {
    db.collection('categories_names').find().toArray((err, response) => {
        res.status(200).json({ message: 'success', data: response })
        console.log('categories fetched sccessfully')
    })
}

export const getAllPins = (req, res) => {
    db.collection('categories').find().toArray((err, response) => {
        if (err) {
            res.status(404).json({ message: err })
            console.log(err)
        } else {
            res.status(200).json({ message: "Success", data: [...response] })
            console.log('get all');
        }
    })
}

export const getPinsRelatedToCategory = (req, res) => {
    db.collection('categories').find({ categoryId: req.params.categoryId }).toArray((err, response) => {
        if (err) {
            res.status(404).json({ message: err })
            console.log(err)
        } else {
            res.status(200).json({ message: "Success", data: response })
        }
    })
}

export const addNewPin = (req, res) => {
    db.collection('categories').insertOne(req.body, (error, response) => {
        if (error) {
            res.status(400).json({ error })
        } else {
            res.status(200).json({ response })
        }
    })
}

export const getOnePin = (req, res) => {
    db.collection('categories').findOne({ _id: req.params.pinId }).then(response => {
        res.status(200).json({ message: 'success', data: response })
    }).catch(err => {
        res.status(404).json({ message: err })
    })
}

export const addComment = (req, res) => {
    db.collection('categories').findOne({ _id: req.params.pinId }).then(response => {
        db.collection('categories').findOneAndUpdate({ _id: req.params.pinId }, { $set: { comments: [...response.comments, req.body] } }).then(() => {
            res.status(200).json({ message: "comment added successfully" })
        })
    })
}

export const deleteComment = (req, res) => {
    db.collection('categories').findOne({ _id: req.params.pinId }).then(response => {
        let newCommentsArray = response.comments.filter(comment => {
            return comment.commentData._id !== req.params.commentId
        })
        db.collection('categories').findOneAndUpdate({ _id: req.params.pinId }, { $set: { comments: [...newCommentsArray] } }).then(response => {
            res.send('test')
        })
    })
}

export const editComment = (req, res) => {
    const {newComment} = req.body
    db.collection('categories').findOne({ _id: req.params.pinId }).then(response => {
        let newCommentsArray = response.comments.map(comment => {
            if(comment.commentData._id === req.params.commentId){
                return {commentData : {...comment.commentData, comment : newComment}}
            }
            return comment
        })
        db.collection('categories').findOneAndUpdate({ _id: req.params.pinId }, { $set: { comments: [...newCommentsArray] } }).then(response => {
            res.send('test')
        })
    })
}

export const deletePost = (req, res) => {
    
    db.collection('categories').deleteOne({ _id: req.params.pinId }).then(response => {
        if(response.deletedCount)
            return res.status(200).json({ message: response })
        res.status(500).json("Intsernal Server Error")
    })
}

export const savePost = (req, res) => {
    db.collection('categories').findOne({ _id: req.params.pinId }).then(response => {
        db.collection('categories').findOneAndUpdate({ _id: req.params.pinId }, { $set: { savedBy: [...response.savedBy, { _id: req.params.userId }] } }).then(() => {
            res.status(200).json({ message: "success" })
        }).catch(err => res.status(500).json({ message: "failed", err: err }))
    }).catch(err => res.status(500).json({ message: "failed", err: err }))
}

export const unSavePost = (req, res) => {
    db.collection('categories').findOne({ _id: req.params.pinId }).then(response => {
        db.collection('categories').findOneAndUpdate({ _id: req.params.pinId }, {
            $set: {
                savedBy: response.savedBy.filter(el => {
                    return el._id !== req.params.userId
                })
            }
        }).then(() => {
            res.status(200).json({ message: "success" })
        }).catch(err => res.status(500).json({ message: "failed", err: err }))
    }).catch(err => res.status(500).json({ message: "failed", err: err }))
}

export const getCreatedPins = (req, res) => {
    db.collection('categories').find({ "createdBy._id": req.params.userId }).toArray((err, response) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: err })
        } else {
            res.status(200).json({ message: 'success', data: response })
        }
    })
}

export const getSavedPins = (req, res) => {
    // db.inventory.find( { dim_cm: { $elemMatch: { $gt: 22, $lt: 30 } } } )
    db.collection('categories').find({ savedBy: { $elemMatch: { _id: req.params.userId } } }).toArray((err, response) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: err })
        } else {
            res.status(200).json({ message: 'success', data: response })
        }
    })
}

export const setPostFeel = (req, res) => {
    db.collection('categories').findOne({ _id: req.params.pinId }).then(response => {
        let feelExists = response.feelingBy.find(item => {
            return item._id === req.params.userId
        })
        if (feelExists) {
            db.collection('categories').findOneAndUpdate({ _id: req.params.pinId }, {
                $set: {
                    feelingBy: response.feelingBy.map(item => {
                        if (item._id === req.params.userId) return { _id: req.params.userId, feel: req.body.feel }
                        return item
                    })
                }
            }).then(() => {
                res.status(200).json({ message: "success" })
            }).catch(err => res.status(500).json({ message: "failed", err: err }))
        } else {
            db.collection('categories').findOneAndUpdate({ _id: req.params.pinId }, { $set: { feelingBy: [...response.feelingBy, { _id: req.params.userId, feel: req.body.feel }] } }).then(() => {
                res.status(200).json({ message: "success" })
            }).catch(err => res.status(500).json({ message: "failed", err: err }))
        }
    }).catch(err => res.status(500).json({ message: "failed", err: err }))
}

export const clearPostFeel = (req, res) => {
    db.collection('categories').findOne({ _id: req.params.pinId }).then(response => {
        db.collection('categories').findOneAndUpdate({ _id: req.params.pinId }, {
            $set: {
                feelingBy: response.feelingBy.filter(el => {
                    return el._id !== req.params.userId
                })
            }
        }).then(() => {
            res.status(200).json({ message: "success" })
        }).catch(err => res.status(500).json({ message: "failed", err: err }))
    }).catch(err => res.status(500).json({ message: "failed", err: err }))
}

export const getPinsWithPagenation = (req, res) => {
    const {searchTerm, existedPins, categoryId, savedBy, createdBy, currentPage } = req.query
    const perPage = 10

    let query = null
    if (searchTerm){
        query = {title :{$regex : `.*${searchTerm}.*`}}
    }else if (savedBy) {
        query = { savedBy: { $elemMatch: { _id: savedBy } } }
    } else if (createdBy) {
        query = { "createdBy._id": createdBy }
    } else if (categoryId) {
        query = { categoryId: categoryId.toLowerCase() }
    }



    db.collection('categories').countDocuments().then(DocsCount => {
        if (DocsCount)
            db.collection('categories').find(query).sort({ $natural: -1 }).limit(perPage).skip(Number(existedPins)).toArray((err, response) => {
                if (err) {
                    res.status(404).json({ message: err })
                    console.log(err)
                } else {
                    res.status(200).json({ message: "Success", data: [...response], total: DocsCount, to: Math.ceil(DocsCount / perPage), currentPage })
                }
            })

    })
}

export const getPins = async (req, res) => {
    const {searchTerm, pageNum = 1, categoryId, savedBy, createdBy } = req.query
    const perPage =5
    let query = null

    if (searchTerm){
        query = {$or:[
            {title :{$regex : `.*${searchTerm.toLowerCase()}.*`}},
            {about :{$regex : `.*${searchTerm.toLowerCase()}.*`}}
        ]}
    }else if(savedBy) {
        query = { savedBy: { $elemMatch: { _id: savedBy } } }
    } else if (createdBy) {
        query = { "createdBy._id": createdBy }
    } else if (categoryId) {
        query = { categoryId: categoryId.toLowerCase() }
    }

    console.log({query})

    let DocsCount
    let pins

    if(query){
        DocsCount = await db.collection('categories').aggregate([
            { $match: query },
            { $count : "total"},
        ]).toArray() 
    
        pins = await db.collection('categories').aggregate([
            { $match: query },
            { $skip: perPage * (pageNum - 1)},
            { $limit: perPage },
        ]).toArray()
    }else{
        DocsCount = await db.collection('categories').aggregate([
            { $count : "total"},
        ]).toArray() 
    
        pins = await db.collection('categories').aggregate([
            { $skip: perPage * (pageNum - 1)},
            { $limit: perPage },
        ]).toArray()

    }

    let total = DocsCount[0]? DocsCount[0].total : 0
    let pageNumber = Number(pageNum)
    let to = Math.ceil((total/perPage))

    if (pins) {
        let resData = {
            pins,
            total,
            to,
            currentPage : pageNumber,
            nextPage : pageNumber == to? undefined : pageNumber + 1,
            prevPage : pageNumber === 1 ? undefined : pageNumber - 1
        }
        res.status(200).json({...resData,message : "SUCCESS", status : 200})
    } else {
        res.status(500).json({messgae : "Internal Server Error", status : 500})
    }

}

