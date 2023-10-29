//importando do express
const { Router } = require("express")

//importa o controle de usuario
const ListaMateriaisController = require("../controllers/ListaMateriaisController")

//variavel com o método/controller
const listaMateriaisController = new ListaMateriaisController()

//inicializa as rotas
const listaMateriaisRoutes = Router()

//método post
listaMateriaisRoutes.post("/", listaMateriaisController.create)
listaMateriaisRoutes.get("/", listaMateriaisController.show)
listaMateriaisRoutes.get("/", listaMateriaisController.index)
listaMateriaisRoutes.put("/",listaMateriaisController.update)

module.exports = listaMateriaisRoutes;