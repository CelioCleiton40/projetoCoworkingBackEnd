import ServiceModel from '../models/Service';
import { Service } from '../types';

class ServiceService {
  public async createService(data: Service): Promise<Service> {
    return await ServiceModel.create(data);
  }

  public async getServiceById(id: number): Promise<Service | null> {
    const service = await ServiceModel.getById(id);
    return service ?? null;
  }

  public async getAllServices(): Promise<Service[]> { 
    return await ServiceModel.getAll(); }

  public async updateService(id: number, data: Partial<Service>): Promise<Service | null> {
    const service = await ServiceModel.update(id, data);
    return service ?? null;
  }

  public async deleteService(id: number): Promise<void> {
    await ServiceModel.delete(id);
  }
}

export default new ServiceService();
