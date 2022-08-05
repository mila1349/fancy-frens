import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/upload.js'

const app = express();
dotenv.config()

app.use(bodyParser.json({limit: "30mb", extended:true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended:true}));
app.use(cors())

app.use('/post', router);

const PORT = process.env.PORT || PORT;
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})