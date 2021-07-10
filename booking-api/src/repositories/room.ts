interface BuildRoomRepositoryArgs {
  getDatabase(): any;
}

export type Room = {
  id?: string;
  name: string;
  company: string;
};

export interface RoomRepository {
  create(u: Room): Promise<void>;
  get(id: string): Promise<Room | undefined>;
  getAll(): Promise<Room[]>;
  bulkInsert(rooms: Room[]): Promise<void>;
}

const tableName = 'rooms';
export function buildRoomRepository(
  params: BuildRoomRepositoryArgs
): RoomRepository {
  const { getDatabase } = params;

  async function create(room: Room) {
    const db = await getDatabase();
    await db(tableName).insert(room);
  }

  async function get(id: string) {
    const db = await getDatabase();
    const res = await db(tableName).select().where('id', id);
    if (res.length) {
      return res[0];
    }
  }

  async function getAll() {
    const db = await getDatabase();
    const res = await db(tableName).select();
    return res;
  }

  async function bulkInsert(rooms: Room[]): Promise<void> {
    const db = await getDatabase();
    if (rooms.length === 0) {
      return;
    }
    await db(tableName).insert(rooms);
  }

  return {
    create,
    get,
    getAll,
    bulkInsert,
  };
}
