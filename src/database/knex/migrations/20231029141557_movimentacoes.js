
exports.up = knex => knex.schema.createTable("movimentacoes", table => {
    table.increments("id")
    table.text("PROJETO").notNullable()
    table.integer("CODIGO").notNullable()
    table.double("QTD").notNullable()
    table.text("OBS")
    table.timestamp("DATA_LIBERACAO_STR").default(knex.fn.now())
});

exports.down = knex => knex.schema.dropTable("movimentacoes");