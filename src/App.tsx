import { useState } from 'react';
import { Button } from 'react-aria-components';
import { Activity, ActivityCompletion, WeekData } from './types';
import { WeeklyTracker } from './components/WeeklyTracker';
import { ActivityModal } from './components/ActivityModal';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [weekData, setWeekData] = useLocalStorage<WeekData>('caretrack-data', {
    activities: [],
    completions: []
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const handleAddActivity = (activityData: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString()
    };

    setWeekData(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity]
    }));
  };

  const handleUpdateActivity = (activityId: string, updates: Partial<Omit<Activity, 'id'>>) => {
    setWeekData(prev => ({
      ...prev,
      activities: prev.activities.map(activity =>
        activity.id === activityId
          ? { ...activity, ...updates }
          : activity
      )
    }));
  };

  const handleToggleCompletion = (activityId: string, date: string, completed: boolean) => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">CareTrack</h1>
            <p className="text-sm text-gray-600 hidden sm:block">Track your daily activities</p>
          </div>
          <Button
            onPress={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-blue-600 font-medium text-sm sm:text-base"
          >
            Add Activity
          </Button>
        </div>

        <WeeklyTracker
          activities={weekData.activities}
          completions={weekData.completions}
          onToggleCompletion={handleToggleCompletion}
          onEditActivity={setEditingActivity}
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
        />
      </div>
    </div>
  );
}

export default App;