//importa o Router do express
const { Router } = require("express");

//rota para a rota do usuário
const  orcamentosRouter  = require("./orcamentos.routes");
const  movimentacoesRouter  = require("./moviementacoes.routes");
const  listaMateriaisRouter  = require("./listaMateriais.routes");

//insere a constante em um "app", nesse caso routes
const routes = Router();

//fala pra o aplicativo usar o arquivo users.routes.js pra acessar os métodos
routes.use("/orcamentos", orcamentosRouter);
routes.use("/movimentacoes", movimentacoesRouter);
routes.use("/listamateriais", listaMateriaisRouter);

// exporta as rotas
module.exports = routes;