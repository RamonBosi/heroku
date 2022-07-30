const express = require('express')
const routes = express.Router()
const { 
    createFormaPagamento, 
    updateFormaPagamento, 
    pegarFormaPagamento,
    deleteFormaPagamento 
} = require('../controllers/controllerFormaPagamento')
const { estaAutenticado } = require('../Funcs')

routes.post('/usuario/:idUsuario/cadastrarFormaPagamento',estaAutenticado, createFormaPagamento)
routes.get('/usuario/:idUsuario/pegarFormaPagamento/:idFormaPagamento',estaAutenticado, pegarFormaPagamento)
routes.put('/usuario/:idUsuario/atualizarFormaPagamento/:idFormaPagamento',estaAutenticado, updateFormaPagamento)
routes.delete('/usuario/:idUsuario/deletarFormaPagamento/:idFormaPagamento',estaAutenticado, deleteFormaPagamento)

module.exports = routes