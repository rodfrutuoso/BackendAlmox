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

        let jaExiste = await knex("listaMateriais")
            .select("CODIGO")
            .whereIn("CODIGO", repetidos)

        jaExiste = jaExiste.map(codigo => codigo.CODIGO)

        if (jaExiste.length > 0) {
            throw new AppError(`Já existem materiais com esse os códigos ${jaExiste} `)
        }

        materiais.map(async (material) => {
            const { CODIGO, DESCRICAO, TIPO, UNIDADE, VALOR_UND } = material

            await knex("listaMateriais").insert({
                CODIGO, DESCRICAO, TIPO, UNIDADE, VALOR_UND
            })

        })

        console.log(jaExiste)

        // const { CODIGO, DESCRICAO, TIPO, UNIDADE, VALOR_UND } = request.body

        // const jaExiste = await knex("listaMateriais")
        //     .where({ CODIGO })

        // if (jaExiste.length > 0) {
        //     throw new AppError("Já existe um material com esse código")
        // }

        // await knex("listaMateriais").insert({
        //     CODIGO, DESCRICAO, TIPO, UNIDADE, VALOR_UND
        // })

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