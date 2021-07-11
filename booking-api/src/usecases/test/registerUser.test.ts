import { buildRegisterUserUsecase, RegisterUserUsecase } from '../registerUser';
import { User } from '../../repositories/user';

const passwordSalt = 'test-salt';
let registerUserUsecase: RegisterUserUsecase;

describe('RegisterUserUsecase', () => {
  beforeEach(() => {
    const users: User[] = [];

    const mockUserRepository = {
      async create(user: User): Promise<void> {
        const existingUser = users.find((u) => u.username === user.username);
        if (existingUser) {
          throw new Error('User already added');
        }
        users.push(user);
      },
      async get(id: string): Promise<User | undefined> {
        return users.find((u) => u.id === id);
      },
      async getByUsername(username: string): Promise<User | undefined> {
        return users.find((u) => (u.username = username));
      },
    };

    registerUserUsecase = buildRegisterUserUsecase({
      userRepository: mockUserRepository,
      passwordSalt,
    });
  });
  describe('When registering a non-existing user', () => {
    it('inserts it successfully', async () => {
      const registerUserResult = await registerUserUsecase(
        'johnlennon',
        'givepeaceachance',
        'John Lennon'
      );
      expect(registerUserResult.code).toBe('OK');
    });
  });
  describe('When registering an existing user', () => {
    it('returns the code that indicates the user exists', async () => {
      await registerUserUsecase(
        'johnlennon',
        'givepeaceachance',
        'John Lennon'
      );
      const registerUserResult = await registerUserUsecase(
        'johnlennon',
        'givepeaceachance',
        'John Lennon'
      );
      expect(registerUserResult.code).toBe('ERROR_EXISTS');
    });
  });
});
