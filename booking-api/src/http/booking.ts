import { Express, Request, Response, NextFunction } from 'express';
import { BookRoomUsecase } from '../usecases/bookRoom';
import { GetUserBookingsUsecase } from '../usecases/getUserBookings';

interface SetBookingEndpointsArgs {
  server: Express;
  authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
  bookRoomUsecase: BookRoomUsecase;
  getUserBookingsUsecase: GetUserBookingsUsecase;
}

export function setBookingEndpoints(args: SetBookingEndpointsArgs) {
  const { server, authMiddleware, bookRoomUsecase, getUserBookingsUsecase } =
    args;

  server.get(
    '/booking/availability',
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

      let numSlot;
      try {
        numSlot = parseInt(slot, 10);
        if (numSlot < 0 || numSlot > 23) {
          res.status(400).json(paramError);
          return;
        }
      } catch (_) {
        res.status(400).json(paramError);
        return;
      }

      const resAvailability = await bookRoomUsecase.getAvailableRooms(numSlot);

      if (resAvailability.code === 'ERROR') {
        res.status(500).json({ error: 'Error while querying available rooms' });
        return;
      }
      res.status(200).send(resAvailability.availableRooms);
    }
  );

  server.post('/booking', authMiddleware, async (req, res) => {
    const user = req.authUser;
    if (user === undefined || user.id === undefined) {
      res.status(401).send();
      return;
    }
    const { slot, roomId } = req.body;
    const bookingResult = await bookRoomUsecase.bookRoom(user.id, roomId, slot);
    if (bookingResult.code === 'ERROR') {
      res.status(500).json({ error: 'Error while booking room' });
      return;
    }
    res.status(200).json({ message: 'Room booked successfully' });
  });

  server.get('/booking', authMiddleware, async (req, res) => {
    const user = req.authUser;
    if (user === undefined || user.id === undefined) {
      res.status(401).send();
      return;
    }
    const getBookingsResult = await getUserBookingsUsecase(user.id);
    if (getBookingsResult.code === 'ERROR') {
      res.status(500).json({ error: 'Error while getting bookings' });
      return;
    }
    res.status(200).json(getBookingsResult.bookings);
  });
}
