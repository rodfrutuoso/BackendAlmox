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
            .select(["orcamentos.id", "orcamentos.N_PROJETO",
                "orcamentos.MATERIAL",
                "listaMateriais.DESCRICAO",
                "orcamentos.ORCADO",
                knex.raw("listaMateriais.VALOR_UND * orcamentos.ORCADO as VALOR_TOTAL")])
            .where({ N_PROJETO })
            .innerJoin("listaMateriais", "listaMateriais.CODIGO", "orcamentos.MATERIAL")

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
                .select(["orcamentos.N_PROJETO", "orcamentos.MATERIAL", "listaMateriais.DESCRICAO"])
                .sum("orcamentos.ORCADO as ORÇADO")
                .select(knex.raw("listaMateriais.VALOR_UND * Sum(orcamentos.ORCADO) as VALOR_TOTAL"))
                .whereLike("N_PROJETO", `%${N_PROJETO}%`)
                .whereIn("orcamentos.MATERIAL", filterCodigos)
                .innerJoin("listaMateriais", "listaMateriais.CODIGO", "orcamentos.MATERIAL")
                .groupBy(["orcamentos.N_PROJETO", "orcamentos.MATERIAL"])

        } else if (N_PROJETO && !MATERIAL) {

            orcamento = await knex("orcamentos")
                .select(["orcamentos.N_PROJETO", "orcamentos.MATERIAL", "listaMateriais.DESCRICAO"])
                .sum("orcamentos.ORCADO as ORÇADO")
                .select(knex.raw("listaMateriais.VALOR_UND * Sum(orcamentos.ORCADO) as VALOR_TOTAL"))
                .whereLike("N_PROJETO", `%${N_PROJETO}%`)
                .innerJoin("listaMateriais", "listaMateriais.CODIGO", "orcamentos.MATERIAL")
                .groupBy(["orcamentos.N_PROJETO", "orcamentos.MATERIAL"])

        } else if (!N_PROJETO && MATERIAL) {

            const filterCodigos = MATERIAL.split(",").map(material => material.trim())

            orcamento = await knex("orcamentos")
                .select(["orcamentos.N_PROJETO",
                    "orcamentos.MATERIAL",
                    "listaMateriais.DESCRICAO",
                    "orcamentos.ORCADO",
                    knex.raw("listaMateriais.VALOR_UND * Sum(orcamentos.ORCADO) as VALOR_TOTAL")])
                .innerJoin("listaMateriais", "listaMateriais.CODIGO", "orcamentos.MATERIAL")
                .whereIn("orcamentos.MATERIAL", filterCodigos)
                .groupBy(["orcamentos.N_PROJETO", "orcamentos.MATERIAL"])

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