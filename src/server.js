const express = require("express")

const app = express()

const port = 3000

app.listen(port, () => console.log(`O server está rodando na porta ${port}`))