import { useState, useEffect } from 'react';
import WeeklySchedule from './components/WeeklySchedule';
import FoodTracker from './components/FoodTracker';
import type { TrainingTask, FoodEntry } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { weeklyTraining } from './trainingData';
import './App.css';

type TabType = 'schedule' | 'food';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [tasksByWeek, setTasksByWeek] = useLocalStorage('husky-weekly-tasks', weeklyTraining);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);

  // Load food entries from localStorage
  useEffect(() => {
    try {
      const savedFoodEntries = localStorage.getItem('husky-food-entries');
      if (savedFoodEntries) {
        const parsed = JSON.parse(savedFoodEntries);
        const entriesWithDates = parsed.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        setFoodEntries(entriesWithDates);
      }
    } catch (error) {
      console.error('Error loading food entries:', error);
    }
  }, []);

  const handleTasksUpdate = (updatedTasks: TrainingTask[]) => {
    const updatedTasksByWeek = {
      ...tasksByWeek,
      [currentWeek]: updatedTasks,
    };
    setTasksByWeek(updatedTasksByWeek);
  };

  const handleAddFoodEntry = (entry: FoodEntry) => {
    const updatedEntries = [...foodEntries, entry];
    setFoodEntries(updatedEntries);
    localStorage.setItem('husky-food-entries', JSON.stringify(updatedEntries));
  };

  const handleUpdateFeedingTime = (entryId: string, timeIndex: number, completed: boolean) => {
    const updatedEntries = foodEntries.map(entry => {
      if (entry.id === entryId) {
        const updatedFeedingTimes = [...entry.feedingTimes];
        updatedFeedingTimes[timeIndex] = { ...updatedFeedingTimes[timeIndex], completed };
        return { ...entry, feedingTimes: updatedFeedingTimes };
      }
      return entry;
    });
    setFoodEntries(updatedEntries);
    localStorage.setItem('husky-food-entries', JSON.stringify(updatedEntries));
  };

  const tasksForCurrentWeek = tasksByWeek[currentWeek] || [];

  return (
    <div className="App">
      <header>
        <h1>Husky Puppy Trainer</h1>
        <nav>
          <button onClick={() => setActiveTab('schedule')} className={activeTab === 'schedule' ? 'active' : ''}>
            Training Schedule
          </button>
          <button onClick={() => setActiveTab('food')} className={activeTab === 'food' ? 'active' : ''}>
            Food Tracker
          </button>
        </nav>
      </header>
      <main>
        {activeTab === 'schedule' && (
          <>
            <div className="week-selector">
              <h2>Select Week:</h2>
              {Object.keys(weeklyTraining).map(week => (
                <button
                  key={week}
                  onClick={() => setCurrentWeek(Number(week))}
                  className={currentWeek === Number(week) ? 'active' : ''}
                >
                  Week {week}
                </button>
              ))}
            </div>
            <WeeklySchedule
              tasks={tasksForCurrentWeek}
              onTasksUpdate={handleTasksUpdate}
            />
          </>
        )}
        {activeTab === 'food' && (
          <FoodTracker
            foodEntries={foodEntries}
            onAddFoodEntry={handleAddFoodEntry}
            onUpdateFeedingTime={handleUpdateFeedingTime}
          />
        )}
      </main>
    </div>
  );
}

export default App;
