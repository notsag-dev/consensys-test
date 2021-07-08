import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTableIfNotExists('users', function (table) {
      table
        .uuid('id')
        .notNullable()
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name').notNullable().index();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
