import { useState } from 'react';
import { Activity, WeekData } from './types';
import { WeeklyTracker } from './components/WeeklyTracker';
import { WeeklySummary } from './components/WeeklySummary';
import { ActivityModal } from './components/ActivityModal';
import { BottomNavigation } from './components/BottomNavigation';
import { useLocalStorage } from './hooks/useLocalStorage';
import logo from './assets/logo.png';

function App() {
  const [weekData, setWeekData] = useLocalStorage<WeekData>('caretrack-data', {
    activities: [],
    completions: []
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const handleDeleteActivity = (activityId: string) => {
    setWeekData(prev => ({
      ...prev,
      activities: prev.activities.filter(activity => activity.id !== activityId),
      completions: prev.completions.filter(completion => completion.activityId !== activityId)
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
    <div className="min-h-screen pb-16">
      <div className="px-2 sm:px-4 pt-6 sm:pt-8 pb-16" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center" style={{ marginTop: '20px' }}>
            <img src={logo} alt="CareTrack Logo" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl tracking-wide text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
              <span className="font-bold">Care</span><span className="font-thin">Track</span>
            </h1>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-2 sm:px-4 -mt-4">
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
      </div>

      <BottomNavigation onAddActivity={() => setIsModalOpen(true)} />
    </div>
  );
}

export default App;
