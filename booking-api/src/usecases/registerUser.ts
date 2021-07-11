import { UserRepository } from '../repositories/user';
import { getSaltedHash } from '../lib/auth';

interface BuildRegisterUserArgs {
  userRepository: UserRepository;
  passwordSalt: string;
}

export type RegisterUserUsecase = (
  username: string,
  password: string,
  name: string
) => Promise<RegisterUserResult>;

type RegisterUserResult = {
  code: 'OK' | 'ERROR_EXISTS' | 'ERROR';
  message: string;
};

export function buildRegisterUserUsecase(
  args: BuildRegisterUserArgs
): RegisterUserUsecase {
  const { userRepository, passwordSalt } = args;

  return async function registerUser(
    username: string,
    password: string,
    name: string
  ): Promise<RegisterUserResult> {
    const existingUser = await userRepository.getByUsername(username);

    if (existingUser !== undefined) {
      return {
        code: 'ERROR_EXISTS',
        message: 'Username already taken',
      };
    }

    const saltedHashedPassword = getSaltedHash(password, passwordSalt);
    try {
      await userRepository.create({
        username,
        password: saltedHashedPassword,
        name,
      });
    } catch (_) {
      return {
        code: 'ERROR',
        message: 'Error while inserting user into db',
      };
    }

    return {
      code: 'OK',
      message: 'User created successfully',
    };
  };
}
