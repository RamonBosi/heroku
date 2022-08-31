const express = require('express')
const routes = express.Router()
const { 
    createEndereco,
    pegarEndereco, 
    updateEndereco, 
    deleteEndereco 
} = require('../controllers/controllerEndereco')
const { estaAutenticado } = require('../Funcs')

routes.post('/usuario/:idUsuario/cadastrarEndereco', estaAutenticado, createEndereco)
routes.get('/usuario/:idUsuario/pegarEndereco/:idEndereco', estaAutenticado, pegarEndereco)
routes.put('/usuario/:idUsuario/atualizarEndereco/:idEndereco',estaAutenticado, updateEndereco)
routes.delete('/usuario/:idUsuario/deletarEndereco/:idEndereco',estaAutenticado, deleteEndereco)

module.exports = routes