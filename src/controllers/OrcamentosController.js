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
            repetidos = repetidos.map(repetido => repetido.N_PROJETO+" - "+ repetido.MATERIAL+" - "+ repetido.ORCADO)
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

        return response.status(200).json(repetidos)
    }


    async index(request, response) {


        response.status(200).json()
    }

    async delete(request, response) {


        return response.status(201).json()

    }
}


module.exports = OrcamentosController