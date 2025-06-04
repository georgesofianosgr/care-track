import { useQuery } from '@tanstack/react-query';
import { DatabaseService } from '../db';

// Query Keys
export const queryKeys = {
  users: {
    all: ['users'] as const,
    byId: (id: string) => ['users', id] as const,
    byEmail: (email: string) => ['users', 'email', email] as const,
  },
  activities: {
    all: ['activities'] as const,
    byId: (id: string) => ['activities', id] as const,
    byUserId: (userId: string) => ['activities', 'user', userId] as const,
    activeByUserId: (userId: string) => ['activities', 'user', userId, 'active'] as const,
    byCategory: (category: string, userId?: string) => ['activities', 'category', category, userId] as const,
  },
  activityEntries: {
    all: ['activityEntries'] as const,
    byId: (id: string) => ['activityEntries', id] as const,
    byUserId: (userId: string) => ['activityEntries', 'user', userId] as const,
    byActivityId: (activityId: string) => ['activityEntries', 'activity', activityId] as const,
    byDate: (date: string, userId?: string) => ['activityEntries', 'date', date, userId] as const,
    byDateRange: (startDate: string, endDate: string, userId?: string) => 
      ['activityEntries', 'dateRange', startDate, endDate, userId] as const,
    byActivityAndDate: (activityId: string, date: string) => 
      ['activityEntries', 'activity', activityId, 'date', date] as const,
  },
};

// User Queries
export const getUserByIdQuery = (id: string) => ({
  queryKey: queryKeys.users.byId(id),
  queryFn: () => DatabaseService.users.findById(id),
  enabled: !!id,
});

export const getUserByEmailQuery = (email: string) => ({
  queryKey: queryKeys.users.byEmail(email),
  queryFn: () => DatabaseService.users.findByEmail(email),
  enabled: !!email,
});

export const getAllUsersQuery = () => ({
  queryKey: queryKeys.users.all,
  queryFn: () => DatabaseService.users.findAll(),
});

// Activity Queries
export const getActivityByIdQuery = (id: string) => ({
  queryKey: queryKeys.activities.byId(id),
  queryFn: () => DatabaseService.activities.findById(id),
  enabled: !!id,
});

export const getActivitiesByUserIdQuery = (userId: string) => ({
  queryKey: queryKeys.activities.byUserId(userId),
  queryFn: () => DatabaseService.activities.findByUserId(userId),
  enabled: !!userId,
});

export const getActiveActivitiesByUserIdQuery = (userId: string) => ({
  queryKey: queryKeys.activities.activeByUserId(userId),
  queryFn: () => DatabaseService.activities.findActiveByUserId(userId),
  enabled: !!userId,
});

export const getActivitiesByCategoryQuery = (category: string, userId?: string) => ({
  queryKey: queryKeys.activities.byCategory(category, userId),
  queryFn: () => DatabaseService.activities.findByCategory(category, userId),
  enabled: !!category,
});

export const getAllActivitiesQuery = () => ({
  queryKey: queryKeys.activities.all,
  queryFn: () => DatabaseService.activities.findAll(),
});

// Activity Entry Queries
export const getActivityEntryByIdQuery = (id: string) => ({
  queryKey: queryKeys.activityEntries.byId(id),
  queryFn: () => DatabaseService.activityEntries.findById(id),
  enabled: !!id,
});

export const getActivityEntriesByUserIdQuery = (userId: string) => ({
  queryKey: queryKeys.activityEntries.byUserId(userId),
  queryFn: () => DatabaseService.activityEntries.findByUserId(userId),
  enabled: !!userId,
});

export const getActivityEntriesByActivityIdQuery = (activityId: string) => ({
  queryKey: queryKeys.activityEntries.byActivityId(activityId),
  queryFn: () => DatabaseService.activityEntries.findByActivityId(activityId),
  enabled: !!activityId,
});

export const getActivityEntriesByDateQuery = (date: string, userId?: string) => ({
  queryKey: queryKeys.activityEntries.byDate(date, userId),
  queryFn: () => DatabaseService.activityEntries.findByDate(date, userId),
  enabled: !!date,
});

export const getActivityEntriesByDateRangeQuery = (startDate: string, endDate: string, userId?: string) => ({
  queryKey: queryKeys.activityEntries.byDateRange(startDate, endDate, userId),
  queryFn: () => DatabaseService.activityEntries.findByDateRange(startDate, endDate, userId),
  enabled: !!startDate && !!endDate,
});

export const getActivityEntryByActivityAndDateQuery = (activityId: string, date: string) => ({
  queryKey: queryKeys.activityEntries.byActivityAndDate(activityId, date),
  queryFn: () => DatabaseService.activityEntries.findByActivityAndDate(activityId, date),
  enabled: !!activityId && !!date,
});

export const getCompletedCountQuery = (activityId: string, startDate?: string, endDate?: string) => ({
  queryKey: ['activityEntries', 'completedCount', activityId, startDate, endDate],
  queryFn: () => DatabaseService.activityEntries.getCompletedCount(activityId, startDate, endDate),
  enabled: !!activityId,
});

export const getAllActivityEntriesQuery = () => ({
  queryKey: queryKeys.activityEntries.all,
  queryFn: () => DatabaseService.activityEntries.findAll(),
});

// Hook examples for direct usage
export const useUserById = (id: string) => useQuery(getUserByIdQuery(id));
export const useUserByEmail = (email: string) => useQuery(getUserByEmailQuery(email));
export const useActivitiesByUserId = (userId: string) => useQuery(getActivitiesByUserIdQuery(userId));
export const useActivityEntriesByUserId = (userId: string) => useQuery(getActivityEntriesByUserIdQuery(userId));