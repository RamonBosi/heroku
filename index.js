require('dotenv').config()
const express = require('express')
const cors = require('cors')

const port = process.env.PORT || 3000

const app = express()

app.use(cors())

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req,res) =>{
    res.json({message: process.env.VARIAVEL_AMBIENTE})
})

app.post('/postHeroku',(req, res) =>{

    const reqData = req.body
    res.json(reqData)
})

app.listen(port)