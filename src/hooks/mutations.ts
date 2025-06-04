import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DatabaseService, User, Activity, ActivityEntry } from '../db';
import { queryKeys } from './queries';

// User Mutations
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => 
      DatabaseService.users.create(userData),
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.setQueryData(queryKeys.users.byId(newUser.id), newUser);
      queryClient.setQueryData(queryKeys.users.byEmail(newUser.email), newUser);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => 
      DatabaseService.users.update(id, data),
    onSuccess: (updatedUser, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      if (updatedUser) {
        queryClient.setQueryData(queryKeys.users.byId(id), updatedUser);
        queryClient.setQueryData(queryKeys.users.byEmail(updatedUser.email), updatedUser);
      }
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => DatabaseService.users.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.removeQueries({ queryKey: queryKeys.users.byId(id) });
    },
  });
};

// Activity Mutations
export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>) => 
      DatabaseService.activities.create(activityData),
    onSuccess: (newActivity) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.byUserId(newActivity.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.activeByUserId(newActivity.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.byCategory(newActivity.category, newActivity.userId) });
      queryClient.setQueryData(queryKeys.activities.byId(newActivity.id), newActivity);
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Activity> }) => 
      DatabaseService.activities.update(id, data),
    onSuccess: (updatedActivity, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      if (updatedActivity) {
        queryClient.invalidateQueries({ queryKey: queryKeys.activities.byUserId(updatedActivity.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.activities.activeByUserId(updatedActivity.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.activities.byCategory(updatedActivity.category, updatedActivity.userId) });
        queryClient.setQueryData(queryKeys.activities.byId(id), updatedActivity);
      }
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => DatabaseService.activities.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.byUserId });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.activeByUserId });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.byCategory });
      queryClient.removeQueries({ queryKey: queryKeys.activities.byId(id) });
    },
  });
};

// Activity Entry Mutations
export const useCreateActivityEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entryData: Omit<ActivityEntry, 'id' | 'createdAt' | 'updatedAt'>) => 
      DatabaseService.activityEntries.create(entryData),
    onSuccess: (newEntry) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byUserId(newEntry.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byActivityId(newEntry.activityId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byDate(newEntry.date, newEntry.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byDateRange });
      queryClient.setQueryData(queryKeys.activityEntries.byId(newEntry.id), newEntry);
      queryClient.setQueryData(queryKeys.activityEntries.byActivityAndDate(newEntry.activityId, newEntry.date), newEntry);
    },
  });
};

export const useUpdateActivityEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ActivityEntry> }) => 
      DatabaseService.activityEntries.update(id, data),
    onSuccess: (updatedEntry, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.all });
      if (updatedEntry) {
        queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byUserId(updatedEntry.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byActivityId(updatedEntry.activityId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byDate(updatedEntry.date, updatedEntry.userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byDateRange });
        queryClient.setQueryData(queryKeys.activityEntries.byId(id), updatedEntry);
        queryClient.setQueryData(queryKeys.activityEntries.byActivityAndDate(updatedEntry.activityId, updatedEntry.date), updatedEntry);
      }
    },
  });
};

export const useDeleteActivityEntry = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => DatabaseService.activityEntries.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byUserId });
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byActivityId });
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byDate });
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byDateRange });
      queryClient.removeQueries({ queryKey: queryKeys.activityEntries.byId(id) });
    },
  });
};

// Compound mutations for common operations
export const useToggleActivityCompletion = () => {
  const createEntry = useCreateActivityEntry();
  const updateEntry = useUpdateActivityEntry();
  
  return useMutation({
    mutationFn: async ({ 
      activityId, 
      userId, 
      date, 
      completed 
    }: { 
      activityId: string; 
      userId: string; 
      date: string; 
      completed: boolean; 
    }) => {
      const existingEntry = await DatabaseService.activityEntries.findByActivityAndDate(activityId, date);
      
      if (existingEntry) {
        return updateEntry.mutateAsync({
          id: existingEntry.id,
          data: { completed }
        });
      } else {
        return createEntry.mutateAsync({
          activityId,
          userId,
          date,
          completed
        });
      }
    },
  });
};

export const useDeleteActivityWithEntries = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activityId: string) => {
      const entries = await DatabaseService.activityEntries.findByActivityId(activityId);
      await Promise.all(entries.map(entry => DatabaseService.activityEntries.delete(entry.id)));
      return DatabaseService.activities.delete(activityId);
    },
    onSuccess: (_, activityId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.byUserId });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.activeByUserId });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.byCategory });
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activityEntries.byActivityId(activityId) });
      queryClient.removeQueries({ queryKey: queryKeys.activities.byId(activityId) });
    },
  });
};