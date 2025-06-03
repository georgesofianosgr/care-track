import { Checkbox } from 'react-aria-components';
import { Activity, ActivityCompletion } from '../types';
import { getWeekDates, formatDate, getDayNames } from '../utils/dateUtils';

interface WeeklyTrackerProps {
  activities: Activity[];
  completions: ActivityCompletion[];
  onToggleCompletion: (activityId: string, date: string, completed: boolean) => void;
}

export function WeeklyTracker({ activities, completions, onToggleCompletion }: WeeklyTrackerProps) {
  const weekDates = getWeekDates();
  const dayNames = getDayNames();

  const isActivityCompleted = (activityId: string, date: string): boolean => {
    return completions.some(c => c.activityId === activityId && c.date === date && c.completed);
  };

  const isActivityScheduledForDay = (activity: Activity, dayIndex: number): boolean => {
    return activity.days.includes(dayIndex);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
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