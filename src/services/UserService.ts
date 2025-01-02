import UserModel from '../models/User';
import { User } from '../types';

class UserService {
  public async createUser(data: User): Promise<User> {
    return await UserModel.create(data);
  }

  public async getUserById(id: number): Promise<User | null> {
    return await UserModel.getById(id);
  }

  public async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    return await UserModel.update(id, data);
  }

  public async deleteUser(id: number): Promise<void> {
    await UserModel.delete(id);
  }
}

export default new UserService();
