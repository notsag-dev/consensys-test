import { buildLoginUserUsecase, LoginUserUsecase } from '../loginUser';
import { User } from '../../repositories/user';

const passwordSalt = 'test-salt';
const jwtKey = 'jwk-key';
let loginUserUsecase: LoginUserUsecase;

describe('LoginUserUsecase', () => {
  beforeEach(() => {
    const users: User[] = [
      {
        name: 'John Lennon',
        username: 'johnlennon',
        password: '28a1610fca8664b817977b37bae862ab',
      },
    ];

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

    loginUserUsecase = buildLoginUserUsecase({
      userRepository: mockUserRepository,
      passwordSalt,
      jwtKey,
    });
  });

  describe('When loging in with correct credentials', () => {
    it('it returns an OK code result', async () => {
      const loginResult = await loginUserUsecase(
        'johnlennon',
        'givepeaceachance'
      );

      expect(loginResult.code).toBe('OK');
    });
  });

  describe('When loging in with wrong credentials', () => {
    it('it returns an ERROR code result', async () => {
      const loginResult = await loginUserUsecase('johnlennon', 'howdoyousleep');

      expect(loginResult.code).toBe('ERROR');
    });
  });

  describe('When logging in from an account that does not exist', () => {
    it('it returns an ERROR code result', async () => {
      const loginResult = await loginUserUsecase('paulmccartney', 'yesterday');

      expect(loginResult.code).toBe('ERROR');
    });
  });
});
