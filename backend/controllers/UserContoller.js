import db from '../db.js'
import Jwt from 'jsonwebtoken';


function generateAccessToken(userData) {
    return Jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: '168h' });
}

export const addNewUser = (req, res) => {
    const token  = generateAccessToken(req.body)
    db.collection('users').findOne({ _id: req.body._id }).then(response => {
        if (response) {
            /// user already found in the database
            res.status(200).json({ message: `welcom back to our Site ${response.name}`,token})
        } else {
            //user not found   => new user comms in
            db.collection('users').insertOne(req.body, (error, response) => {
                if (error) {
                    //error happend while trying to push the new user in the database
                    console.log("error is: " + error)
                    res.status(400).json({ error })
                } else {
                    // user added successfully
                    res.status(200).json({ message : response , token })
                }
            })
        }
    }).catch(error => {
        // error happend while trying to find user
        res.status(400).json({ error })
    })



}
export const getUserProfileImage = (req, res) => {
    db.collection('users').findOne({ _id: req.params.userId }).then(response => {
        res.status(200).json({ message: 'success', imageUrl: response.imageUrl })
    })
}

