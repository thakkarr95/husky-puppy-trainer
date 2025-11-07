import { useState } from 'react';
import type { FoodEntry } from '../types';

interface FoodTrackerProps {
  foodEntries: FoodEntry[];
  onAddFoodEntry: (entry: FoodEntry) => void;
  onUpdateFeedingTime: (entryId: string, timeIndex: number, completed: boolean) => void;
}

const FoodTracker = ({ foodEntries, onAddFoodEntry, onUpdateFeedingTime }: FoodTrackerProps) => {
  const [newEntryDate, setNewEntryDate] = useState(new Date());

  const handleAddEntry = () => {
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      date: newEntryDate,
      feedingTimes: [
        { time: 'Morning', completed: false },
        { time: 'Afternoon', completed: false },
        { time: 'Evening', completed: false },
      ],
    };
    onAddFoodEntry(newEntry);
  };

  return (
    <div>
      <h2>Food Tracker</h2>
      <input
        type="date"
        value={newEntryDate.toISOString().split('T')[0]}
        onChange={(e) => setNewEntryDate(new Date(e.target.value))}
      />
      <button onClick={handleAddEntry}>Add Daily Food Entry</button>
      <div>
        {foodEntries.map(entry => (
          <div key={entry.id}>
            <h3>{entry.date.toDateString()}</h3>
            <ul>
              {entry.feedingTimes.map((ft: { time: string; completed: boolean }, index: number) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      checked={ft.completed}
                      onChange={(e) => onUpdateFeedingTime(entry.id, index, e.target.checked)}
                    />
                    {ft.time}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodTracker;
