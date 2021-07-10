import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { connectToDatabase, getDatabase } from './adapters/database';
import { setEndpoints } from './http';
import { buildBookingRepository } from './repositories/booking';
import { buildRoomRepository } from './repositories/room';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

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

initDb();
const bookingRepository = buildBookingRepository({ getDatabase });
const roomRepository = buildRoomRepository({ getDatabase });

const server = express();
setEndpoints({ server, bookingRepository, roomRepository });

server.use(express.json());
server.listen(5000, () => {
  console.log('Listening on port 5000');
});
