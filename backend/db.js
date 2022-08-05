import app from './app.js'
import { MongoClient } from 'mongodb'
const uri = process.env.MONGO_DB_URL
const port = process.env.PORT || 4000
const client = new MongoClient(uri, { useUnifiedTopology: true} );

client.connect(err =>{
    if(err){
        console.log(err);
    }else{
        app.listen(port)
    }
})

export default client.db()