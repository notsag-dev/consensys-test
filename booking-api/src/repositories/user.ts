interface BuildUserRepositoryArgs {
  getDatabase(): any;
}

export type User = {
  id?: string;
  name: string;
  username: string;
  password: string;
};

export interface UserRepository {
  create(user: User): Promise<void>;
  get(id: string): Promise<User | undefined>;
  bulkInsert(users: User[]): Promise<void>;
  getByUsername(username: string): Promise<User | undefined>;
}

const tableName = 'users';
export function buildUserRepository(
  params: BuildUserRepositoryArgs
): UserRepository {
  const { getDatabase } = params;

  async function create(user: User) {
    const db = await getDatabase();
    await db(tableName).insert(user);
  }

  async function get(id: string) {
    const db = await getDatabase();
    const res = await db(tableName).select().where('id', id);
    if (res.length) {
      return res[0];
    }
  }

  async function getByUsername(username: string): Promise<User | undefined> {
    const db = await getDatabase();
    const res = await db(tableName).select().where('username', username);
    if (res.length) {
      return res[0];
    }
  }

  async function bulkInsert(users: User[]): Promise<void> {
    const db = await getDatabase();
    if (users.length === 0) {
      return;
    }
    await db(tableName).insert(users);
  }

  return {
    create,
    get,
    getByUsername,
    bulkInsert,
  };
}
