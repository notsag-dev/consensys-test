import { Room } from '../repositories/room';
import { BookingRepository } from '../repositories/booking';

interface BuildBookRoomArgs {
  bookingRepository: BookingRepository;
}

type BookRoomResult =
  | {
      code: 'ERROR';
      message: string;
    }
  | {
      code: 'OK';
    };

type GetAvailableRoomsResult =
  | {
      code: 'ERROR';
      message: string;
    }
  | {
      code: 'OK';
      availableRooms: Room[];
    };

export interface BookRoomUsecase {
  bookRoom: (
    roomId: string,
    userId: string,
    slot: number
  ) => Promise<BookRoomResult>;
  getAvailableRooms: (slot: number) => Promise<GetAvailableRoomsResult>;
}

export function buildBookRoomUsecase(args: BuildBookRoomArgs): BookRoomUsecase {
  const { bookingRepository } = args;

  async function bookRoom(
    userId: string,
    roomId: string,
    slot: number
  ): Promise<BookRoomResult> {
    try {
      await bookingRepository.create({ userId, roomId, slot });
    } catch (_) {
      return {
        code: 'ERROR',
        message: 'Error while inserting booking into db',
      };
    }
    return {
      code: 'OK',
    };
  }

  async function getAvailableRooms(
    slot: number
  ): Promise<GetAvailableRoomsResult> {
    if (slot < 0 || slot > 23) {
      return {
        code: 'ERROR',
        message: 'Wrong slot value. Expected 0 <= slot <= 23',
      };
    }
    try {
      const availableRooms = await bookingRepository.getAvailableRooms(slot);
      return {
        code: 'OK',
        availableRooms,
      };
    } catch (_) {
      return {
        code: 'ERROR',
        message: 'Db error while querying available rooms',
      };
    }
  }

  return {
    bookRoom,
    getAvailableRooms,
  };
}
