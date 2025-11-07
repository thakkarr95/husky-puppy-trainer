import { useState, useEffect } from 'react';
import type { DailyTodoEntry } from '../types';
import { puppyDailySchedule } from '../dailyScheduleData';

interface DailyTodoListProps {
  todoEntries: DailyTodoEntry[];
  onUpdateTodo: (entry: DailyTodoEntry) => void;
  onQuickLogFood?: () => void;
  onQuickLogPotty?: (type: 'pee' | 'poop' | 'both') => void;
}

function DailyTodoList({ todoEntries, onUpdateTodo, onQuickLogFood, onQuickLogPotty }: DailyTodoListProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [todayEntry, setTodayEntry] = useState<DailyTodoEntry | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    // Find or create entry for selected date
    const dateToFind = new Date(selectedDate);
    dateToFind.setHours(0, 0, 0, 0);
    
    const existing = todoEntries.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === dateToFind.getTime();
    });
    
    if (existing) {
      setTodayEntry(existing);
    } else {
      // Create new entry for selected date
      const newEntry: DailyTodoEntry = {
        id: Date.now().toString(),
        date: new Date(selectedDate),
        items: puppyDailySchedule.map(item => ({
          scheduleItemId: item.id,
          completed: false
        }))
      };
      setTodayEntry(newEntry);
      onUpdateTodo(newEntry);
    }
  }, [todoEntries, onUpdateTodo, selectedDate]);

  const handleToggleItem = (scheduleItemId: string) => {
    if (!todayEntry) return;

    const updatedItems = todayEntry.items.map(item => {
      if (item.scheduleItemId === scheduleItemId) {
        return {
          ...item,
          completed: !item.completed,
          completedAt: !item.completed ? new Date() : undefined
        };
      }
      return item;
    });

    const updatedEntry: DailyTodoEntry = {
      ...todayEntry,
      items: updatedItems
    };

    setTodayEntry(updatedEntry);
    onUpdateTodo(updatedEntry);
  };

  const isItemCompleted = (scheduleItemId: string): boolean => {
    if (!todayEntry) return false;
    const item = todayEntry.items.find(i => i.scheduleItemId === scheduleItemId);
    return item?.completed || false;
  };

  const getCompletionStats = () => {
    if (!todayEntry) return { completed: 0, total: 0, percentage: 0 };
    
    const total = todayEntry.items.length;
    const completed = todayEntry.items.filter(i => i.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  const filterItems = () => {
    if (filterCategory === 'all') return puppyDailySchedule;
    return puppyDailySchedule.filter(item => item.category === filterCategory);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Feeding: '🍖',
      Potty: '🚽',
      Training: '🎓',
      Exercise: '🏃',
      Sleep: '😴',
      Play: '🎾'
    };
    return icons[category] || '📋';
  };

  const stats = getCompletionStats();
  const filteredItems = filterItems();

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return today.getTime() === selected.getTime();
  };

  return (
    <div className="daily-todo-container">
      <div className="todo-header">
        <h2>📅 Daily Schedule</h2>
        
        {/* Date Navigation */}
        <div className="date-navigation">
          <button onClick={() => navigateDate(-1)} className="nav-btn">◀ Prev</button>
          <div className="date-display">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            {isToday() && <span className="today-badge">Today</span>}
          </div>
          <button onClick={() => navigateDate(1)} className="nav-btn">Next ▶</button>
        </div>
        {!isToday() && (
          <button onClick={() => setSelectedDate(new Date())} className="jump-today-btn">
            Jump to Today
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="todo-progress-section">
        <div className="todo-progress-header">
          <span className="progress-label">Daily Progress</span>
          <span className="progress-stats">{stats.completed} of {stats.total} completed</span>
        </div>
        <div className="todo-progress-bar">
          <div className="todo-progress-fill" style={{ width: `${stats.percentage}%` }} />
        </div>
        <div className="progress-percentage">{stats.percentage}%</div>
      </div>

      {/* Read-only notice for past/future dates */}
      {!isToday() && (
        <div className="view-only-notice">
          👀 <strong>View Only:</strong> You can only log activities for today. Use this to review past schedules or plan ahead.
        </div>
      )}

      {/* Category Filter */}
      <div className="category-filter">
        <button 
          className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
          onClick={() => setFilterCategory('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filterCategory === 'Feeding' ? 'active' : ''}`}
          onClick={() => setFilterCategory('Feeding')}
        >
          🍖 Feed
        </button>
        <button 
          className={`filter-btn ${filterCategory === 'Potty' ? 'active' : ''}`}
          onClick={() => setFilterCategory('Potty')}
        >
          🚽 Potty
        </button>
        <button 
          className={`filter-btn ${filterCategory === 'Training' ? 'active' : ''}`}
          onClick={() => setFilterCategory('Training')}
        >
          🎓 Train
        </button>
        <button 
          className={`filter-btn ${filterCategory === 'Sleep' ? 'active' : ''}`}
          onClick={() => setFilterCategory('Sleep')}
        >
          😴 Sleep
        </button>
        <button 
          className={`filter-btn ${filterCategory === 'Play' ? 'active' : ''}`}
          onClick={() => setFilterCategory('Play')}
        >
          🎾 Play
        </button>
      </div>

      {/* Todo List */}
      <div className="todo-list">
        {filteredItems.map((item) => {
          const completed = isItemCompleted(item.id);
          const canEdit = isToday(); // Only allow editing today's tasks
          return (
            <div key={item.id} className={`todo-item ${completed ? 'completed' : ''} ${!canEdit ? 'read-only' : ''} category-${item.category.toLowerCase()}`}>
              <div className="todo-checkbox-wrapper">
                <input
                  type="checkbox"
                  id={`todo-${item.id}`}
                  className="todo-checkbox"
                  checked={completed}
                  onChange={() => canEdit && handleToggleItem(item.id)}
                  disabled={!canEdit}
                />
                <label htmlFor={`todo-${item.id}`} className="checkbox-custom"></label>
              </div>
              
              <div className="todo-content">
                <div className="todo-time-badge">{item.time}</div>
                <div className="todo-main">
                  <div className="todo-activity">
                    <span className="category-icon">{getCategoryIcon(item.category)}</span>
                    <span className="activity-title">{item.activity}</span>
                    {item.duration && <span className="duration-badge">{item.duration}</span>}
                  </div>
                  <div className="todo-description">{item.description}</div>
                  {item.trainingTaskId && (
                    <div className="training-link">
                      <span className="training-icon">🎯</span>
                      <span>Linked to training task</span>
                    </div>
                  )}
                  
                  {/* Quick Log Buttons for Feeding and Potty */}
                  {canEdit && item.category === 'Feeding' && onQuickLogFood && (
                    <button 
                      className="quick-log-btn food-log"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickLogFood();
                      }}
                    >
                      🍖 Log Feed
                    </button>
                  )}
                  
                  {canEdit && item.category === 'Potty' && onQuickLogPotty && (
                    <div className="quick-potty-buttons">
                      <button 
                        className="quick-log-btn potty-pee"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickLogPotty('pee');
                        }}
                      >
                        💧 Pee
                      </button>
                      <button 
                        className="quick-log-btn potty-poop"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickLogPotty('poop');
                        }}
                      >
                        💩 Poop
                      </button>
                      <button 
                        className="quick-log-btn potty-both"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickLogPotty('both');
                        }}
                      >
                        💧💩 Both
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyTodoList;
