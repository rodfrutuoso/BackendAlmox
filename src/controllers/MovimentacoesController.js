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
            .select(["movimentacoes.PROJETO", "movimentacoes.CODIGO", "listaMateriais.DESCRICAO", "movimentacoes.QTD", "movimentacoes.obs" , "movimentacoes.DATA_LIBERACAO_STR"])
            .select(knex.raw("listaMateriais.VALOR_UND * movimentacoes.QTD as VALOR_TOTAL"))
            .where({ PROJETO })
            .innerJoin("listaMateriais", "listaMateriais.CODIGO", "movimentacoes.CODIGO")

        if (material.length < 1) {
            throw new AppError(`A obra não foi encontrada`)
        }

        return response.status(200).json(material)
    }


    async index(request, response) {
        const { PROJETO, CODIGO } = request.query

        var movimentacao
        if (PROJETO && CODIGO) {

            const filterCodigos = CODIGO.split(",").map(material => material.trim())
            const filterProjetos = PROJETO.split(",").map(projeto => projeto.trim())

            movimentacao = await knex("movimentacoes")
                .select(["movimentacoes.PROJETO", "movimentacoes.CODIGO", "listaMateriais.DESCRICAO"])
                .sum("movimentacoes.QTD as ORÇADO")
                .select(knex.raw("listaMateriais.VALOR_UND * SUM(movimentacoes.QTD) as VALOR_TOTAL"))
                .whereIn("movimentacoes.PROJETO", filterProjetos)
                .whereIn("movimentacoes.CODIGO", filterCodigos)
                .innerJoin("listaMateriais", "listaMateriais.CODIGO", "movimentacoes.CODIGO")
                .groupBy(["movimentacoes.PROJETO", "movimentacoes.CODIGO"])

        } else if (PROJETO && !CODIGO) {

            const filterProjetos = PROJETO.split(",").map(projeto => projeto.trim())

            movimentacao = await knex("movimentacoes")
                .select(["movimentacoes.PROJETO", "movimentacoes.CODIGO", "listaMateriais.DESCRICAO"])
                .sum("movimentacoes.QTD as ORÇADO")
                .select(knex.raw("listaMateriais.VALOR_UND * SUM(movimentacoes.QTD) as VALOR_TOTAL"))
                .whereIn("movimentacoes.PROJETO", filterProjetos)
                .innerJoin("listaMateriais", "listaMateriais.CODIGO", "movimentacoes.CODIGO")
                .groupBy(["movimentacoes.PROJETO", "movimentacoes.CODIGO"])

        } else if (!PROJETO && CODIGO) {

            const filterCodigos = CODIGO.split(",").map(material => material.trim())

            movimentacao = await knex("movimentacoes")
                .select(["movimentacoes.PROJETO",
                    "movimentacoes.CODIGO",
                    "listaMateriais.DESCRICAO",
                    "movimentacoes.QTD",
                    knex.raw("listaMateriais.VALOR_UND * SUM(movimentacoes.QTD) as VALOR_TOTAL")])
                .innerJoin("listaMateriais", "listaMateriais.CODIGO", "movimentacoes.CODIGO")
                .whereIn("movimentacoes.CODIGO", filterCodigos)
                .groupBy(["movimentacoes.PROJETO", "movimentacoes.CODIGO"])

        } else {
            throw new AppError(`Não foram inseridas dados de pesquisa`)
        }

        response.status(200).json(movimentacao)

    }


}


module.exports = MovimentacoesController