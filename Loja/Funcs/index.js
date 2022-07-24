const db = require('../database')

function naoExisteValoresVazios(...valores){
    const analisar = valores.every((valor) => valor)
    return analisar
}

function serverResponse(response,error = false){
    return {
        error,
        response
    }
}

function estaAutenticado(req,res,next){

    const { idUsuario } = req.params

    const sql = `SELECT ativo FROM usuarios WHERE id = $1`
    const data = [idUsuario]

    db.query(sql,data)
    .then((usuarioAtivo) =>{

        if(usuarioAtivo.rows.length){
            
            const ativo = usuarioAtivo.rows[0].ativo

            if(ativo){
                next()
            }else{
                res.json(serverResponse('Usuário não autenticado', true))
            }

        }else{
            res.json(serverResponse('Usuário não existe', true))
        }
    })
    .catch(() =>{
        res.json(serverResponse('Ocorreu um erro na verificação, tente mais tarde',true))
    })
}

module.exports = {
    naoExisteValoresVazios,
    estaAutenticado,
    serverResponse
}