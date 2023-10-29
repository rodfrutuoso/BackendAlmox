const knex = require("../database/knex")
const AppError = require("../utils/AppError") //importa biblioteca de erros



class ListaMateriaisController {
    async create(request, response) {
        const { CODIGO, DESCRICAO, TIPO, UNIDADE, VALOR_UND } = request.body

        const jaExiste = await knex("listaMateriais")
            .where({ CODIGO })

        if (jaExiste.length > 0) {
            throw new AppError("Já existe um material com esse código")
        }

        

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