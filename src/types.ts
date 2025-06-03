export interface Activity {
  id: string;
  name: string;
  days: number[]; // 0-6 (Sunday to Saturday)
}

export interface ActivityCompletion {
  activityId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
}

export interface WeekData {
  activities: Activity[];
  completions: ActivityCompletion[];
}