import { useState, useEffect } from 'react';
import WeeklySchedule from './components/WeeklySchedule';
import FoodTracker from './components/FoodTracker';
import PottyTracker from './components/PottyTracker';
import DailyTodoList from './components/DailyTodoList';
import type { TrainingTask, FoodEntry, PottyEntry, DailyTodoEntry } from './types';
import { weeklyTraining } from './trainingData';
import { puppyDailySchedule } from './dailyScheduleData';
import * as api from './api';
import './App.css';

type TabType = 'daily' | 'schedule' | 'food' | 'potty';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('daily');
  const [tasksByWeek, setTasksByWeek] = useState<Record<number, TrainingTask[]>>(weeklyTraining);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [pottyEntries, setPottyEntries] = useState<PottyEntry[]>([]);
  const [todoEntries, setTodoEntries] = useState<DailyTodoEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSavingTodo, setIsSavingTodo] = useState(false);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
    
    // Check online status and sync data periodically
    const checkOnline = async () => {
      try {
        await api.checkHealth();
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };
    
    checkOnline();
    const healthInterval = setInterval(checkOnline, 30000); // Check every 30 seconds
    
    // Sync data every 2 seconds for near-instant updates across devices
    const syncInterval = setInterval(() => {
      if (isOnline) {
        loadAllData();
      }
    }, 2000); // Sync every 2 seconds for real-time feel
    
    // Reload data when window regains focus (switching back to app)
    const handleFocus = () => {
      if (isOnline) {
        loadAllData();
      }
    };
    window.addEventListener('focus', handleFocus);
    
    // Reload data when page becomes visible (mobile tab switching)
    const handleVisibilityChange = () => {
      if (!document.hidden && isOnline) {
        loadAllData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(healthInterval);
      clearInterval(syncInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOnline]);

  const loadAllData = async () => {
    try {
      setIsSyncing(true);
      const data = await api.syncAllData();
      
      // Merge loaded tasks with defaults
      const merged = { ...weeklyTraining };
      Object.keys(data.trainingTasks).forEach(weekNum => {
        const week = Number(weekNum);
        if (merged[week] && data.trainingTasks[week]) {
          const savedMap = new Map(data.trainingTasks[week].map((t: TrainingTask) => [t.id, t.completed]));
          merged[week] = merged[week].map(task => ({
            ...task,
            completed: savedMap.get(task.id) || false
          }));
        }
      });
      
      setTasksByWeek(Object.keys(merged).length > 0 ? merged : weeklyTraining);
      setFoodEntries(data.foodEntries);
      setPottyEntries(data.pottyEntries);
      
      // Only update todoEntries if we're not currently saving one (avoid race condition)
      if (!isSavingTodo) {
        setTodoEntries(data.todoEntries);
      }
      
      setIsOnline(true);
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
      setIsOnline(false);
      // Fall back to localStorage if server is unavailable
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      // Load training tasks
      const savedTasks = localStorage.getItem('husky-weekly-tasks');
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        const merged = { ...weeklyTraining };
        Object.keys(parsed).forEach(weekNum => {
          const week = Number(weekNum);
          if (merged[week]) {
            const savedMap = new Map(parsed[week].map((t: TrainingTask) => [t.id, t.completed]));
            merged[week] = merged[week].map(task => ({
              ...task,
              completed: (savedMap.get(task.id) as boolean) || false
            }));
          }
        });
        setTasksByWeek(merged);
      }

      // Load food entries
      const savedFoodEntries = localStorage.getItem('husky-food-entries');
      if (savedFoodEntries) {
        const parsed = JSON.parse(savedFoodEntries);
        const entriesWithDates = parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        setFoodEntries(entriesWithDates);
      }

      // Load potty entries
      const savedPottyEntries = localStorage.getItem('husky-potty-entries');
      if (savedPottyEntries) {
        const parsed = JSON.parse(savedPottyEntries);
        const entriesWithDates = parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        setPottyEntries(entriesWithDates);
      }

      // Load todo entries
      const savedTodoEntries = localStorage.getItem('husky-todo-entries');
      if (savedTodoEntries) {
        const parsed = JSON.parse(savedTodoEntries);
        const entriesWithDates = parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
          items: entry.items.map((item: any) => ({
            ...item,
            completedAt: item.completedAt ? new Date(item.completedAt) : undefined
          }))
        }));
        setTodoEntries(entriesWithDates);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const handleTasksUpdate = async (week: number, updatedTasks: TrainingTask[]) => {
    const updatedTasksByWeek = {
      ...tasksByWeek,
      [week]: updatedTasks,
    };
    setTasksByWeek(updatedTasksByWeek);
    
    // Save to both server and localStorage
    try {
      await api.saveTrainingTasks(updatedTasksByWeek);
    } catch (error) {
      console.error('Error saving to server:', error);
    }
    localStorage.setItem('husky-weekly-tasks', JSON.stringify(updatedTasksByWeek));
  };

  const handleAddFoodEntry = async (entry: FoodEntry) => {
    const updatedEntries = [...foodEntries, entry];
    setFoodEntries(updatedEntries);
    
    // Save to both server and localStorage
    try {
      await api.addFoodEntry(entry);
    } catch (error) {
      console.error('Error saving to server:', error);
    }
    localStorage.setItem('husky-food-entries', JSON.stringify(updatedEntries));
  };

  const handleUpdateFeedingTime = async (entryId: string, timeIndex: number, completed: boolean) => {
    const updatedEntries = foodEntries.map(entry => {
      if (entry.id === entryId) {
        const updatedFeedingTimes = [...entry.feedingTimes];
        updatedFeedingTimes[timeIndex] = { ...updatedFeedingTimes[timeIndex], completed };
        return { ...entry, feedingTimes: updatedFeedingTimes };
      }
      return entry;
    });
    setFoodEntries(updatedEntries);
    
    // Save to both server and localStorage
    const updatedEntry = updatedEntries.find(e => e.id === entryId);
    if (updatedEntry) {
      try {
        await api.updateFoodEntry(updatedEntry);
      } catch (error) {
        console.error('Error saving to server:', error);
      }
    }
    localStorage.setItem('husky-food-entries', JSON.stringify(updatedEntries));
  };

  const handleAddPottyEntry = async (entry: Omit<PottyEntry, 'id'>) => {
    const newEntry: PottyEntry = {
      ...entry,
      id: Date.now().toString()
    };
    const updatedEntries = [...pottyEntries, newEntry];
    setPottyEntries(updatedEntries);
    
    // Save to both server and localStorage
    try {
      await api.addPottyEntry(newEntry);
    } catch (error) {
      console.error('Error saving to server:', error);
    }
    localStorage.setItem('husky-potty-entries', JSON.stringify(updatedEntries));
  };

  const handleUpdateTodo = async (entry: DailyTodoEntry) => {
    setIsSavingTodo(true);
    
    // Save to server FIRST to avoid race condition with sync
    if (isOnline) {
      try {
        await api.saveTodoEntry(entry);
      } catch (error) {
        console.error('Error saving todo to server:', error);
      }
    }
    
    // Then update local state and localStorage
    const updatedEntries = todoEntries.filter(e => e.id !== entry.id);
    updatedEntries.push(entry);
    setTodoEntries(updatedEntries);
    localStorage.setItem('husky-todo-entries', JSON.stringify(updatedEntries));
    
    setIsSavingTodo(false);
  };

  const markTodosCompleted = (category: 'Feeding' | 'Potty') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find today's todo entry
    const todayEntry = todoEntries.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
    
    if (!todayEntry) {
      console.log('No todo entry found for today');
      return;
    }
    
    // Find all schedule items matching the category
    const categoryScheduleIds = puppyDailySchedule
      .filter(item => item.category === category)
      .map(item => item.id);
    
    // Mark all matching items as completed
    const updatedItems = todayEntry.items.map(item => {
      if (categoryScheduleIds.includes(item.scheduleItemId) && !item.completed) {
        return {
          ...item,
          completed: true,
          completedAt: new Date()
        };
      }
      return item;
    });
    
    // Update the todo entry
    const updatedEntry: DailyTodoEntry = {
      ...todayEntry,
      items: updatedItems
    };
    
    handleUpdateTodo(updatedEntry);
  };

  const handleQuickLogFood = () => {
    console.log('Quick log food clicked');
    // Create a food entry for current time
    const now = new Date();
    const currentAge = Math.floor((now.getTime() - new Date('2025-09-13').getTime()) / (1000 * 60 * 60 * 24 * 7));
    
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      date: now,
      puppyAgeWeeks: currentAge,
      feedingTimes: [{
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        amount: 0.5 // Default amount, user can edit
      }],
      notes: 'Logged from daily schedule'
    };
    
    console.log('Creating food entry:', newEntry);
    // Use the existing handler which already does optimistic update
    handleAddFoodEntry(newEntry);
    
    // Mark feeding todos as completed
    markTodosCompleted('Feeding');
    
    // Show feedback
    alert('Feed logged! ✓\nSwitch to Food tab to see details.');
  };

  const handleQuickLogPotty = (type: 'pee' | 'poop' | 'both', location: 'outside' | 'inside') => {
    // Create a potty entry for current time
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
    
    const entryWithoutId = {
      date: now,
      time: timeString,
      type: type,
      location: location,
      notes: 'Logged from daily schedule'
    };
    
    // Use the existing handler which already does optimistic update
    handleAddPottyEntry(entryWithoutId);
    
    // Mark potty todos as completed
    markTodosCompleted('Potty');
  };

  if (isLoading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading puppy data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>Husky Puppy Trainer</h1>
        {!isOnline && (
          <div className="offline-banner">
            ⚠️ Offline Mode - Changes will sync when reconnected
          </div>
        )}
        {isOnline && (
          <div className="sync-status">
            <button 
              onClick={() => loadAllData()} 
              className="sync-button"
              disabled={isSyncing}
              title="Sync now"
            >
              {isSyncing ? '🔄' : '↻'} {isSyncing ? 'Syncing...' : 'Sync'}
            </button>
            {lastSyncTime && !isSyncing && (
              <span className="last-sync">
                Last sync: {lastSyncTime.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}
        <nav>
          <button onClick={() => setActiveTab('daily')} className={activeTab === 'daily' ? 'active' : ''}>
            ✅ Daily
          </button>
          <button onClick={() => setActiveTab('food')} className={activeTab === 'food' ? 'active' : ''}>
            🍖 Food
          </button>
          <button onClick={() => setActiveTab('potty')} className={activeTab === 'potty' ? 'active' : ''}>
            🚽 Potty
          </button>
          <button onClick={() => setActiveTab('schedule')} className={activeTab === 'schedule' ? 'active' : ''}>
            📋 Training
          </button>
        </nav>
      </header>
      <main>
        {activeTab === 'daily' && (
          <DailyTodoList
            todoEntries={todoEntries}
            onUpdateTodo={handleUpdateTodo}
            onQuickLogFood={handleQuickLogFood}
            onQuickLogPotty={handleQuickLogPotty}
          />
        )}
        {activeTab === 'schedule' && (
          <WeeklySchedule
            tasksByWeek={tasksByWeek}
            onTasksUpdate={handleTasksUpdate}
          />
        )}
        {activeTab === 'food' && (
          <FoodTracker
            foodEntries={foodEntries}
            onAddFoodEntry={handleAddFoodEntry}
            onUpdateFeedingTime={handleUpdateFeedingTime}
          />
        )}
        {activeTab === 'potty' && (
          <PottyTracker
            pottyEntries={pottyEntries}
            onAddPottyEntry={handleAddPottyEntry}
          />
        )}
      </main>
    </div>
  );
}

export default App;
