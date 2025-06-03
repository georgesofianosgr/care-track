import { useState } from 'react';
import { Activity, ActivityCompletion } from '../types';
import { getWeekDates, formatDate } from '../utils/dateUtils';

interface WeeklySummaryProps {
  activities: Activity[];
  completions: ActivityCompletion[];
  currentDate: Date;
}

export function WeeklySummary({ activities, completions, currentDate }: WeeklySummaryProps) {
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);
  const weekDates = getWeekDates(currentDate);

  const getMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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
      activity.days.includes(dayIndex)
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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-2 sm:p-4 mb-4">
      <button
        onClick={() => setSummaryCollapsed(!summaryCollapsed)}
        className="w-full flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm sm:text-base font-medium text-gray-700">
          Statistics
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
  );
}