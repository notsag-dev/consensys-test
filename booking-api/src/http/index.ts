import { Express, Request, Response, NextFunction } from 'express';
import { setBookingEndpoints } from './booking';
import { setAuthEndpoints } from './auth';
import { RegisterUserUsecase } from '../usecases/registerUser';
import { LoginUserUsecase } from '../usecases/loginUser';
import { BookRoomUsecase } from '../usecases/bookRoom';
import { GetUserBookingsUsecase } from '../usecases/getUserBookings';

interface SetEndpointsParams {
  server: Express;
  authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
  registerUserUsecase: RegisterUserUsecase;
  loginUserUsecase: LoginUserUsecase;
  bookRoomUsecase: BookRoomUsecase;
  getUserBookingsUsecase: GetUserBookingsUsecase;
}

export function setEndpoints(params: SetEndpointsParams) {
  const {
    server,
    authMiddleware,
    registerUserUsecase,
    loginUserUsecase,
    bookRoomUsecase,
    getUserBookingsUsecase,
  } = params;
  setAuthEndpoints({ server, registerUserUsecase, loginUserUsecase });
  setBookingEndpoints({
    server,
    authMiddleware,
    bookRoomUsecase,
    getUserBookingsUsecase,
  });
}
