import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'express-jwt';
import { getDatabase, initDatabase } from './adapters/database';
import { setEndpoints } from './http';
import { buildBookingRepository } from './repositories/booking';
import { buildRoomRepository } from './repositories/room';
import { buildUserRepository } from './repositories/user';
import { buildRegisterUserUsecase } from './usecases/registerUser';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

initDatabase();

if (process.env.JWT_KEY === undefined) {
  throw new Error('Please set JWT key in .env file');
}
const authMiddleware = jwt({
  secret: process.env.JWT_KEY,
  algorithms: ['HS256'],
  requestProperty: 'authUser',
});

const bookingRepository = buildBookingRepository({ getDatabase });
const roomRepository = buildRoomRepository({ getDatabase });
const userRepository = buildUserRepository({ getDatabase });

if (process.env.PASSWORD_SALT === undefined) {
  throw new Error('Please set password salt in .env file');
}
const registerUserUsecase = buildRegisterUserUsecase({
  userRepository,
  passwordSalt: process.env.PASSWORD_SALT,
});

const server = express();
server.use(express.json());

setEndpoints({
  server,
  bookingRepository,
  roomRepository,
  userRepository,
  authMiddleware,
});

server.listen(5000, () => {
  console.log('Listening on port 5000');
});
