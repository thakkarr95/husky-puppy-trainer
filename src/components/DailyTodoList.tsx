import { useState, useEffect } from 'react';
import type { DailyTodoEntry } from '../types';
import { puppyDailySchedule } from '../dailyScheduleData';

interface DailyTodoListProps {
  todoEntries: DailyTodoEntry[];
  onUpdateTodo: (entry: DailyTodoEntry) => void;
  onQuickLogFood?: (scheduleItemId: string, amount?: number, isTreat?: boolean) => void;
  onQuickLogPotty?: (scheduleItemId: string, type: 'pee' | 'poop' | 'both', location: 'outside' | 'inside', customTime?: string) => void;
  onQuickLogSleep?: (duration?: number, quality?: 'poor' | 'fair' | 'good' | 'excellent') => void;
}

function DailyTodoList({ todoEntries, onUpdateTodo, onQuickLogFood, onQuickLogPotty, onQuickLogSleep }: DailyTodoListProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [todayEntry, setTodayEntry] = useState<DailyTodoEntry | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [pottyLocations, setPottyLocations] = useState<Record<string, 'outside' | 'inside'>>({});
  const [feedingAmounts, setFeedingAmounts] = useState<Record<string, number>>({});
  const [showTreatLog, setShowTreatLog] = useState(false);
  const [showFoodLog, setShowFoodLog] = useState(false);
  const [showPottyLog, setShowPottyLog] = useState(false);
  const [quickFoodAmount, setQuickFoodAmount] = useState(0.25);
  const [quickPottyType, setQuickPottyType] = useState<'pee' | 'poop' | 'both'>('pee');
  const [quickPottyLocation, setQuickPottyLocation] = useState<'outside' | 'inside'>('outside');
  const [quickSleepQuality, setQuickSleepQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good');
  const [napStartTime, setNapStartTime] = useState<Date | null>(null);
  const [napElapsedSeconds, setNapElapsedSeconds] = useState(0);
  const [loggedPottyTypes, setLoggedPottyTypes] = useState<Record<string, Set<'pee' | 'poop'>>>({});
  const [showFollowUpForm, setShowFollowUpForm] = useState<Record<string, boolean>>({});
  const [followUpTimes, setFollowUpTimes] = useState<Record<string, string>>({});
  const [followUpLocations, setFollowUpLocations] = useState<Record<string, 'outside' | 'inside'>>({});

  // Nap timer effect
  useEffect(() => {
    if (!napStartTime) return;
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - napStartTime.getTime()) / 1000);
      setNapElapsedSeconds(elapsed);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [napStartTime]);

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

      {/* Quick Log Sections */}
      {isToday() && (
        <>
          {/* Quick Food Log */}
          {onQuickLogFood && (
            <div className="quick-treat-section">
              <button 
                className="treat-toggle-btn"
                onClick={() => setShowFoodLog(!showFoodLog)}
              >
                🍖 {showFoodLog ? 'Hide' : 'Log Feeding'}
              </button>
              {showFoodLog && (
                <div className="treat-log-form">
                  <label>Amount (cups):</label>
                  <input 
                    type="number"
                    step="0.25"
                    min="0"
                    max="2"
                    value={quickFoodAmount}
                    onChange={(e) => setQuickFoodAmount(parseFloat(e.target.value) || 0.25)}
                    className="amount-input"
                  />
                  <button 
                    className="quick-log-btn treat-log"
                    onClick={() => {
                      onQuickLogFood('quick-food', quickFoodAmount, false);
                      setShowFoodLog(false);
                    }}
                  >
                    🍖 Log Feeding
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Potty Log */}
          {onQuickLogPotty && (
            <div className="quick-treat-section">
              <button 
                className="treat-toggle-btn"
                onClick={() => setShowPottyLog(!showPottyLog)}
              >
                🚽 {showPottyLog ? 'Hide' : 'Log Potty Break'}
              </button>
              {showPottyLog && (
                <div className="treat-log-form">
                  <label>Type:</label>
                  <select 
                    value={quickPottyType}
                    onChange={(e) => setQuickPottyType(e.target.value as 'pee' | 'poop' | 'both')}
                    className="amount-input"
                  >
                    <option value="pee">Pee</option>
                    <option value="poop">Poop</option>
                    <option value="both">Both</option>
                  </select>
                  <label>Location:</label>
                  <select 
                    value={quickPottyLocation}
                    onChange={(e) => setQuickPottyLocation(e.target.value as 'outside' | 'inside')}
                    className="amount-input"
                  >
                    <option value="outside">Outside</option>
                    <option value="inside">Inside</option>
                  </select>
                  <button 
                    className="quick-log-btn treat-log"
                    onClick={() => {
                      console.log('Quick potty button clicked, onQuickLogPotty is:', onQuickLogPotty);
                      if (onQuickLogPotty) {
                        console.log('Calling onQuickLogPotty with:', 'quick-potty', quickPottyType, quickPottyLocation);
                        onQuickLogPotty('quick-potty', quickPottyType, quickPottyLocation);
                        setShowPottyLog(false);
                      } else {
                        console.error('onQuickLogPotty is not defined!');
                      }
                    }}
                  >
                    🚽 Log Potty
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Sleep Log - Nap Timer */}
          {onQuickLogSleep && (
            <div className="quick-treat-section">
              {!napStartTime ? (
                <button 
                  className="treat-toggle-btn"
                  onClick={() => {
                    setNapStartTime(new Date());
                    setNapElapsedSeconds(0);
                  }}
                  style={{ backgroundColor: '#4CAF50', color: 'white' }}
                >
                  💤 Start Nap
                </button>
              ) : (
                <div className="treat-log-form">
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    textAlign: 'center', 
                    margin: '10px 0',
                    color: '#4CAF50'
                  }}>
                    ⏱️ Nap in Progress: {Math.floor(napElapsedSeconds / 3600)}h {Math.floor((napElapsedSeconds % 3600) / 60)}m {napElapsedSeconds % 60}s
                  </div>
                  
                  <label>Quality:</label>
                  <select 
                    value={quickSleepQuality}
                    onChange={(e) => setQuickSleepQuality(e.target.value as 'poor' | 'fair' | 'good' | 'excellent')}
                    className="amount-input"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                  
                  <button 
                    className="quick-log-btn treat-log"
                    onClick={() => {
                      if (napStartTime && onQuickLogSleep) {
                        const durationHours = napElapsedSeconds / 3600;
                        onQuickLogSleep(durationHours, quickSleepQuality);
                        setNapStartTime(null);
                        setNapElapsedSeconds(0);
                      }
                    }}
                    style={{ backgroundColor: '#f44336', marginRight: '10px' }}
                  >
                    ⏹️ Stop & Log
                  </button>
                  <button 
                    className="quick-log-btn"
                    onClick={() => {
                      setNapStartTime(null);
                      setNapElapsedSeconds(0);
                    }}
                    style={{ backgroundColor: '#666' }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Quick Treat Log */}
      {isToday() && onQuickLogFood && (
        <div className="quick-treat-section">
          <button 
            className="treat-toggle-btn"
            onClick={() => setShowTreatLog(!showTreatLog)}
          >
            🦴 {showTreatLog ? 'Hide' : 'Log Training Treats'}
          </button>
          {showTreatLog && (
            <div className="treat-log-form">
              <label>Treat Amount (pieces/cups):</label>
              <input 
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={feedingAmounts['treats'] || 0.1}
                onChange={(e) => {
                  setFeedingAmounts(prev => ({ ...prev, treats: parseFloat(e.target.value) || 0.1 }));
                }}
                className="amount-input"
              />
              <button 
                className="quick-log-btn treat-log"
                onClick={() => {
                  onQuickLogFood('training-treats', feedingAmounts['treats'] || 0.1, true);
                  setShowTreatLog(false);
                }}
              >
                🦴 Log Treats
              </button>
            </div>
          )}
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
                    <div className="quick-feed-section">
                      <div className="feed-amount-input">
                        <label>Amount (cups):</label>
                        <input 
                          type="number"
                          step="0.25"
                          min="0"
                          max="5"
                          value={feedingAmounts[item.id] || 0.5}
                          onChange={(e) => {
                            e.stopPropagation();
                            setFeedingAmounts(prev => ({ ...prev, [item.id]: parseFloat(e.target.value) || 0.5 }));
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="amount-input"
                        />
                      </div>
                      <button 
                        className="quick-log-btn food-log"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickLogFood(item.id, feedingAmounts[item.id] || 0.5, false);
                        }}
                      >
                        🍖 Log Feed
                      </button>
                    </div>
                  )}
                  
                  {canEdit && item.category === 'Potty' && onQuickLogPotty && (
                    <div className="quick-potty-section">
                      <div className="potty-location-selector">
                        <button 
                          className={`location-toggle ${(pottyLocations[item.id] || 'outside') === 'outside' ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPottyLocations(prev => ({ ...prev, [item.id]: 'outside' }));
                          }}
                        >
                          ✓ Outside
                        </button>
                        <button 
                          className={`location-toggle ${(pottyLocations[item.id] || 'outside') === 'inside' ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPottyLocations(prev => ({ ...prev, [item.id]: 'inside' }));
                          }}
                        >
                          ✗ Accident
                        </button>
                      </div>
                      <div className="quick-potty-buttons">
                        <button 
                          className="quick-log-btn potty-pee"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickLogPotty(item.id, 'pee', pottyLocations[item.id] || 'outside');
                            // Track what was logged
                            setLoggedPottyTypes(prev => {
                              const itemSet = prev[item.id] || new Set<'pee' | 'poop'>();
                              itemSet.add('pee');
                              return { ...prev, [item.id]: itemSet };
                            });
                            // Show follow-up if only one type logged
                            const currentTypes = loggedPottyTypes[item.id] || new Set();
                            if (currentTypes.size === 0 || (currentTypes.size === 1 && !currentTypes.has('pee'))) {
                              setShowFollowUpForm(prev => ({ ...prev, [item.id]: true }));
                            }
                          }}
                        >
                          💧 Pee
                        </button>
                        <button 
                          className="quick-log-btn potty-poop"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickLogPotty(item.id, 'poop', pottyLocations[item.id] || 'outside');
                            // Track what was logged
                            setLoggedPottyTypes(prev => {
                              const itemSet = prev[item.id] || new Set<'pee' | 'poop'>();
                              itemSet.add('poop');
                              return { ...prev, [item.id]: itemSet };
                            });
                            // Show follow-up if only one type logged
                            const currentTypes = loggedPottyTypes[item.id] || new Set();
                            if (currentTypes.size === 0 || (currentTypes.size === 1 && !currentTypes.has('poop'))) {
                              setShowFollowUpForm(prev => ({ ...prev, [item.id]: true }));
                            }
                          }}
                        >
                          💩 Poop
                        </button>
                        <button 
                          className="quick-log-btn potty-both"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickLogPotty(item.id, 'both', pottyLocations[item.id] || 'outside');
                            // Track that both were logged
                            setLoggedPottyTypes(prev => {
                              const itemSet = new Set<'pee' | 'poop'>(['pee', 'poop']);
                              return { ...prev, [item.id]: itemSet };
                            });
                            // Don't show follow-up since both were logged
                            setShowFollowUpForm(prev => ({ ...prev, [item.id]: false }));
                          }}
                        >
                          💧💩 Both
                        </button>
                      </div>
                      
                      {/* Follow-up form for logging the other type */}
                      {showFollowUpForm[item.id] && (
                        <div className="potty-followup-form">
                          <div className="followup-header">
                            <span>
                              {loggedPottyTypes[item.id]?.has('pee') && !loggedPottyTypes[item.id]?.has('poop') 
                                ? '💩 Did pup poop later?' 
                                : '💧 Did pup pee later?'}
                            </span>
                            <button 
                              className="close-followup"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowFollowUpForm(prev => ({ ...prev, [item.id]: false }));
                              }}
                            >
                              ✕
                            </button>
                          </div>
                          
                          {/* Location selector for follow-up */}
                          <div className="followup-location-selector">
                            <button 
                              className={`location-toggle ${(followUpLocations[item.id] || 'outside') === 'outside' ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFollowUpLocations(prev => ({ ...prev, [item.id]: 'outside' }));
                              }}
                            >
                              ✓ Outside
                            </button>
                            <button 
                              className={`location-toggle ${(followUpLocations[item.id] || 'outside') === 'inside' ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFollowUpLocations(prev => ({ ...prev, [item.id]: 'inside' }));
                              }}
                            >
                              ✗ Accident
                            </button>
                          </div>
                          
                          <div className="followup-time-input">
                            <label>Time:</label>
                            <input 
                              type="time"
                              value={followUpTimes[item.id] || ''}
                              onChange={(e) => {
                                e.stopPropagation();
                                setFollowUpTimes(prev => ({ ...prev, [item.id]: e.target.value }));
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="time-input"
                            />
                          </div>
                          <button 
                            className="quick-log-btn followup-log"
                            onClick={(e) => {
                              e.stopPropagation();
                              const missingType = loggedPottyTypes[item.id]?.has('pee') ? 'poop' : 'pee';
                              const followUpLocation = followUpLocations[item.id] || 'outside';
                              // Log with custom time if provided
                              if (followUpTimes[item.id]) {
                                // Convert time string to proper format
                                const [hours, minutes] = followUpTimes[item.id].split(':');
                                const hour12 = parseInt(hours) % 12 || 12;
                                const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
                                const timeString = `${String(hour12).padStart(2, '0')}:${minutes} ${ampm}`;
                                onQuickLogPotty(item.id, missingType, followUpLocation, timeString);
                              } else {
                                onQuickLogPotty(item.id, missingType, followUpLocation);
                              }
                              setLoggedPottyTypes(prev => {
                                const itemSet = prev[item.id] || new Set<'pee' | 'poop'>();
                                itemSet.add(missingType);
                                return { ...prev, [item.id]: itemSet };
                              });
                              setShowFollowUpForm(prev => ({ ...prev, [item.id]: false }));
                            }}
                            disabled={!followUpTimes[item.id]}
                          >
                            Log {loggedPottyTypes[item.id]?.has('pee') ? '💩 Poop' : '💧 Pee'}
                          </button>
                        </div>
                      )}
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
