import { useState, useEffect } from 'react'
import WeeklySchedule from './components/WeeklySchedule'
import FoodTracker from './components/FoodTracker'
import type { TrainingTask, FoodEntry } from './types'
import { useLocalStorage, mergeWithDefaults } from './hooks/useLocalStorage'
import { trainingTasks } from './data'
import './App.css'

type TabType = 'schedule' | 'food';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [savedTasks, saveTasks] = useLocalStorage();
  const [tasks, setTasks] = useState<TrainingTask[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);

  // Initialize tasks on component mount
  useEffect(() => {
    const initialTasks = mergeWithDefaults(savedTasks, trainingTasks);
    setTasks(initialTasks);
  }, [savedTasks]);

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
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
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

  const handleExport = () => {
    const dataToExport = {
      tasks,
      foodEntries,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "puppy-progress.json";
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') return;
        const importedData = JSON.parse(text);

        if (importedData.tasks) {
          const importedTasks = mergeWithDefaults(importedData.tasks, trainingTasks);
          setTasks(importedTasks);
          saveTasks(importedTasks);
        }

        if (importedData.foodEntries) {
          const entriesWithDates = importedData.foodEntries.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date)
          }));
          setFoodEntries(entriesWithDates);
          localStorage.setItem('husky-food-entries', JSON.stringify(entriesWithDates));
        }
        alert('Progress imported successfully!');
      } catch (error) {
        console.error("Error importing data:", error);
        alert('Failed to import progress. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="nav-header">
          <h1>🐕 Husky Puppy Trainer</h1>
          <p>Complete training solution for your husky puppy</p>
          <div className="io-buttons">
            <button onClick={handleExport} className="io-button">Export Progress</button>
            <input 
              type="file" 
              id="import-file" 
              onChange={handleImport} 
              style={{ display: 'none' }} 
              accept=".json"
            />
            <label htmlFor="import-file" className="io-button">
              Import Progress
            </label>
          </div>
        </div>
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
             Training Program
          </button>
          <button 
            className={`nav-tab ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            🍽️ Food Tracker
          </button>
        </div>
      </nav>

      <main className="app-main">
        {activeTab === 'schedule' && (
          <WeeklySchedule 
            tasks={tasks}
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
      </main>
    </div>
  )
}

export default App
      tasks,
      foodEntries,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "puppy-progress.json";
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') return;
        const importedData = JSON.parse(text);

        if (importedData.tasks) {
          const importedTasks = mergeWithDefaults(importedData.tasks, trainingTasks);
          setTasks(importedTasks);
          saveTasks(importedTasks);
        }

        if (importedData.foodEntries) {
          const entriesWithDates = importedData.foodEntries.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date)
          }));
          setFoodEntries(entriesWithDates);
          localStorage.setItem('husky-food-entries', JSON.stringify(entriesWithDates));
        }
        alert('Progress imported successfully!');
      } catch (error) {
        console.error("Error importing data:", error);
        alert('Failed to import progress. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="nav-header">
          <h1>🐕 Husky Puppy Trainer</h1>
          <p>Complete training solution for your husky puppy</p>
          <div className="io-buttons">
            <button onClick={handleExport} className="io-button">Export Progress</button>
            <input 
              type="file" 
              id="import-file" 
              onChange={handleImport} 
              style={{ display: 'none' }} 
              accept=".json"
            />
            <label htmlFor="import-file" className="io-button">
              Import Progress
            </label>
          </div>
        </div>
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
             Training Program
          </button>
          <button 
            className={`nav-tab ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            🍽️ Food Tracker
          </button>
        </div>
      </nav>

      <main className="app-main">
        {activeTab === 'schedule' && (
          <WeeklySchedule 
            tasks={tasks}
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
      </main>
    </div>
  )
}

export default App

  const handleExport = () => {
    const dataToExport = {
      tasks,
      foodEntries,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "puppy-progress.json";
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') return;
        const importedData = JSON.parse(text);

        if (importedData.tasks) {
          const importedTasks = mergeWithDefaults(importedData.tasks, trainingTasks);
          setTasks(importedTasks);
          saveTasks(importedTasks);
        }

        if (importedData.foodEntries) {
          const entriesWithDates = importedData.foodEntries.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date)
          }));
          setFoodEntries(entriesWithDates);
          localStorage.setItem('husky-food-entries', JSON.stringify(entriesWithDates));
        }
        alert('Progress imported successfully!');
      } catch (error) {
        console.error("Error importing data:", error);
        alert('Failed to import progress. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="nav-header">
          <h1>🐕 Husky Puppy Trainer</h1>
          <p>Complete training solution for your husky puppy</p>
          <div className="io-buttons">
            <button onClick={handleExport} className="io-button">Export Progress</button>
            <input 
              type="file" 
              id="import-file" 
              onChange={handleImport} 
              style={{ display: 'none' }} 
              accept=".json"
            />
            <label htmlFor="import-file" className="io-button">
              Import Progress
            </label>
          </div>
        </div>
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}

  const handleExport = () => {
    const dataToExport = {
      tasks,
      foodEntries,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "puppy-progress.json";
    link.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') return;
        const importedData = JSON.parse(text);

        if (importedData.tasks) {
          const importedTasks = mergeWithDefaults(importedData.tasks, trainingTasks);
          setTasks(importedTasks);
          saveTasks(importedTasks);
        }

        if (importedData.foodEntries) {
          const entriesWithDates = importedData.foodEntries.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date)
          }));
          setFoodEntries(entriesWithDates);
          localStorage.setItem('husky-food-entries', JSON.stringify(entriesWithDates));
        }
        alert('Progress imported successfully!');
      } catch (error) {
        console.error("Error importing data:", error);
        alert('Failed to import progress. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="nav-header">
          <h1>🐕 Husky Puppy Trainer</h1>
          <p>Complete training solution for your husky puppy</p>
          <div className="io-buttons">
            <button onClick={handleExport} className="io-button">Export Progress</button>
            <input 
              type="file" 
              id="import-file" 
              onChange={handleImport} 
              style={{ display: 'none' }} 
              accept=".json"
            />
            <label htmlFor="import-file" className="io-button">
              Import Progress
            </label>
          </div>
        </div>
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            � Training Program
          </button>
          <button 
            className={`nav-tab ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            🍽️ Food Tracker
          </button>
        </div>
      </nav>

      <main className="app-main">
        {activeTab === 'schedule' && (
          <WeeklySchedule 
            tasks={tasks}
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
      </main>
    </div>
  )
}

export default App
