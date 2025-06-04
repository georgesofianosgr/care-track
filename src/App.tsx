import { useState, useEffect } from 'react';
import { Activity, WeekData } from './types';
import { WeeklyTracker } from './components/WeeklyTracker';
import { WeeklySummary } from './components/WeeklySummary';
import { ActivityModal } from './components/ActivityModal';
import { BottomNavigation } from './components/BottomNavigation';
import { LoginModal } from './components/LoginModal';
import { useAuth } from './hooks/useAuth';
import { DatabaseService } from './db';
import logo from './assets/logo.png';

function App() {
  const { currentUser, isLoading, isAuthenticated, loginWithEmail } = useAuth();
  const [weekData, setWeekData] = useState<WeekData>({
    activities: [],
    completions: []
  });
  const [dataLoading, setDataLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser]);

  const loadUserData = async () => {
    if (!currentUser) return;
    
    setDataLoading(true);
    try {
      const [activities, activityEntries] = await Promise.all([
        DatabaseService.activities.findByUserId(currentUser.id),
        DatabaseService.activityEntries.findByUserId(currentUser.id)
      ]);

      const mappedActivities: Activity[] = activities.map(activity => ({
        id: activity.id,
        name: activity.name,
        days: [0, 1, 2, 3, 4, 5, 6]
      }));

      const mappedCompletions = activityEntries.map(entry => ({
        activityId: entry.activityId,
        date: entry.date,
        completed: entry.completed
      }));

      setWeekData({
        activities: mappedActivities,
        completions: mappedCompletions
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddActivity = async (activityData: Omit<Activity, 'id'>) => {
    if (!currentUser) return;

    try {
      const newActivity = await DatabaseService.activities.create({
        name: activityData.name,
        category: 'General',
        color: '#6b7280',
        userId: currentUser.id,
        isActive: true
      });

      const mappedActivity: Activity = {
        id: newActivity.id,
        name: newActivity.name,
        days: activityData.days
      };

      setWeekData(prev => ({
        ...prev,
        activities: [...prev.activities, mappedActivity]
      }));
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  };

  const handleUpdateActivity = async (activityId: string, updates: Partial<Omit<Activity, 'id'>>) => {
    try {
      await DatabaseService.activities.update(activityId, {
        name: updates.name
      });

      setWeekData(prev => ({
        ...prev,
        activities: prev.activities.map(activity =>
          activity.id === activityId
            ? { ...activity, ...updates }
            : activity
        )
      }));
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await DatabaseService.activities.delete(activityId);
      
      const entries = await DatabaseService.activityEntries.findByActivityId(activityId);
      await Promise.all(entries.map(entry => DatabaseService.activityEntries.delete(entry.id)));

      setWeekData(prev => ({
        ...prev,
        activities: prev.activities.filter(activity => activity.id !== activityId),
        completions: prev.completions.filter(completion => completion.activityId !== activityId)
      }));
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  const handleToggleCompletion = async (activityId: string, date: string, completed: boolean) => {
    if (!currentUser) return;

    try {
      const existingEntry = await DatabaseService.activityEntries.findByActivityAndDate(activityId, date);
      
      if (existingEntry) {
        await DatabaseService.activityEntries.update(existingEntry.id, { completed });
      } else {
        await DatabaseService.activityEntries.create({
          activityId,
          userId: currentUser.id,
          date,
          completed
        });
      }

      setWeekData(prev => {
        const existingCompletionIndex = prev.completions.findIndex(
          c => c.activityId === activityId && c.date === date
        );

        let newCompletions;
        if (existingCompletionIndex >= 0) {
          newCompletions = [...prev.completions];
          newCompletions[existingCompletionIndex] = {
            ...newCompletions[existingCompletionIndex],
            completed
          };
        } else {
          newCompletions = [...prev.completions, {
            activityId,
            date,
            completed
          }];
        }

        return {
          ...prev,
          completions: newCompletions
        };
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
