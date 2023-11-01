const knex = require("../database/knex")
const AppError = require("../utils/AppError") //importa biblioteca de erros



class OrcamentosController {
    async create(request, response) {
        const materiais = request.body;

        if (!Array.isArray(materiais)) {
            throw new AppError("O corpo da solicitação deve conter um array de materiais");
        }


        var repetidos = await knex("orcamentos")
            .select("N_PROJETO", "MATERIAL", "ORCADO")
            .whereIn(
                ["N_PROJETO", "MATERIAL", "ORCADO"],
                materiais.map(material => [material.N_PROJETO, material.MATERIAL, material.ORCADO]))
            .distinct()


        if (repetidos.length > 0) {
            repetidos = repetidos.map(repetido => repetido.N_PROJETO + " - " + repetido.MATERIAL + " - " + repetido.ORCADO)
            throw new AppError(`Já existem esses orçamentos: ${repetidos}`)
        }


        materiais.map(async (material) => {
            const { N_PROJETO, MATERIAL, ORCADO } = material

            await knex("orcamentos").insert({
                N_PROJETO, MATERIAL, ORCADO
            })
        })

        response.status(201).json();
    }

    async show(request, response) {

        const { N_PROJETO } = request.params;

        const material = await knex("orcamentos")
            .where({ N_PROJETO })

        if (material.length < 1) {
            throw new AppError(`A obra não foi encontrada`)
        }

        return response.status(200).json(material)

    }


    async index(request, response) {
        const { N_PROJETO, MATERIAL } = request.query

        var orcamento
        if (N_PROJETO && MATERIAL) {

            const filterCodigos = MATERIAL.split(",").map(material => material.trim())

            orcamento = await knex("orcamentos")
                .whereLike("N_PROJETO", `%${N_PROJETO}%`)
                .whereIn("MATERIAL", filterCodigos)

        } else if (N_PROJETO && !MATERIAL) {

            orcamento = await knex("orcamentos")
                .whereLike("N_PROJETO", `%${N_PROJETO}%`)

        } else if (!N_PROJETO && MATERIAL) {

            const filterCodigos = MATERIAL.split(",").map(material => material.trim())

            orcamento = await knex("orcamentos")
                .whereIn("MATERIAL", filterCodigos)

        } else {
            throw new AppError(`Não foram inseridas dados de pesquisa`)
        }

        response.status(200).json(orcamento)
    }

    async delete(request, response) {
        const { N_PROJETO } = request.params

        await knex("orcamentos").where({ N_PROJETO }).delete()

        return response.status(201).json(`O projeto ${N_PROJETO} foi deletado`)

    }
}


module.exports = OrcamentosController