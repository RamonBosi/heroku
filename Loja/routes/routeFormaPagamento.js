const express = require('express')
const routes = express.Router()
const { 
    createFormaPagamento, 
    updateFormaPagamento, 
    deleteFormaPagamento 
} = require('../controllers/controllerFormaPagamento')
const { estaAutenticado } = require('../Funcs')

routes.post('/usuario/:idUsuario/cadastrarFormaPagamento',estaAutenticado, createFormaPagamento)
routes.put('/usuario/:idUsuario/atualizarFormaPagamento/:idFormaPagamento',estaAutenticado, updateFormaPagamento)
routes.delete('/usuario/:idUsuario/deletarFormaPagamento/:idFormaPagamento',estaAutenticado, deleteFormaPagamento)

module.exports = routes