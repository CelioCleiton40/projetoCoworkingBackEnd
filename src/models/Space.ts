import DatabaseConnection from '../config/database';
import { Space } from '@/types';

const db = new DatabaseConnection();

class SpaceModel {
  public async create(space: Space): Promise<Space> {
    const query = `
      INSERT INTO spaces (name, capacity, hourly_rate, description, amenities, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;
    const { id } = await db.run(query, [
      space.name,
      space.capacity,
      space.hourly_rate,
      space.description,
      space.amenities,
      space.status || 'available'
    ]);
    return { id, ...space, status: space.status || 'available', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  }

  public async getById(id: number): Promise<Space | undefined> {
    const space = await db.get<Space>(`SELECT * FROM spaces WHERE id = ?`, [id]);
    return space;
  }

  public async getAll(): Promise<Space[]> {
    const spaces = await db.all<Space>(`SELECT * FROM spaces`);
    return spaces;
  }

  public async update(id: number, space: Partial<Space>): Promise<Space | undefined> {
    const query = `
      UPDATE spaces
      SET name = ?, capacity = ?, hourly_rate = ?, description = ?, amenities = ?, status = ?, updated_at = datetime('now')
      WHERE id = ?`;
    await db.run(query, [
      space.name,
      space.capacity,
      space.hourly_rate,
      space.description,
      space.amenities,
      space.status,
      id
    ]);
    const updatedSpace = await this.getById(id);
    return updatedSpace;
  }

  public async delete(id: number): Promise<void> {
    await db.run(`DELETE FROM spaces WHERE id = ?`, [id]);
  }
}

export default new SpaceModel();
