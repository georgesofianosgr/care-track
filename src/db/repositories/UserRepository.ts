import { LocalStorageRepository } from '../BaseRepository';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export class UserRepository extends LocalStorageRepository<User> {
  protected collectionName = 'users';

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(user => user.email === email) || null;
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const now = new Date().toISOString();
    const userData = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    return super.create(userData);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    return super.update(id, updateData);
  }
}