import { useState } from 'react';
import { Checkbox } from 'react-aria-components';
import { Activity, ActivityCompletion } from '../types';
import { getWeekDates, formatDate, getDayNames } from '../utils/dateUtils';

interface WeeklyTrackerProps {
  activities: Activity[];
  completions: ActivityCompletion[];
  onToggleCompletion: (activityId: string, date: string, completed: boolean) => void;
  onEditActivity: (activity: Activity) => void;
}

export function WeeklyTracker({ activities, completions, onToggleCompletion, onEditActivity }: WeeklyTrackerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);
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

  const getActivityCompletionCount = (activityId: string): number => {
    return completions.filter(c => 
      c.activityId === activityId && 
      c.completed && 
      weekDates.some(date => formatDate(date) === c.date)
    ).length;
  };

  const getActivityScheduledCount = (activity: Activity): number => {
    return weekDates.filter((_, dayIndex) => 
      isActivityScheduledForDay(activity, dayIndex)
    ).length;
  };

  const getMonthlyActivityStats = (activityId: string) => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Get all days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const monthDates = [];
    for (let day = 1; day <= daysInMonth; day++) {
      monthDates.push(new Date(currentYear, currentMonth, day));
    }
    
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return { completed: 0, scheduled: 0 };
    
    let scheduled = 0;
    let completed = 0;
    
    monthDates.forEach(date => {
      const dayIndex = date.getDay();
      if (activity.days.includes(dayIndex)) {
        scheduled++;
        const dateStr = formatDate(date);
        if (completions.some(c => c.activityId === activityId && c.date === dateStr && c.completed)) {
          completed++;
        }
      }
    });
    
    return { completed, scheduled };
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-2 sm:p-4">
      {/* Summary Card */}
      <div className="mb-3 sm:mb-4">
        <button
          onClick={() => setSummaryCollapsed(!summaryCollapsed)}
          className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm sm:text-base font-medium text-gray-700">
            Weekly Summary
          </span>
          <svg 
            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform ${
              summaryCollapsed ? '' : 'rotate-180'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {!summaryCollapsed && (
          <div className="mt-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
            {activities.length > 0 ? (
              <div className="space-y-3">
                {/* Weekly Stats */}
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">This Week</h4>
                  <div className="space-y-2">
                    {activities.map(activity => {
                      const completed = getActivityCompletionCount(activity.id);
                      const scheduled = getActivityScheduledCount(activity);
                      const percentage = scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
                      
                      return (
                        <div key={`week-${activity.id}`} className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-gray-700 flex-1 mr-2">
                            {activity.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                              {completed}/{scheduled}
                            </span>
                            <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 min-w-[2.5rem] text-right">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Monthly Stats */}
                <div className="border-t border-gray-200 pt-3">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">{getMonthYear()}</h4>
                  <div className="space-y-2">
                    {activities.map(activity => {
                      const { completed, scheduled } = getMonthlyActivityStats(activity.id);
                      const percentage = scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
                      
                      return (
                        <div key={`month-${activity.id}`} className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-gray-700 flex-1 mr-2">
                            {activity.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                              {completed}/{scheduled}
                            </span>
                            <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 min-w-[2.5rem] text-right">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 text-center">
                No activities to summarize
              </p>
            )}
          </div>
        )}
      </div>
      
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
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateWeek('next')}
            className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Next week"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded flex items-center justify-center cursor-pointer ${
                            isCompleted 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-gray-300 hover:border-blue-400'
                          }`}>
                            {isCompleted && (
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </Checkbox>
                      ) : (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-100 rounded mx-auto"></div>
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