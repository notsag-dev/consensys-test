import { Express, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RoomRepository } from '../repositories/room';
import { BookingRepository } from '../repositories/booking';
import { UserRepository } from '../repositories/user';
import { getSaltedHash } from '../lib/auth';
import { RegisterUserUsecase } from '../usecases/registerUser';

interface SetAuthEndpointsArgs {
  server: Express;
  roomRepository: RoomRepository;
  bookingRepository: BookingRepository;
  userRepository: UserRepository;
  authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
  registerUserUsecase: RegisterUserUsecase;
}

export function setAuthEndpoints(args: SetAuthEndpointsArgs) {
  const { server, userRepository, registerUserUsecase } = args;

  server.post('/register', async (req: Request, res: Response) => {
    // TODO add owasp-password-strength-test
    if (req.body === undefined) {
      res.status(400).send();
      return;
    }
    const { username, password, name } = req.body;

    if (
      username === undefined ||
      password === undefined ||
      name === undefined
    ) {
      res.status(400).json({
        error:
          'Missing one or more required body params: username, password, name',
      });
    }

    const registerUserResult = await registerUserUsecase(
      username,
      password,
      name
    );

    if (registerUserResult.code === 'EXISTS') {
      res.status(400).json({ error: registerUserResult.message });
      return;
    }

    res.status(200).send();
  });

  server.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await userRepository.getByUsername(username);
    const saltedHashedPassword = getSaltedHash(password, 'test-consensys'); // TODO move to env

    if (user === undefined || user.password !== saltedHashedPassword) {
      res.status(401).json({ error: 'Incorrect user or password' });
      return;
    }
    const token = jwt.sign(user, process.env.JWT_KEY || 'FIX THIS'); // FIXME
    res.status(200).send({ token });
  });
}
