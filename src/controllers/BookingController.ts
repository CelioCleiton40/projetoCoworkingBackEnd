import { Request, Response } from 'express';
import BookingService from '../services/BookingService';

class BookingController {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const booking = await BookingService.createBooking(req.body);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const booking = await BookingService.getBookingById(Number(id));
      if (booking) {
        res.json(booking);
      } else {
        res.status(404).json({ error: 'Reserva não encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async list(req: Request, res: Response): Promise<void> {
    try {
      const bookings = await BookingService.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedBooking = await BookingService.updateBooking(Number(id), req.body);
      if (updatedBooking) {
        res.json(updatedBooking);
      } else {
        res.status(404).json({ error: 'Reserva não encontrada' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await BookingService.deleteBooking(Number(id));
      res.json({ message: 'Reserva deletada com sucesso' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default new BookingController();
