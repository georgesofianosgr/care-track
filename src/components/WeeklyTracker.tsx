import { useState } from 'react';
import { Checkbox } from 'react-aria-components';
import { Activity, ActivityCompletion } from '../types';
import { getWeekDates, formatDate, getDayNames } from '../utils/dateUtils';

interface WeeklyTrackerProps {
  activities: Activity[];
  completions: ActivityCompletion[];
  onToggleCompletion: (activityId: string, date: string, completed: boolean) => void;
}

export function WeeklyTracker({ activities, completions, onToggleCompletion }: WeeklyTrackerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekDates = getWeekDates(currentDate);
  const dayNames = getDayNames();

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getWeekRange = () => {
    const firstDay = weekDates[0];
    const lastDay = weekDates[6];
    const firstMonth = firstDay.toLocaleDateString('en-US', { month: 'short' });
    const lastMonth = lastDay.toLocaleDateString('en-US', { month: 'short' });
    
    if (firstMonth === lastMonth) {
      return `${firstMonth} ${firstDay.getDate()}-${lastDay.getDate()}`;
    } else {
      return `${firstMonth} ${firstDay.getDate()} - ${lastMonth} ${lastDay.getDate()}`;
    }
  };

  const isActivityCompleted = (activityId: string, date: string): boolean => {
    return completions.some(c => c.activityId === activityId && c.date === date && c.completed);
  };

  const isActivityScheduledForDay = (activity: Activity, dayIndex: number): boolean => {
    return activity.days.includes(dayIndex);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{getMonthYear()}</h2>
          <p className="text-sm text-gray-600">Week of {getWeekRange()}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Previous week"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Next week"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] sm:min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left p-1 sm:p-2 font-medium text-sm sm:text-base">Activity</th>
              {weekDates.map((date, index) => (
                <th key={date.toISOString()} className="text-center p-1 sm:p-2 font-medium min-w-[45px] sm:min-w-[60px]">
                  <div className="text-xs text-gray-600">{dayNames[index]}</div>
                  <div className="text-xs sm:text-sm">{date.getDate()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-t">
                <td className="p-1 sm:p-2 font-medium text-sm sm:text-base">{activity.name}</td>
                {weekDates.map((date, dayIndex) => {
                  const dateStr = formatDate(date);
                  const isScheduled = isActivityScheduledForDay(activity, dayIndex);
                  const isCompleted = isActivityCompleted(activity.id, dateStr);
                  
                  return (
                    <td key={dateStr} className="text-center p-1 sm:p-2">
                      {isScheduled ? (
                        <Checkbox
                          isSelected={isCompleted}
                          onChange={(checked) => onToggleCompletion(activity.id, dateStr, checked)}
                          className="flex justify-center"
                        >
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded flex items-center justify-center cursor-pointer ${
                            isCompleted 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300 hover:border-green-400'
                          }`}>
                            {isCompleted && (
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </Checkbox>
                      ) : (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No activities yet. Add your first activity to get started!
        </div>
      )}
    </div>
  );
}