import { Room } from '../repositories/room';

interface BuildBookingRepositoryArgs {
  getDatabase(): any;
}

export type Booking = {
  id?: string;
  roomId: string;
  userId: string;
  slot: number;
};

export interface BookingRepository {
  create(booking: Booking): Promise<void>;
  get(id: string): Promise<Booking | undefined>;
  getAvailableRooms(slot: number): Promise<Room[]>;
}

const tableName = 'bookings';
export function buildBookingRepository(
  params: BuildBookingRepositoryArgs
): BookingRepository {
  const { getDatabase } = params;

  async function create(booking: Booking) {
    const db = await getDatabase();
    await db(tableName).insert(booking);
  }

  async function get(id: string) {
    const db = await getDatabase();
    const res = await db(tableName).select().where('id', id);
    if (res.length) {
      return res[0];
    }
  }

  async function getAvailableRooms(slot: number): Promise<Room[]> {
    const db = await getDatabase();
    if (typeof slot !== 'number' || slot < 0 || slot > 23) {
      throw new Error('Slot must be >= 0 and <= 23');
    }
    const { rows } = await db.raw(
      `
      select * from rooms where id not in
      (select r.id from bookings b join rooms r on b."roomId" = r.id
        where b.slot = ?)
      `,
      [slot]
    );
    return rows;
  }

  return {
    create,
    get,
    getAvailableRooms,
  };
}
