const knex = require("../database/knex")
const AppError = require("../utils/AppError") //importa biblioteca de erros



class MovimentacoesController {
    async create(request, response) {
        const materiais = request.body;

        if (!Array.isArray(materiais)) {
            throw new AppError("O corpo da solicitação deve conter um array de materiais");
        }



        materiais.map(async (material) => {
            const { PROJETO, CODIGO, QTD, OBS } = material

            await knex("movimentacoes").insert({
                PROJETO, CODIGO, QTD, OBS
            })
        })

        response.status(201).json();
    }

    async show(request, response) {

        return response.status(200).json()
    }


    async index(request, response) {


        response.status(200).json()
    }


}


module.exports = MovimentacoesController