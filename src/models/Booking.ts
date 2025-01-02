import DatabaseConnection from '../config/database';
import { Booking } from '@/types';

const db = new DatabaseConnection();


class BookingModel {
  public async create(booking: Booking): Promise<Booking> {
    const query = `
      INSERT INTO bookings (user_id, space_id, start_time, end_time, total_price, status, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;
    const { id } = await db.run(query, [
      booking.user_id,
      booking.space_id,
      booking.start_time,
      booking.end_time,
      booking.total_price,
      booking.status || 'pending',
      booking.notes
    ]);
    return { id, ...booking, status: booking.status || 'pending', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  }

  public async getById(id: number): Promise<Booking | undefined> {
    const booking = await db.get<Booking>(`SELECT * FROM bookings WHERE id = ?`, [id]);
    return booking;
  }

  public async getAll(): Promise<Booking[]> {
    const bookings = await db.all<Booking>(`SELECT * FROM bookings`);
    return bookings;
  }

  public async update(id: number, booking: Partial<Booking>): Promise<Booking | undefined> {
    const query = `
      UPDATE bookings
      SET user_id = ?, space_id = ?, start_time = ?, end_time = ?, total_price = ?, status = ?, notes = ?, updated_at = datetime('now')
      WHERE id = ?`;
    await db.run(query, [
      booking.user_id,
      booking.space_id,
      booking.start_time,
      booking.end_time,
      booking.total_price,
      booking.status,
      booking.notes,
      id
    ]);
    const updatedBooking = await this.getById(id);
    return updatedBooking;
  }

  public async delete(id: number): Promise<void> {
    await db.run(`DELETE FROM bookings WHERE id = ?`, [id]);
  }
}

export default new BookingModel();
