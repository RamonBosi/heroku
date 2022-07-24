const db = require('../database')
const { naoExisteValoresVazios, serverResponse } = require('../Funcs/index')

async function selecionarDado(idUsuario, idEndereco){

    const sql = `SELECT * FROM enderecos WHERE usuario_id = $1 AND id = $2`
    const data = [idUsuario, idEndereco]

    const endereco = await db.query(sql, data)
    .then((resDb) => {return {error: false, rows: resDb.rows[0] || null }})
    .catch(() => {return {error: true}})

    return endereco

}

const controllerEndereco = {
    createEndereco(req,res){
        const { uf, cidade, rua, bairro } = req.body
        
        if(naoExisteValoresVazios(uf,cidade,rua,bairro)){
            
            const { idUsuario } = req.params

            const sql = 'INSERT INTO enderecos (uf, cidade, rua, bairro, usuario_id)VALUES ($1, $2, $3, $4, $5)'
            const data = [uf,cidade,rua,bairro,idUsuario]

            db.query(sql,data)
            .then(() => res.json(serverResponse('Endereço cadastrado com sucesso')))
            .catch(() => {
                res.json(serverResponse('Não foi possível cadastrar o endereço',true))
            })    
        }else{
            res.json(serverResponse('Preencha todos os campos',true))
        }
    },
    async updateEndereco(req,res){

        const reqData = req.body
        const { idUsuario, idEndereco } = req.params

        const endereco = await selecionarDado(idUsuario, idEndereco)

        if(endereco.error){
            res.json(serverResponse('Não foi possível atualizar',true))
        }else{
            
            if(endereco.rows){

                const { uf, cidade, rua, bairro } = {
                    ...endereco.rows,
                    ...reqData
                }
        
                if(naoExisteValoresVazios(uf, cidade, rua, bairro)){
        
                    const sql = `UPDATE enderecos SET uf = $1, cidade = $2, rua = $3, bairro = $4 WHERE usuario_id = $5 AND id = $6`
                    const data = [uf, cidade, rua, bairro, idUsuario,idEndereco]
        
                    db.query(sql,data)
                    .then(() => res.json(serverResponse('Endereço atualizado')))
                    .catch(() =>{
                        res.json(serverResponse('Não foi possível atualizar',true))
                    })
        
                }else{
                    res.json(serverResponse('Preencha todos os campos',true))
                }
            }else{
                res.json(serverResponse('Endereço não existe', true))
            }
        }
    },
    async deleteEndereco(req,res){
        const { idUsuario, idEndereco } = req.params

        const endereco = await selecionarDado(idUsuario,idEndereco)

        if(endereco.error){
            res.json(serverResponse('Não foi possível deletar, tente mais tarde',true))
        }else{

            if(endereco.rows){

                const sql = `DELETE FROM enderecos WHERE usuario_id = $1 AND id = $2`
                const data = [idUsuario, idEndereco]
        
                db.query(sql, data)
                .then(() => res.json(serverResponse('Endereço deletado')))
                .catch(()=> res.json(serverResponse('Não foi possível deletar',true)))
            }else{
                res.json(serverResponse('Endereço não existe',true))
            }
        }
    }
}

module.exports = controllerEndereco