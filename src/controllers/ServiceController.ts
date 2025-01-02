import { Request, Response } from 'express';
import ServiceService from '../services/ServiceService';

class ServiceController {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const service = await ServiceService.createService(req.body);
      res.status(201).json(service);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async getServiceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const service = await ServiceService.getServiceById(Number(id));
      if (service) {
        res.json(service);
      } else {
        res.status(404).json({ error: 'Serviço não encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async list(req: Request, res: Response): Promise<void> {
    try {
      const services = await ServiceService.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedService = await ServiceService.updateService(Number(id), req.body);
      if (updatedService) {
        res.json(updatedService);
      } else {
        res.status(404).json({ error: 'Serviço não encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ServiceService.deleteService(Number(id));
      res.json({ message: 'Serviço deletado com sucesso' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default new ServiceController();
