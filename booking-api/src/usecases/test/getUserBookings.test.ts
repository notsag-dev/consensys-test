import {
  buildGetUserBookingsUsecase,
  GetUserBookingsUsecase,
} from '../getUserBookings';
import { Booking } from '../../repositories/booking';
import { Room } from '../../repositories/room';

let getUserBookingsUsecase: GetUserBookingsUsecase;

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

describe('GetUserBookingsUsecase', () => {
  beforeEach(() => {
    const bookings: Booking[] = [
      { userId: 'userId1', roomId: 'roomId1', slot: 0 },
    ];
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
      async getUserBookings(userId: string): Promise<Booking[]> {
        return bookings.filter((b) => b.userId === userId);
      },
    };
    getUserBookingsUsecase = buildGetUserBookingsUsecase({
      bookingRepository: mockBookingRepository,
    });
  });

  describe('When no reservations have been made for that user', () => {
    it('returns a successful result with no bookings', async () => {
      const bookings = await getUserBookingsUsecase('userId2');
      expect(bookings).toEqual({ code: 'OK', bookings: [] });
    });
  });

  describe('When a reservation has been made for that user', () => {
    it('returns a successful result with that booking', async () => {
      const bookings = await getUserBookingsUsecase('userId1');
      expect(bookings).toEqual({
        code: 'OK',
        bookings: [{ userId: 'userId1', roomId: 'roomId1', slot: 0 }],
      });
    });
  });

  describe('When there is an error while querying bookings', () => {
    const mockThrowsBookingRepository = {
      async getUserBookings(_: string): Promise<Booking[]> {
        throw new Error('Test error');
      },
    };
    const getUserBookingsUsecaseThrows = buildGetUserBookingsUsecase({
      bookingRepository: mockThrowsBookingRepository as any,
    });

    it('returns an error result', async () => {
      const bookings = await getUserBookingsUsecaseThrows('userId1');
      expect(bookings.code).toBe('ERROR');
    });
  });
});
