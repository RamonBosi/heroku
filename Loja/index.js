if(!process.env.PRODUCTION_ENVIRONMENT){
    require('dotenv').config({path: './Loja/.env'})
}

const express = require('express')
const cors = require('cors')

const rotaUsuario = require('./routes/routeUsuario')
const rotaEndereco = require('./routes/routeEndereco')
const rotaFormaPagamento = require('./routes/routeFormaPagamento')

const port = process.env.PORT || 3100

const app = express()

app.use(cors())

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.use('/formaPagamento', rotaFormaPagamento)
app.use('/endereco', rotaEndereco)
app.use('/usuario', rotaUsuario)

app.listen(port)