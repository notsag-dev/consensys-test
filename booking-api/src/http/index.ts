import { Express, Request, Response } from 'express';
import { setEndpoints as setBookingEndpoints } from './booking';
import { RoomRepository } from '../repositories/room';
import { BookingRepository } from '../repositories/booking';
import { UserRepository } from '../repositories/user';
import { getSaltedHash } from '../lib/auth';

interface SetEndpointsParams {
  server: Express;
  roomRepository: RoomRepository;
  bookingRepository: BookingRepository;
  userRepository: UserRepository;
}

export function setEndpoints(params: SetEndpointsParams) {
  const { server, roomRepository, bookingRepository, userRepository } = params;

  server.get('/rooms', async (req: Request, res: Response) => {
    const rooms = await roomRepository.getAll();
    res.status(200).send(rooms);
  });

  server.get('/rooms/availability', async (req: Request, res: Response) => {
    const { slot } = req.query;
    const paramError = {
      error: 'Pass "slot" as a query string parameter with value from 0 to 23',
    };
    if (slot === undefined || typeof slot !== 'string') {
      res.status(400).json(paramError);
      return;
    }
    const numSlot = parseInt(slot, 10);
    if (numSlot < 0 || numSlot > 23) {
      res.status(400).json(paramError);
      return;
    }
    const freeRooms = await bookingRepository.getAvailableRooms(numSlot);
    res.status(200).send(freeRooms);
  });

  server.post('/rooms/book', async (req: Request, res: Response) => {
    const userId = '1'; // TODO get actual user got in middleware when ready
    const user = await userRepository.get(userId);
    if (!user) {
      res.status(401).send();
      return;
    }

    const { slot, roomId } = req.body;
    try {
      await bookingRepository.create({ userId, roomId, slot });
    } catch (error) {
      res.status(500).json({ error: 'error while booking room' });
      return;
    }

    res.status(200).json({ message: 'Room booked successfully' });
  });

  server.post('/register', async (req: Request, res: Response) => {
    // TODO owasp-password-strength-test
    const { username, password, name } = req.body;

    if (
      username === undefined ||
      password === undefined ||
      name === undefined
    ) {
      res.status(400).json({
        error:
          'One or more required param is undefined: username, password, name',
      });
    }

    const existingUser = await userRepository.getByUsername(username);
    if (existingUser !== undefined) {
      res.status(400).json({ error: 'Username already taken' });
    }

    const saltedHashPassword = getSaltedHash(password, 'test-consensys');
    userRepository.create({ username, password: saltedHashPassword, name });
  });
}
