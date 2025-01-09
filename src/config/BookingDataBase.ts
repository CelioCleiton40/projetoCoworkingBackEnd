import { BaseDatabase } from "./BaseDataBase";
import { Booking } from "../types/index";

export class BookingDatabase extends BaseDatabase {
    public static TABLE_BOOKINGS = "bookings";

    public async getAllBookings(): Promise<Booking[]> {
        const bookings: Booking[] = await BaseDatabase
            .connection(BookingDatabase.TABLE_BOOKINGS)
            .select();
        
        return bookings;
    }

    public async createBooking(newBooking: Booking): Promise<void> {
        await BaseDatabase
            .connection(BookingDatabase.TABLE_BOOKINGS)
            .insert(newBooking);
    }

    public async getBookingById(id: string): Promise<Booking | undefined> {
        const booking: Booking | undefined = await BaseDatabase
            .connection(BookingDatabase.TABLE_BOOKINGS)
            .where({ id })
            .first();
        
        return booking;
    }

    public async editBooking(id: string, updatedBooking: Partial<Booking>): Promise<void> {
        await BaseDatabase
            .connection(BookingDatabase.TABLE_BOOKINGS)
            .where({ id })
            .update(updatedBooking);
    }

    public async deleteBooking(id: string): Promise<void> {
        await BaseDatabase
            .connection(BookingDatabase.TABLE_BOOKINGS)
            .where({ id })
            .delete();
    }
}
