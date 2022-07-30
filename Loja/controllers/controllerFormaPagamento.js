const db = require('../database')
const { naoExisteValoresVazios, serverResponse } = require('../Funcs')

async function selecionarDado(idUsuario, idFormaPagamento){

    const sql = `SELECT * FROM formas_pagamentos WHERE usuario_id = $1 AND id = $2`
    const data = [idUsuario, idFormaPagamento]

    const formaPagamento = await db.query(sql, data)
    .then((resDb) => {return {error: false, rows: resDb.rows[0] || null }})
    .catch(() => {return {error: true}})

    return formaPagamento

}

const controllerFormaPagamento = {
    createFormaPagamento(req,res){

        const { tipoPagamento } = req.body
        
        if(naoExisteValoresVazios(tipoPagamento)){
            
            const { idUsuario } = req.params

            const sql = 'INSERT INTO formas_pagamentos (tipo_pagamento, usuario_id) VALUES ($1, $2)'
            const data = [tipoPagamento, idUsuario]

            db.query(sql,data)
            .then(() => res.json(serverResponse('Forma de pagamento cadastrada com sucesso')))
            .catch(() => {
                res.json(serverResponse('Não foi possível cadastrar a forma de pagamento',true))
            })    
        }else{
            res.json(serverResponse('Preencha todos os campos',true))
        }
    },
    async pegarFormaPagamento(req,res){
        const { idUsuario,idFormaPagamento } = req.params    
    
        const formaPagamento = await selecionarDado(idUsuario,idFormaPagamento)

        if(formaPagamento.error){
            res.json(serverResponse('Algo deu errado, tente mais tarde',true))
        }else{
            res.json(serverResponse(formaPagamento.rows))
        }

    },
    async updateFormaPagamento(req,res){

        const { tipoPagamento } = req.body
        
        if(naoExisteValoresVazios(tipoPagamento)){
            
            const { idUsuario, idFormaPagamento } = req.params

            const sql = `UPDATE formas_pagamentos SET tipo_pagamento = $1 WHERE usuario_id = $2 AND id = $3`
            const data = [tipoPagamento, idUsuario, idFormaPagamento]

            db.query(sql,data)
            .then(() => res.json(serverResponse('Forma de pagamento atualizada')))
            .catch(() =>{
                res.json(serverResponse('Não foi possível atualizar',true))
            })

        }else{
            res.json(serverResponse('Preencha todos os campos',true))
        }
    },
    deleteFormaPagamento(req,res){
        const { idUsuario, idFormaPagamento } = req.params

        const sql = `DELETE FROM formas_pagamentos WHERE usuario_id = $1 AND id = $2`
        const data = [idUsuario, idFormaPagamento]

        db.query(sql, data)
        .then(() => res.json(serverResponse('Forma de pagamento deletada')))
        .catch(()=>{
            res.json(serverResponse('Não foi possível deletar',true))
        })
    }
}

module.exports = controllerFormaPagamento