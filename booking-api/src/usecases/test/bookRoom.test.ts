import { buildBookRoomUsecase, BookRoomUsecase } from '../bookRoom';
import { Booking } from '../../repositories/booking';
import { Room } from '../../repositories/room';

let bookRoomUsecase: BookRoomUsecase;

const rooms: Room[] = [
  {
    id: 'roomId1',
    name: 'P01',
    company: 'Pepsi',
  },
  {
    id: 'roomId2',
    name: 'C01',
    company: 'Coca Cola',
  },
];

describe('BookRoomUsecase', () => {
  beforeEach(() => {
    const bookings: Booking[] = [];
    const mockBookingRepository = {
      async create(booking: Booking): Promise<void> {
        const existingBooking = bookings.find(
          (b) => b.roomId === booking.roomId && b.slot === booking.slot
        );
        if (existingBooking) {
          throw new Error('Booking already added');
        }
        bookings.push(booking);
      },
      async get(id: string): Promise<Booking | undefined> {
        return bookings.find((b) => b.id === id);
      },
      async getAvailableRooms(slot: number): Promise<Room[]> {
        return rooms.filter(
          (r) =>
            bookings.find((b) => b.roomId === r.id && b.slot === slot) ===
            undefined
        );
      },
    };
    bookRoomUsecase = buildBookRoomUsecase({
      bookingRepository: mockBookingRepository,
    });
  });

  describe('When no reservations have been made', () => {
    it('returns all rooms as available for a slot', async () => {
      const available = await bookRoomUsecase.getAvailableRooms(0);
      expect((available as any).availableRooms).toHaveLength(2);
    });
  });

  describe('When there is an existing reservation for a certain room/slot pair', () => {
    const tunedBookings = [{ roomId: 'roomId1', userId: 'userId1', slot: 0 }];
    const tunedMockBookingRepository = {
      async getAvailableRooms(slot: number): Promise<Room[]> {
        return rooms.filter(
          (r) =>
            tunedBookings.find((b) => b.roomId === r.id && b.slot === slot) ===
            undefined
        );
      },
    };
    const tunedBookRoomUsecase = buildBookRoomUsecase({
      bookingRepository: tunedMockBookingRepository as any,
    });

    it('returns just the available room as available', async () => {
      const availableResult = await tunedBookRoomUsecase.getAvailableRooms(0);
      expect(availableResult).toEqual({
        code: 'OK',
        availableRooms: [
          {
            id: 'roomId2',
            name: 'C01',
            company: 'Coca Cola',
          },
        ],
      });
    });
  });

  describe('When a reservation is made for an available room', () => {
    it('successfully completes the reservation', async () => {
      const reservationResult = await bookRoomUsecase.bookRoom(
        'roomId1',
        'userId1',
        0
      );
      expect(reservationResult).toEqual({ code: 'OK' });
    });
  });

  describe('When a reservation is made for an unavailable room', () => {
    it('returns an error', async () => {
      await bookRoomUsecase.bookRoom('userId1', 'roomId1', 0);
      const reservationResult = await bookRoomUsecase.bookRoom(
        'userId2',
        'roomId1',
        0
      );
      expect(reservationResult.code).toBe('ERROR');
    });
  });
});
