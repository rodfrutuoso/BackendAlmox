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
        const { CODIGO } = request.params;

        const material = await knex("listaMateriais")
            .where({ CODIGO })

        if (material.length < 1) {
            throw new AppError(`O material não foi encontrado`)
        }

        return response.status(200).json(material)
    }


    async index(request, response) {
        const { DESCRICAO, CODIGO } = request.query

        var materiais
        if (DESCRICAO && CODIGO) {

            const filterCodigos = CODIGO.split(",").map(codigo => codigo.trim())

            materiais = await knex("listaMateriais")
                .whereLike("DESCRICAO", `%${DESCRICAO}%`)
                .whereIn("CODIGO", filterCodigos)

        } else if (DESCRICAO && !CODIGO) {

            materiais = await knex("listaMateriais")
                .whereLike("DESCRICAO", `%${DESCRICAO}%`)

        } else if (!DESCRICAO && CODIGO) {

            const filterCodigos = CODIGO.split(",").map(codigo => codigo.trim())

            materiais = await knex("listaMateriais")
                .whereIn("CODIGO", filterCodigos)

        } else {
            throw new AppError(`Não foram inseridas dados de pesquisa`)
        }


        response.status(200).json(materiais)
    }

    async update(request, response) {
        var { CODIGO, DESCRICAO, TIPO, UNIDADE, VALOR_UND } = request.body
        const {id} = request.params

        const material = await knex("listaMateriais")
            .where({id})
        
        if(material.length < 1){
            throw new AppError(`Material não encontrado`)
        }

        CODIGO = CODIGO ?? material.CODIGO
        DESCRICAO = DESCRICAO ?? material.DESCRICAO
        TIPO = TIPO ?? material.TIPO
        UNIDADE = UNIDADE ?? material.UNIDADE
        VALOR_UND = VALOR_UND ?? material.VALOR_UND

        await knex("listaMateriais")
        .where({id})
        .update({ CODIGO, DESCRICAO, TIPO, UNIDADE, VALOR_UND })


        return response.status(201).json("material atualizado")

    }
}


module.exports = ListaMateriaisController