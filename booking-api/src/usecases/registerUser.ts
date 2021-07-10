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
  code: 'OK' | 'EXISTS';
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
        code: 'EXISTS',
        message: 'Username already taken',
      };
    }

    const saltedHashedPassword = getSaltedHash(password, passwordSalt);
    await userRepository.create({
      username,
      password: saltedHashedPassword,
      name,
    });

    return {
      code: 'OK',
      message: 'User created successfully',
    };
  };
}
