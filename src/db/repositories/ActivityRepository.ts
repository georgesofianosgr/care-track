import { LocalStorageRepository } from '../BaseRepository';

export interface Activity {
  id: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  icon?: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ActivityRepository extends LocalStorageRepository<Activity> {
  protected collectionName = 'activities';

  async findByUserId(userId: string): Promise<Activity[]> {
    const activities = await this.findAll();
    return activities.filter(activity => activity.userId === userId);
  }

  async findActiveByUserId(userId: string): Promise<Activity[]> {
    const activities = await this.findByUserId(userId);
    return activities.filter(activity => activity.isActive);
  }

  async findByCategory(category: string, userId?: string): Promise<Activity[]> {
    const activities = await this.findAll();
    return activities.filter(activity => 
      activity.category === category && 
      (!userId || activity.userId === userId)
    );
  }

  async create(data: Omit<Activity, 'id'>): Promise<Activity> {
    const now = new Date().toISOString();
    const activityData = {
      ...data,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };
    return super.create(activityData);
  }

  async update(id: string, data: Partial<Activity>): Promise<Activity | null> {
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    return super.update(id, updateData);
  }
}