import DatabaseConnection from '../config/database';
import { Service } from '@/types';

const db = new DatabaseConnection();

class ServiceModel {
  public async create(service: Service): Promise<Service> {
    const query = `
      INSERT INTO services (name, description, price, duration_minutes, available, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;
    const { id } = await db.run(query, [
      service.name,
      service.description,
      service.price,
      service.duration_minutes,
      service.available || true
    ]);
    return { id, ...service, available: service.available || true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  }

  public async getById(id: number): Promise<Service | undefined> {
    const service = await db.get<Service>(`SELECT * FROM services WHERE id = ?`, [id]);
    return service;
  }

  public async getAll(): Promise<Service[]> {
    const services = await db.all<Service>(`SELECT * FROM services`);
    return services;
  }

  public async update(id: number, service: Partial<Service>): Promise<Service | undefined> {
    const query = `
      UPDATE services
      SET name = ?, description = ?, price = ?, duration_minutes = ?, available = ?, updated_at = datetime('now')
      WHERE id = ?`;
    await db.run(query, [
      service.name,
      service.description,
      service.price,
      service.duration_minutes,
      service.available,
      id
    ]);
    const updatedService = await this.getById(id);
    return updatedService;
  }

  public async delete(id: number): Promise<void> {
    await db.run(`DELETE FROM services WHERE id = ?`, [id]);
  }
}

export default new ServiceModel();
