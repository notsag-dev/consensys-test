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
    })
    .createTableIfNotExists('rooms', function (table) {
      table
        .uuid('id')
        .notNullable()
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('name').notNullable().index();
    })
    .createTableIfNotExists('bookings', function (table) {
      table
        .uuid('id')
        .notNullable()
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));
      table
        .uuid('userId')
        .notNullable()
        .index()
        .references('id')
        .inTable('users');
      table
        .uuid('roomId')
        .notNullable()
        .index()
        .references('id')
        .inTable('rooms');
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('bookings')
    .dropTable('users')
    .dropTable('rooms');
}
