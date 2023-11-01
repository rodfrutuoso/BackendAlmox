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
        const { PROJETO } = request.params;

        const material = await knex("movimentacoes")
            .select(["movimentacoes.PROJETO","movimentacoes.CODIGO", "listaMateriais.DESCRICAO"])
            .sum("movimentacoes.QTD as MOVIMENTADO")
            .select(knex.raw("listaMateriais.VALOR_UND * movimentacoes.QTD as VALOR_TOTAL"))
            .where({ PROJETO })
            .innerJoin("listaMateriais", "listaMateriais.CODIGO", "movimentacoes.CODIGO")

        if (material.length < 1) {
            throw new AppError(`A obra não foi encontrada`)
        }

        return response.status(200).json(material)
    }


    async index(request, response) {


        response.status(200).json()
    }


}


module.exports = MovimentacoesController