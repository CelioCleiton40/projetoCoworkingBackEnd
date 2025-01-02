import UserModel from '../models/User';
import { User } from '../types';

class UserService {
  public async createUser(data: User): Promise<User> {
    return await UserModel.create(data);
  }

  public async getUserById(id: number): Promise<User | null> {
    const user = await UserModel.getById(id);
    return user || null;
  }

  public async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    const user = await UserModel.update(id, data);
    return user || null;
  }

  public async deleteUser(id: number): Promise<void> {
    await UserModel.delete(id);
  }
}

export default new UserService();
