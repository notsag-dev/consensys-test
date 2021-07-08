interface BuildUserRepositoryArgs {
  getDatabase(): any;
}

type User = {
  id?: string;
  name: string;
};

export interface UserRepository {
  create(u: User): Promise<void>;
  get(id: string): Promise<User | undefined>;
  bulkInsert(users: User[]): Promise<void>;
}

const tableName = 'users';
export function buildUserRepository(
  params: BuildUserRepositoryArgs
): UserRepository {
  const { getDatabase } = params;

  async function create(u: User) {
    const db = await getDatabase();
    await db(tableName).insert(u);
  }

  async function get(id: string) {
    const db = await getDatabase();
    const res = await db(tableName).select().where('id', id);
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
    bulkInsert,
  };
}
