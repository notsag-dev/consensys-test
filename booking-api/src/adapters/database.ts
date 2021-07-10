import knex from 'knex';

let database: any;

export function initDatabase() {
  if (
    process.env.POSTGRES_HOST === undefined ||
    process.env.POSTGRES_USER === undefined ||
    process.env.POSTGRES_PASSWORD === undefined ||
    process.env.POSTGRES_DB === undefined
  ) {
    throw new Error('Please set database configs in .env file');
  }

  console.log('Connecting to the database...');
  connectToDatabase();
  console.log('Successfully connected to the database.');
}

function connectToDatabase() {
  database = knex({
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    migrations: {
      tableName: 'migrations',
    },
    pool: { min: 0, max: 20 },
  });

  return database;
}

export function getDatabase() {
  if (!database) {
    database = connectToDatabase();
  }
  return database;
}
