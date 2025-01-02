import SpaceModel from '../models/Space';
import { Space } from '../types';

class SpaceService {
  public async createSpace(data: Space): Promise<Space> {
    // Garantir que status não seja undefined
    if (!data.status) {
      data.status = 'available';
    }
    return await SpaceModel.create(data);
  }

  public async getSpaceById(id: number): Promise<Space | null> {
    const space = await SpaceModel.getById(id);
    return space ?? null; // Retornar null se space for undefined
  }

  public async updateSpace(id: number, data: Partial<Space>): Promise<Space | null> {
    const updatedSpace = await SpaceModel.update(id, {
      ...data,
      status: data.status ?? 'available',
    });
    return updatedSpace ?? null; // Retornar null se updatedSpace for undefined
  }

  public async deleteSpace(id: number): Promise<void> {
    await SpaceModel.delete(id);
  }
}

export default new SpaceService();
