require("express-async-errors") //Seta como requisito do server

const express = require("express")

const migrationsRun = require("./database/sqlite/migrations") //importa o arquivo do banco de dados

const AppError = require("./utils/AppError") //importa pasta que trata os erros

const routes = require("./routes")//importação das rotas. Já pega o index por padrão e a partir dele manda pro resto

const app = express()

app.use(express.json())//diz para o node que as informações vão vir em formato de json

app.use(routes) //direciona do server para a pasta de rotas

migrationsRun();//executa a função do index.js migrationsRun


app.use((error, request, response, next)=>{
    //se o tipo de erro estiver previsto dentro do arquivo AppError ele devolve ele
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }

    console.error(error)
    //caso não esteja previsto o erro ele devolve como erro do server
    return response.status(500).json({
        status: "error",
        message: "Erro interno do Servidor"
    })

})



const port = 3000

app.listen(port, () => console.log(`O server está rodando na porta ${port}`))