const db = require('../database')
const { naoExisteValoresVazios, serverResponse } = require('../Funcs')

async function existeUsuario(id){

    const sql = `SELECT id FROM usuarios WHERE id = $1`
    const data = [id]
    
    const user = await db.query(sql, data)
    .then((user) => user.rows)
    .catch(() => [])
    
    return user.length ? true : false
   
}

async function pegarDadosRelacional(table,id){

    const sql = `SELECT * FROM ${table} WHERE usuario_id = $1`
    const data = [id]

    const result = await db.query(sql,data)
    .then((resDb) =>{return {
        error: false,
        rows: resDb.rows.length ? resDb.rows : null
    }})
    .catch(() => {return {error: true, rows: null}})

    return result
}

async function selecionarDado(table, id){

    const sql = `SELECT * FROM ${table} WHERE id = $1`
    const dataSql = [id]

    const data = await db.query(sql,dataSql)
    .then((resDb) => {return {error: false, rows: resDb.rows[0]}})
    .catch(() => {return {error: true}})

    return data
}

async function verificarEmailCpf(email, cpf){

    const sql = 'SELECT email,cpf FROM usuarios WHERE email = $1 OR cpf = $2'
    const dataSql = [email, cpf]

    const data = await db.query(sql,dataSql)
    .then((emailCpf) => emailCpf.rows)
    .catch(() => ['error'])

    return data.length ? true : false
}

const controllerUsuario = {
    async createUsuario(req,res){

        const { nome, cpf, email, senha } = req.body
    
        if(naoExisteValoresVazios(nome,cpf,email,senha)){

            const existeEmailCpf = await verificarEmailCpf(email, cpf)

            if(existeEmailCpf){
                res.json(serverResponse('Esse email ou cpf já estão sendo usados, escolha outros',true))
            }else{
                const sql = `INSERT INTO usuarios (nome, cpf, email, senha, ativo) VALUES ($1, $2, $3, $4, true)`
                const data = [nome, cpf, email, senha]
            
                db.query(sql,data)
                .then(() => res.json(serverResponse('Usuário cadastrado com sucesso')))
                .catch(() =>{
                    res.json(serverResponse('Não foi possível cadastrar', true))
                })
            }
        }else{
            res.json(serverResponse('Preencha todos os campos', true))
        }
    },
    async updateUsuario(req, res){
        const reqData = req.body
        
        const existeEmailCpf = await verificarEmailCpf(reqData.email,reqData.cpf)

        if(existeEmailCpf){
            res.json(serverResponse('Esse email ou cpf já estão sendo usados, escolha outros', true))
        }else{

            const { idUsuario } = req.params
            const selecionouDados = await selecionarDado('usuarios', idUsuario)
    
            if(selecionouDados.error){
                res.json(serverResponse('Não foi possível concluir a ação, tente mais tarde', true))
            }else{

                const { nome, cpf, email, senha } = {
                    ...selecionouDados.rows,
                    ...reqData
                }
    
                if(naoExisteValoresVazios(nome,cpf,email,senha)){
    
                    const sql = 'UPDATE usuarios SET nome = $1, cpf = $2, email = $3, senha = $4 WHERE id = $5'
                    const data = [nome, cpf, email, senha, idUsuario]
    
                    db.query(sql, data)
                    .then(() => res.json(serverResponse('Usuário atualizado')))
                    .catch(() =>{
                        res.json(serverResponse('Não foi possível atualizar', true))
                    }) 
                    
                }else{
                    res.json(serverResponse('Preencha todos os campos', true))
                }  
            }
        }
    },
    async deleteUsuario(req,res){
        const { idUsuario } = req.params
        const usuarioExiste = await existeUsuario(idUsuario)
        
        if(usuarioExiste){
            
            const sql = 'DELETE FROM usuarios WHERE id = $1'
            const data = [idUsuario] 

            db.query(sql,data)
            .then(() => res.json(serverResponse('Usuário deletado')))
            .catch(() =>{
                res.json(serverResponse('Não foi possível deletar o usuário', true))
            })  
            
        }else{
            res.json(serverResponse('Usuário não existe', true))
        }
    },
    async pegarDadosUsuario(req,res){
        const { idUsuario } = req.params
       
        const usuario = await selecionarDado('usuarios', idUsuario)
        const enderecos = await pegarDadosRelacional('enderecos', idUsuario)
        const formasPagamentos = await pegarDadosRelacional('formas_pagamentos', idUsuario)

        const naoContemErro = [usuario.error,enderecos.error,formasPagamentos.error].every((err) => err === false)

        if(naoContemErro){

            const data = {
                usuario: usuario.rows,
                enderecos: enderecos.rows,
                formasPagamentos: formasPagamentos.rows
            }

            res.json(serverResponse(data))
        }else{
            res.json(serverResponse('Ocorreu algum erro na coleta dos dados, tente mais tarde',true))
        }
    },
    async dadosUsuario(req,res){
        const { idUsuario } = req.params

        const userData = await selecionarDado('usuarios', idUsuario)

        if(userData.error){
            res.json(serverResponse('Algo deu errado, tente mais tarde',true))
        }else{
            res.json(serverResponse(userData.rows))
        }

    },
    loginUsuario(req,res){

        const { email, senha } = req.body

        if(naoExisteValoresVazios(email,senha)){

            const sql = `SELECT id FROM usuarios WHERE email = $1 AND senha = $2`
            const data = [email, senha]

            db.query(sql,data)
            .then((usuario) => {

                const user = usuario.rows

                if(user.length ? true : false){
                    
                    const idUsuario = user[0].id

                    const auth = `UPDATE usuarios SET ativo = true WHERE id = $1`

                    db.query(auth, [idUsuario])
                    .then(() => res.json(serverResponse('Usuário logado')))
                    .catch(() =>{
                        res.json(serverResponse('Algo deu errado no processo de login, tente novamente mais tarde',true))
                    })
                }else{
                    res.json(serverResponse('Email ou senha foram digitados incorretamente, tente novamente', true))
                }
            })
            .catch(() =>{
                res.json(serverResponse('Algo deu errado, tente novamente mais tarde', true))
            })

        }else{
            res.json(serverResponse('Preencha todos os campos', true))
        }
    },
    logoutUsuario(req,res){
 
        const { idUsuario } = req.params

        const sql = `UPDATE usuarios SET ativo = false WHERE id = $1`
        const data = [idUsuario]

        db.query(sql,data)
        .then(() => res.json(serverResponse('Usuário deslogado')))
        .catch(() =>{
            res.json(serverResponse('Não foi possível deslogar, tente mais tarde',true))
        })
    }
}

module.exports = controllerUsuario