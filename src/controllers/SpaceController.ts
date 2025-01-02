import { Request, Response } from 'express';
import SpaceService from '../services/SpaceService';

class SpaceController {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const space = await SpaceService.createSpace(req.body);
      res.status(201).json(space);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async getSpaceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const space = await SpaceService.getSpaceById(Number(id));
      if (space) {
        res.json(space);
      } else {
        res.status(404).json({ error: 'Espaço não encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedSpace = await SpaceService.updateSpace(Number(id), req.body);
      if (updatedSpace) {
        res.json(updatedSpace);
      } else {
        res.status(404).json({ error: 'Espaço não encontrado' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await SpaceService.deleteSpace(Number(id));
      res.json({ message: 'Espaço deletado com sucesso' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default new SpaceController();
