
exports.up = knex => knex.schema.createTable("listaMateriais", table => {
    table.increments("id")
    table.integer("CODIGO").notNullable()
    table.text("DESCRICAO").notNullable()
    table.text("TIPO")
    table.text("UNIDADE")
    table.double("VALOR_UND")
});

exports.down = knex => knex.schema.dropTable("listaMateriais");