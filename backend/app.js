import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
config()


import userRouter from './routers/userRouter.js'
import categoriesRouter from './routers/categoriesRouter.js'
import pinsRouter from './routers/pinsRouter.js'

import http from 'http'
import { Server } from 'socket.io'


const app = express()
app.use(cors())



app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }))

app.use('/users', userRouter)
app.use('/categories', categoriesRouter)
app.use('/pins', pinsRouter)

app.get('/', (req,res) =>{res.send('Congrats')})

const server = http.createServer(app)

const io = new Server(server, { cors: { origin: '*' } });


// io.use((socket, next) => {
//     const username = socket.handshake.auth.username;
//     if (!username) {
//         return next(new Error("invalid username"));
//     }
//     socket.username = username;
//     next();
// });



let activeClients = []


io.on('connection', function (socket) {

    socket.on('storeClientInfo', function ({customId}) {
        for( var i=0; i<activeClients.length; ++i ){
            var c = activeClients[i];
            if(c.customId == customId){
                activeClients.splice(i,1);
                return
            }
        }
        activeClients.push({soketId : socket.id , customId})
    });
    
    socket.on('disconnect', function () {
        for( var i=0; i<activeClients.length; ++i ){
            var c = activeClients[i];
            if(c.soketId == socket.id){
                activeClients.splice(i,1);
                return
            }
        }
    });

    socket.on('sendNote', function ({ feel, icon ,from ,to}) {
        let targetUser = activeClients.filter(user =>{
            return user.customId == to
        })

        if(targetUser.length == 1){
            io.to(targetUser[0]['soketId']).emit('getNotification', {newNote : `${from} set ${feel} to your pin`,icon})
        }
    });
    
    
});

export default server