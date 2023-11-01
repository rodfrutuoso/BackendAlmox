//importando do express
const { Router } = require("express")

//importa o controle de usuario
const OrcamentosController = require("../controllers/OrcamentosController")

//variavel com o método/controller
const orcamentosController = new OrcamentosController()

//inicializa as rotas
const orcamentosRoutes = Router()

//método post
orcamentosRoutes.post("/", orcamentosController.create)
orcamentosRoutes.get("/:N_PROJETO", orcamentosController.show)
orcamentosRoutes.delete("/:N_PROJETO", orcamentosController.delete)
orcamentosRoutes.get("/", orcamentosController.index)

module.exports = orcamentosRoutes;
