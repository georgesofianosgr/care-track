export interface Repository<T> {
  create(data: Omit<T, 'id'>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export abstract class LocalStorageRepository<T extends { id: string }> implements Repository<T> {
  protected abstract collectionName: string;

  protected getStorageKey(): string {
    return `caretrack_${this.collectionName}`;
  }

  protected generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected getAll(): T[] {
    const data = localStorage.getItem(this.getStorageKey());
    return data ? JSON.parse(data) : [];
  }

  protected saveAll(items: T[]): void {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(items));
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const items = this.getAll();
    const newItem = { ...data, id: this.generateId() } as T;
    items.push(newItem);
    this.saveAll(items);
    return newItem;
  }

  async findById(id: string): Promise<T | null> {
    const items = this.getAll();
    return items.find(item => item.id === id) || null;
  }

  async findAll(): Promise<T[]> {
    return this.getAll();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;

    items[index] = { ...items[index], ...data };
    this.saveAll(items);
    return items[index];
  }

  async delete(id: string): Promise<boolean> {
    const items = this.getAll();
    const initialLength = items.length;
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === initialLength) return false;

    this.saveAll(filteredItems);
    return true;
  }
}