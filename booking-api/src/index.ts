import dotenv from 'dotenv';
import path from 'path';
import { connectToDatabase, getDatabase } from './adapters/database';
import express from 'express';
import { setEndpoints } from './http';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

async function init(): Promise<void> {
  initDb();
}

function initDb() {
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

init();

const server = express();
setEndpoints(server);

server.listen(5000);
