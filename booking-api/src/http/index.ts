import { Express, Request, Response, NextFunction } from 'express';
import { RoomRepository } from '../repositories/room';
import { BookingRepository } from '../repositories/booking';
import { UserRepository } from '../repositories/user';

interface SetEndpointsParams {
  server: Express;
  roomRepository: RoomRepository;
  bookingRepository: BookingRepository;
  userRepository: UserRepository;
  authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
}

export function setEndpoints(params: SetEndpointsParams) {
  const { server, roomRepository, bookingRepository, authMiddleware } = params;

  server.get('/rooms', authMiddleware, async (_: Request, res: Response) => {
    const rooms = await roomRepository.getAll();
    res.status(200).send(rooms);
  });

  server.get(
    '/rooms/availability',
    authMiddleware,
    async (req: Request, res: Response) => {
      const { slot } = req.query;
      const paramError = {
        error:
          'Pass "slot" as a query string parameter with value from 0 to 23',
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
    }
  );

  server.post('/rooms/book', authMiddleware, async (req, res) => {
    const user = req.authUser;
    if (user === undefined || user.id === undefined) {
      res.status(401).send();
      return;
    }
    const { slot, roomId } = req.body;
    try {
      await bookingRepository.create({ userId: user.id, roomId, slot });
    } catch (error) {
      res.status(500).json({ error: 'error while booking room' });
      return;
    }
    res.status(200).json({ message: 'Room booked successfully' });
  });
}
