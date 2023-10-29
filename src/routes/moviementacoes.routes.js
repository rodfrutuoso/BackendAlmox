//importando do express
const { Router } = require("express")

//importa o controle de usuario
const MovimentacoesController = require("../controllers/MovimentacoesController")

//variavel com o método/controller
const movimentacoesController = new MovimentacoesController()

//inicializa as rotas
const movimentacoesRoutes = Router()

//método post
movimentacoesRoutes.post("/", movimentacoesController.create)
movimentacoesRoutes.get("/", movimentacoesController.show)
movimentacoesRoutes.get("/", movimentacoesController.index)

module.exports = movimentacoesRoutes;