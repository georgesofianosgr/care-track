import { useState } from 'react';
import { Activity, WeekData } from './types';
import { WeeklyTracker } from './components/WeeklyTracker';
import { WeeklySummary } from './components/WeeklySummary';
import { ActivityModal } from './components/ActivityModal';
import { BottomNavigation } from './components/BottomNavigation';
import { LoginModal } from './components/LoginModal';
import { useAuth } from './hooks/useAuth';
import { useActivitiesByUserId, useActivityEntriesByUserId } from './hooks/queries';
import { useCreateActivity, useUpdateActivity, useDeleteActivityWithEntries, useToggleActivityCompletion } from './hooks/mutations';
import logo from './assets/logo.png';

function App() {
  const { currentUser, isLoading, isAuthenticated, loginWithEmail } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // TanStack Query hooks
  const { data: activities = [], isLoading: activitiesLoading } = useActivitiesByUserId(currentUser?.id || '');
  const { data: activityEntries = [], isLoading: entriesLoading } = useActivityEntriesByUserId(currentUser?.id || '');

  // Mutations
  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity();
  const deleteActivityMutation = useDeleteActivityWithEntries();
  const toggleCompletionMutation = useToggleActivityCompletion();

  // Transform data for components
  const weekData: WeekData = {
    activities: activities.map(activity => ({
      id: activity.id,
      name: activity.name,
      days: [0, 1, 2, 3, 4, 5, 6] // Default to all days for now
    })),
    completions: activityEntries.map(entry => ({
      activityId: entry.activityId,
      date: entry.date,
      completed: entry.completed
    }))
  };

  const dataLoading = activitiesLoading || entriesLoading;

  const handleAddActivity = async (activityData: Omit<Activity, 'id'>) => {
    if (!currentUser) return;

    try {
      await createActivityMutation.mutateAsync({
        name: activityData.name,
        category: 'General',
        color: '#6b7280',
        userId: currentUser.id,
        isActive: true
      });
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  };

  const handleUpdateActivity = async (activityId: string, updates: Partial<Omit<Activity, 'id'>>) => {
    try {
      await updateActivityMutation.mutateAsync({
        id: activityId,
        data: {
          name: updates.name
        }
      });
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await deleteActivityMutation.mutateAsync(activityId);
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  const handleToggleCompletion = async (activityId: string, date: string, completed: boolean) => {
    if (!currentUser) return;

    try {
      await toggleCompletionMutation.mutateAsync({
        activityId,
        userId: currentUser.id,
        date,
        completed
      });
    } catch (error) {
      console.error('Failed to toggle completion:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img src={logo} alt="CareTrack Logo" className="w-16 h-16 mx-auto mb-4" />
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <LoginModal
        isOpen={!isAuthenticated}
        onLogin={loginWithEmail}
        isLoading={isLoading}
      />

      {isAuthenticated && (
        <>
          <div className="px-2 sm:px-4 pt-6 sm:pt-8 pb-16" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center" style={{ marginTop: '20px' }}>
                <img src={logo} alt="CareTrack Logo" className="w-16 h-16 mx-auto mb-4" />
                <h1 className="text-4xl sm:text-5xl tracking-wide text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  <span className="font-bold">Care</span><span className="font-thin">Track</span>
                </h1>
                <p className="text-sm text-gray-600 mt-2">Welcome, {currentUser?.firstName} {currentUser?.lastName}!</p>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-2 sm:px-4 -mt-4">
            {dataLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-600">Loading your activities...</div>
              </div>
            ) : (
              <>
                <WeeklySummary
                  activities={weekData.activities}
                  completions={weekData.completions}
                  currentDate={currentDate}
                />

                <WeeklyTracker
                  activities={weekData.activities}
                  completions={weekData.completions}
                  onToggleCompletion={handleToggleCompletion}
                  onEditActivity={setEditingActivity}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                />

                <ActivityModal
                  isOpen={isModalOpen || !!editingActivity}
                  onClose={() => {
                    setIsModalOpen(false);
                    setEditingActivity(null);
                  }}
                  onSave={handleAddActivity}
                  editActivity={editingActivity || undefined}
                  onUpdate={handleUpdateActivity}
                  onDelete={handleDeleteActivity}
                />
              </>
            )}
          </div>

          <BottomNavigation onAddActivity={() => setIsModalOpen(true)} />
        </>
      )}
    </div>
  );
}

export default App;
