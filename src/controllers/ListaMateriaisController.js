const knex = require("../database/knex")
const AppError = require("../utils/AppError") //importa biblioteca de erros



class ListaMateriaisController {
    async create(request, response) {

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