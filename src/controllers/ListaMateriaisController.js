const knex = require("../database/knex")
const AppError = require("../utils/AppError") //importa biblioteca de erros



class ListaMateriaisController {
    async create(request, response) {
        const materiais = request.body;

        if (!Array.isArray(materiais)) {
            throw new AppError("O corpo da solicitação deve conter um array de materiais");
        }

        var repetidos = []
        materiais.map(material => {
            repetidos.push(material.CODIGO)
        })

        try {
            var jaExiste = await knex("listaMateriais")
                .select("CODIGO")
                .whereIn("listaMateriais.CODIGO", repetidos)
        } catch (e) {
            throw new AppError(`o JSON não possui os parametros necessários`)
        }

        jaExiste = jaExiste.map(codigo => codigo.CODIGO)

        if (jaExiste.length > 0) {
            throw new AppError(`Já existem materiais com esse os códigos ${jaExiste}`)
        }

        materiais.map(async (material) => {
            const { CODIGO, DESCRICAO, TIPO, UNIDADE, VALOR_UND } = material

            await knex("listaMateriais").insert({
                CODIGO, DESCRICAO, TIPO, UNIDADE, VALOR_UND
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

    async update(request, response) {


        return response.status(201).json()

    }
}


module.exports = ListaMateriaisController