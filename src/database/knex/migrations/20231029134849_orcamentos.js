
exports.up = knex => knex.schema.createTable("orcamentos", table => {
    table.increments("id")
    table.text("N_PROJETO").notNullable()
    table.integer("MATERIAL").notNullable()
    table.double("ORCADO").notNullable()
    table.timestamp("DATA_INSERCAO").default(knex.fn.now())
});

exports.down = knex => knex.schema.dropTable("orcamentos");