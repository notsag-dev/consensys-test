import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.table('rooms').insert([
    {
      name: 'P01',
      company: 'Pepsi',
    },
    {
      name: 'P02',
      company: 'Pepsi',
    },
    {
      name: 'P03',
      company: 'Pepsi',
    },
    {
      name: 'P04',
      company: 'Pepsi',
    },
    {
      name: 'P05',
      company: 'Pepsi',
    },
    {
      name: 'P06',
      company: 'Pepsi',
    },
    {
      name: 'P07',
      company: 'Pepsi',
    },
    {
      name: 'P08',
      company: 'Pepsi',
    },
    {
      name: 'P09',
      company: 'Pepsi',
    },
    {
      name: 'P10',
      company: 'Pepsi',
    },
    {
      name: 'C01',
      company: 'Coca Cola',
    },
    {
      name: 'C02',
      company: 'Coca Cola',
    },
    {
      name: 'C03',
      company: 'Coca Cola',
    },
    {
      name: 'C04',
      company: 'Coca Cola',
    },
    {
      name: 'C05',
      company: 'Coca Cola',
    },
    {
      name: 'C06',
      company: 'Coca Cola',
    },
    {
      name: 'C07',
      company: 'Coca Cola',
    },
    {
      name: 'C08',
      company: 'Coca Cola',
    },
    {
      name: 'C09',
      company: 'Coca Cola',
    },
    {
      name: 'C10',
      company: 'Coca Cola',
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  knex('rooms').delete();
}
