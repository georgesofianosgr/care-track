import { Checkbox } from 'react-aria-components';
import { Activity, ActivityCompletion } from '../types';
import { getWeekDates, formatDate, getDayNames } from '../utils/dateUtils';

interface WeeklyTrackerProps {
  activities: Activity[];
  completions: ActivityCompletion[];
  onToggleCompletion: (activityId: string, date: string, completed: boolean) => void;
  onEditActivity: (activity: Activity) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function WeeklyTracker({ activities, completions, onToggleCompletion, onEditActivity, currentDate, onDateChange }: WeeklyTrackerProps) {
  const weekDates = getWeekDates(currentDate);
  const dayNames = getDayNames();

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    onDateChange(newDate);
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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-2 sm:p-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{getMonthYear()}</h2>
          <p className="text-xs sm:text-sm text-gray-600 truncate">Week of {getWeekRange()}</p>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Previous week"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => onDateChange(new Date())}
            className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateWeek('next')}
            className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Next week"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-1 font-medium text-sm w-20 sm:w-auto sm:text-base sm:p-2">Activity</th>
              {weekDates.map((date, index) => (
                <th key={date.toISOString()} className="text-center p-0.5 sm:p-1 font-medium w-10 sm:w-12">
                  <div className="text-xs text-gray-600">{dayNames[index].slice(0, 2)}</div>
                  <div className="text-xs">{date.getDate()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-t">
                <td className="p-1 sm:p-2 font-medium text-xs sm:text-sm">
                  <div className="flex items-center justify-between group">
                    <div className="break-words flex-1">{activity.name}</div>
                    <button
                      onClick={() => onEditActivity(activity)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 ml-2 p-1 text-gray-500 hover:text-blue-500 transition-all"
                      aria-label="Edit activity"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </td>
                {weekDates.map((date, dayIndex) => {
                  const dateStr = formatDate(date);
                  const isScheduled = isActivityScheduledForDay(activity, dayIndex);
                  const isCompleted = isActivityCompleted(activity.id, dateStr);
                  
                  return (
                    <td key={dateStr} className="text-center px-0.5 py-2 sm:px-1 sm:py-2">
                      {isScheduled ? (
                        <Checkbox
                          isSelected={isCompleted}
                          onChange={(checked) => onToggleCompletion(activity.id, dateStr, checked)}
                          className="flex justify-center"
                        >
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 border-2 rounded flex items-center justify-center cursor-pointer ${
                            isCompleted 
                              ? 'bg-gray-700 border-gray-700' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}>
                            {isCompleted && (
                              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </Checkbox>
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded mx-auto"></div>
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
        <div className="text-center py-4 sm:py-8 text-gray-500 text-sm">
          No activities yet. Add your first activity to get started!
        </div>
      )}
    </div>
  );
}