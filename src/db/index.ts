export type { Repository } from './BaseRepository';
export { LocalStorageRepository } from './BaseRepository';

export type { User } from './repositories/UserRepository';
export { UserRepository } from './repositories/UserRepository';
export type { Activity } from './repositories/ActivityRepository';
export { ActivityRepository } from './repositories/ActivityRepository';
export type { ActivityEntry } from './repositories/ActivityEntryRepository';
export { ActivityEntryRepository } from './repositories/ActivityEntryRepository';

import { UserRepository } from './repositories/UserRepository';
import { ActivityRepository } from './repositories/ActivityRepository';
import { ActivityEntryRepository } from './repositories/ActivityEntryRepository';

export class DatabaseService {
  private static _userRepository: UserRepository;
  private static _activityRepository: ActivityRepository;
  private static _activityEntryRepository: ActivityEntryRepository;

  static get users(): UserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository();
    }
    return this._userRepository;
  }

  static get activities(): ActivityRepository {
    if (!this._activityRepository) {
      this._activityRepository = new ActivityRepository();
    }
    return this._activityRepository;
  }

  static get activityEntries(): ActivityEntryRepository {
    if (!this._activityEntryRepository) {
      this._activityEntryRepository = new ActivityEntryRepository();
    }
    return this._activityEntryRepository;
  }
}