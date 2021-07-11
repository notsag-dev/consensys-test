import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user';
import { getSaltedHash } from '../lib/auth';

interface BuildLoginUserArgs {
  userRepository: UserRepository;
  passwordSalt: string;
  jwtKey: string;
}

export type LoginUserUsecase = (
  username: string,
  password: string
) => Promise<LoginUserResult>;

type LoginUserResult =
  | {
      code: 'ERROR';
      message: string;
    }
  | {
      code: 'OK';
      token: string;
    };

export function buildLoginUserUsecase(
  args: BuildLoginUserArgs
): LoginUserUsecase {
  const { userRepository, passwordSalt, jwtKey } = args;

  return async function loginUser(
    username: string,
    password: string
  ): Promise<LoginUserResult> {
    let user;
    try {
      user = await userRepository.getByUsername(username);
    } catch (err) {
      console.log(err);
      return {
        code: 'ERROR',
        message: 'Db error while querying user',
      };
    }

    if (user === undefined) {
      return {
        code: 'ERROR',
        message: 'Username not found',
      };
    }

    const hashedSaltedPassword = getSaltedHash(password, passwordSalt);
    if (user.password !== hashedSaltedPassword) {
      return {
        code: 'ERROR',
        message: 'Wrong password for username',
      };
    }

    const token = jwt.sign(user, jwtKey);
    return {
      code: 'OK',
      token,
    };
  };
}
