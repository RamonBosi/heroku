const express = require('express')
const routes = express.Router()
const { 
    createUsuario, 
    deleteUsuario, 
    updateUsuario, 
    pegarDadosUsuario, 
    loginUsuario,
    logoutUsuario 
} = require('../controllers/controllerUsuario')
const { estaAutenticado } = require('../Funcs')

routes.post('/cadastrar', createUsuario)
routes.post('/login', loginUsuario)

routes.put('/:idUsuario/logout', estaAutenticado, logoutUsuario)
routes.get('/:idUsuario/pegarDados',estaAutenticado, pegarDadosUsuario)
routes.delete('/:idUsuario/deletar', estaAutenticado, deleteUsuario)
routes.put('/:idUsuario/atualizar', estaAutenticado, updateUsuario)

module.exports = routes