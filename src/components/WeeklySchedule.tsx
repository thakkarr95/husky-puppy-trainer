import { useState } from 'react';
import type { TrainingTask } from '../types';
import TaskCard from './TaskCard';
import { weeklySchedules } from '../weeklyData';
import { puppyDailySchedule, scheduleNotes } from '../dailyScheduleData';

interface WeeklyScheduleProps {
  tasksByWeek: { [week: number]: TrainingTask[] };
  onTasksUpdate: (week: number, tasks: TrainingTask[]) => void;
}

const WeeklySchedule = ({ tasksByWeek, onTasksUpdate }: WeeklyScheduleProps) => {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);
  const [showDailySchedule, setShowDailySchedule] = useState(false);

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
  };

  const handleTaskCompletion = (week: number, taskId: string, completed: boolean) => {
    const weekTasks = tasksByWeek[week] || [];
    const updatedTasks = weekTasks.map(task =>
      task.id === taskId ? { ...task, completed } : task
    );
    onTasksUpdate(week, updatedTasks);
  };

  const getWeekProgress = (week: number) => {
    const tasks = tasksByWeek[week] || [];
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getWeekStatus = (week: number) => {
    const progress = getWeekProgress(week);
    if (progress === 100) return 'week-completed';
    if (progress > 0) return 'week-in-progress';
    return 'week-not-started';
  };

  const weeks = Object.keys(tasksByWeek).map(Number).sort((a, b) => a - b);

  const getTotalProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;
    weeks.forEach(week => {
      const tasks = tasksByWeek[week] || [];
      totalTasks += tasks.length;
      completedTasks += tasks.filter(t => t.completed).length;
    });
    return { totalTasks, completedTasks, percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0 };
  };

  const totalProgress = getTotalProgress();

  const getWeekDetails = (weekNum: number) => {
    return weeklySchedules.find(w => w.week === weekNum);
  };

  return (
    <div className="weekly-schedule">
      <div className="overall-progress">
        <h3>Overall Training Progress</h3>
        <div className="progress-summary">
          <div className="progress-bar-large">
            <div 
              className="progress-fill-large" 
              style={{ width: `${totalProgress.percentage}%` }}
            />
          </div>
          <div className="progress-stats">
            <span className="progress-number">{totalProgress.percentage}% Complete</span>
            <span className="progress-details">
              {totalProgress.completedTasks} of {totalProgress.totalTasks} tasks completed
            </span>
          </div>
        </div>
      </div>
      {weeks.map(week => {
        const tasks = tasksByWeek[week] || [];
        const isExpanded = expandedWeeks.includes(week);
        const progress = getWeekProgress(week);
        const weekStatus = getWeekStatus(week);
        const weekDetails = getWeekDetails(week);

        return (
          <div key={week} className={`week-section ${weekStatus}`}>
            <div 
              className="week-header" 
              onClick={() => toggleWeek(week)}
            >
              <div className="week-title">
                <span className="week-icon">{isExpanded ? '▼' : '▶'}</span>
                <div className="week-title-content">
                  <h2>{weekDetails?.title || `Week ${week}`}</h2>
                  <span className="task-count">
                    {tasks.filter(t => t.completed).length}/{tasks.length} tasks
                  </span>
                </div>
              </div>
              <div className="week-progress">
                <div className="progress-bar-small">
                  <div 
                    className="progress-fill-small" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="progress-text-small">{progress}%</span>
              </div>
            </div>
            {isExpanded && (
              <div className="week-content">
                {weekDetails && (
                  <div className="week-details-section">
                    {weekDetails.description && (
                      <p className="week-description">{weekDetails.description}</p>
                    )}
                    
                    <div className="week-info-grid">
                      {weekDetails.focusAreas && weekDetails.focusAreas.length > 0 && (
                        <div className="week-info-box focus-areas">
                          <h4>🎯 Focus Areas</h4>
                          <ul>
                            {weekDetails.focusAreas.map((area, idx) => (
                              <li key={idx}>{area}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {weekDetails.keyMilestones && weekDetails.keyMilestones.length > 0 && (
                        <div className="week-info-box milestones">
                          <h4>🏆 Key Milestones</h4>
                          <ul>
                            {weekDetails.keyMilestones.map((milestone, idx) => (
                              <li key={idx}>{milestone}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {weekDetails.tips && weekDetails.tips.length > 0 && (
                      <div className="week-info-box tips">
                        <h4>💡 Training Tips</h4>
                        <ul>
                          {weekDetails.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="tasks-grid">
                  {tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onCompletionChange={(taskId, completed) => 
                        handleTaskCompletion(week, taskId, completed)
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Daily Schedule Section */}
      <div className="daily-schedule-section">
        <div className="section-header-collapsible" onClick={() => setShowDailySchedule(!showDailySchedule)}>
          <h2 className="section-title">🕐 Recommended Daily Schedule</h2>
          <span className="toggle-icon">{showDailySchedule ? '▼' : '▶'}</span>
        </div>
        
        {showDailySchedule && (
          <>
            <div className="schedule-intro">
              <p>This schedule is designed for puppies 8-16 weeks old. Adjust timing to fit your lifestyle, 
              but maintain consistency. As your puppy grows, you'll reduce meal frequency and can extend sleep periods.</p>
            </div>

            <div className="schedule-notes-section">
              <h3>📝 Schedule Adjustments by Age</h3>
              <ul className="schedule-notes-list">
                {scheduleNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="daily-timeline">
              {puppyDailySchedule.map((item, index) => {
                const categoryColors: { [key: string]: string } = {
                  'Feeding': '#f093fb',
                  'Potty': '#4facfe',
                  'Training': '#fa709a',
                  'Exercise': '#43e97b',
                  'Sleep': '#764ba2',
                  'Play': '#30cfd0'
                };

                return (
                  <div key={index} className="timeline-item">
                    <div className="timeline-time">
                      <span className="time-label">{item.time}</span>
                      {item.duration && (
                        <span className="duration-label">{item.duration}</span>
                      )}
                    </div>
                    <div 
                      className="timeline-marker"
                      style={{ backgroundColor: categoryColors[item.category] }}
                    >
                      <div className="timeline-line" />
                    </div>
                    <div className="timeline-content">
                      <div 
                        className="category-tag"
                        style={{ backgroundColor: categoryColors[item.category] }}
                      >
                        {item.category}
                      </div>
                      <h4>{item.activity}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeeklySchedule;
