import { Booking, BookingRepository } from '../repositories/booking';

interface BuildGetUserBookingsArgs {
  bookingRepository: BookingRepository;
}

type GetUserBookingsResult =
  | {
      code: 'ERROR';
      message: string;
    }
  | {
      code: 'OK';
      bookings: Booking[];
    };

export type GetUserBookingsUsecase = (
  userId: string
) => Promise<GetUserBookingsResult>;

export function buildGetUserBookingsUsecase(
  args: BuildGetUserBookingsArgs
): GetUserBookingsUsecase {
  const { bookingRepository } = args;

  return async function getUserBookings(
    userId: string
  ): Promise<GetUserBookingsResult> {
    let bookings;
    try {
      bookings = await bookingRepository.getUserBookings(userId);
    } catch (err) {
      console.log(err);
      return {
        code: 'ERROR',
        message: 'Db error while getting user booking',
      };
    }
    return {
      code: 'OK',
      bookings,
    };
  };
}
