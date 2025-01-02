import DatabaseConnection from '../config/database';
import { User } from '@/types';

const db = new DatabaseConnection();

class UserModel {
  public async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (name, email, password_hash, phone, document_type, document_number, is_admin, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;
    const { id } = await db.run(query, [
      user.name,
      user.email,
      user.password_hash,
      user.phone,
      user.document_type,
      user.document_number,
      user.is_admin || false
    ]);
    return { id, ...user, is_admin: user.is_admin || false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  }

  public async getById(id: number): Promise<User | undefined> {
    const user = await db.get<User>(`SELECT * FROM users WHERE id = ?`, [id]);
    return user;
  }

  public async getAll(): Promise<User[]> {
    const users = await db.all<User>(`SELECT * FROM users`);
    return users;
  }

  public async update(id: number, user: Partial<User>): Promise<User | undefined> {
    const query = `
      UPDATE users
      SET name = ?, email = ?, password_hash = ?, phone = ?, document_type = ?, document_number = ?, is_admin = ?, updated_at = datetime('now')
      WHERE id = ?`;
    await db.run(query, [
      user.name,
      user.email,
      user.password_hash,
      user.phone,
      user.document_type,
      user.document_number,
      user.is_admin,
      id
    ]);
    const updatedUser = await this.getById(id);
    return updatedUser;
  }

  public async delete(id: number): Promise<void> {
    await db.run(`DELETE FROM users WHERE id = ?`, [id]);
  }
}

export default new UserModel();
