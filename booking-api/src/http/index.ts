import { Express } from 'express';
import { setEndpoints as setBookingEndpoints } from './booking';
import { RoomRepository } from '../repositories/room';
import { BookingRepository } from '../repositories/booking';
import { UserRepository } from '../repositories/user';

interface SetEndpointsParams {
  server: Express;
  roomRepository: RoomRepository;
  bookingRepository: BookingRepository;
}

export function setEndpoints(params: SetEndpointsParams) {
  const { server, roomRepository, bookingRepository } = params;

  server.get('/rooms', async (req, res) => {
    const rooms = await roomRepository.getAll();
    return rooms;
  });

  server.get('/rooms/availability', async (req, res) => {
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
}
