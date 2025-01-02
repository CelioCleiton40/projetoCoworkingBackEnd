import BookingModel from '../models/Booking';
import { Booking } from '../types';

class BookingService {
  public async createBooking(data: Booking): Promise<Booking> {
    return await BookingModel.create(data);
  }

  public async getBookingById(id: number): Promise<Booking | null> {
    const booking = await BookingModel.getById(id);
    return booking ?? null; // Retornar null se booking for undefined
  }

  public async getAllBookings(): Promise<Booking[]> {
    return await BookingModel.getAll();
  }

  public async updateBooking(id: number, data: Partial<Booking>): Promise<Booking | null> {
    const updatedBooking = await BookingModel.update(id, data);
    return updatedBooking ?? null; // Retornar null se updatedBooking for undefined
  }

  public async deleteBooking(id: number): Promise<void> {
    await BookingModel.delete(id);
  }
}

export default new BookingService();
