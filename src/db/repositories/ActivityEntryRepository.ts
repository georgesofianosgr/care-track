import { LocalStorageRepository } from '../BaseRepository';

export interface ActivityEntry {
  id: string;
  activityId: string;
  userId: string;
  date: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ActivityEntryRepository extends LocalStorageRepository<ActivityEntry> {
  protected collectionName = 'activityEntries';

  async findByUserId(userId: string): Promise<ActivityEntry[]> {
    const entries = await this.findAll();
    return entries.filter(entry => entry.userId === userId);
  }

  async findByActivityId(activityId: string): Promise<ActivityEntry[]> {
    const entries = await this.findAll();
    return entries.filter(entry => entry.activityId === activityId);
  }

  async findByDate(date: string, userId?: string): Promise<ActivityEntry[]> {
    const entries = await this.findAll();
    return entries.filter(entry => 
      entry.date === date && 
      (!userId || entry.userId === userId)
    );
  }

  async findByDateRange(startDate: string, endDate: string, userId?: string): Promise<ActivityEntry[]> {
    const entries = await this.findAll();
    return entries.filter(entry => {
      const entryDate = entry.date;
      return entryDate >= startDate && 
             entryDate <= endDate && 
             (!userId || entry.userId === userId);
    });
  }

  async findByActivityAndDate(activityId: string, date: string): Promise<ActivityEntry | null> {
    const entries = await this.findAll();
    return entries.find(entry => 
      entry.activityId === activityId && entry.date === date
    ) || null;
  }

  async getCompletedCount(activityId: string, startDate?: string, endDate?: string): Promise<number> {
    const entries = await this.findByActivityId(activityId);
    let filteredEntries = entries.filter(entry => entry.completed);

    if (startDate && endDate) {
      filteredEntries = filteredEntries.filter(entry => 
        entry.date >= startDate && entry.date <= endDate
      );
    }

    return filteredEntries.length;
  }

  async create(data: Omit<ActivityEntry, 'id'>): Promise<ActivityEntry> {
    const now = new Date().toISOString();
    const entryData = {
      ...data,
      completed: data.completed ?? false,
      createdAt: now,
      updatedAt: now
    };
    return super.create(entryData);
  }

  async update(id: string, data: Partial<ActivityEntry>): Promise<ActivityEntry | null> {
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    return super.update(id, updateData);
  }
}