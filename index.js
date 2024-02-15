require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./Routes/router')
require('./DB/connection')


const mrServer = express()

mrServer.use(cors())

mrServer.use(express.json())

mrServer.use(router)

mrServer.use('/upload',express.static('./upload'))

const PORT = 3010 || process.env.PORT

mrServer.listen(PORT,()=>{
    console.log(`Magic Recipe Server running on ${PORT} `);
})

mrServer.get('/',(req,res)=>{
    res.send('<h1> Magic Recipe Server is running... </h1>')
})