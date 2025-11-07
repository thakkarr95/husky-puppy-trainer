import { useState, useEffect } from 'react';
import type { FoodEntry } from '../types';
import { feedingGuidelines, getGuidelineForAge, calculatePuppyAge } from '../feedingData';

interface FoodTrackerProps {
  foodEntries: FoodEntry[];
  onAddFoodEntry: (entry: FoodEntry) => void;
  onUpdateFeedingTime: (entryId: string, timeIndex: number, completed: boolean) => void;
}

const FoodTracker = ({ foodEntries, onAddFoodEntry, onUpdateFeedingTime }: FoodTrackerProps) => {
  const [puppyBirthDate, setPuppyBirthDate] = useState<Date>(() => {
    const saved = localStorage.getItem('husky-puppy-birthdate');
    return saved ? new Date(saved) : new Date();
  });
  const [currentPuppyAge, setCurrentPuppyAge] = useState(8);
  const [todayEntry, setTodayEntry] = useState<FoodEntry | null>(null);
  const [showAllGuidelines, setShowAllGuidelines] = useState(false);

  useEffect(() => {
    const age = calculatePuppyAge(puppyBirthDate);
    setCurrentPuppyAge(age);
    
    // Find or create today's entry
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existing = foodEntries.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
    
    setTodayEntry(existing || null);
  }, [puppyBirthDate, foodEntries]);

  const handleBirthDateChange = (date: Date) => {
    setPuppyBirthDate(date);
    localStorage.setItem('husky-puppy-birthdate', date.toISOString());
  };

  const createTodayEntry = () => {
    const guideline = getGuidelineForAge(currentPuppyAge);
    const mealTimes = ['Morning', 'Midday', 'Afternoon', 'Evening'].slice(0, guideline.mealsPerDay);
    
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      date: new Date(),
      puppyAgeWeeks: currentPuppyAge,
      feedingTimes: mealTimes.map(time => ({
        time,
        completed: false,
        amount: guideline.cupsPerMeal
      })),
      notes: ''
    };
    
    onAddFoodEntry(newEntry);
  };

  const currentGuideline = getGuidelineForAge(currentPuppyAge);
  
  // Calculate weekly stats
  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekEntries = foodEntries.filter(entry => new Date(entry.date) >= weekAgo);
    const totalMeals = weekEntries.reduce((sum, entry) => 
      sum + entry.feedingTimes.filter(ft => ft.completed).length, 0
    );
    const expectedMeals = 7 * currentGuideline.mealsPerDay;
    const completionRate = expectedMeals > 0 ? Math.round((totalMeals / expectedMeals) * 100) : 0;
    
    return { totalMeals, expectedMeals, completionRate };
  };

  const weeklyStats = getWeeklyStats();

  return (
    <div className="food-tracker-container">
      <div className="tracker-content">
        <div className="puppy-info-card">
          <h3>🐺 Puppy Information</h3>
          <div className="info-row">
            <label>Birth Date (or 8-week pickup date):</label>
            <input
              type="date"
              value={puppyBirthDate.toISOString().split('T')[0]}
              onChange={(e) => handleBirthDateChange(new Date(e.target.value))}
              className="date-input"
            />
          </div>
          <div className="info-stats">
            <div className="stat-box">
              <span className="stat-label">Current Age</span>
              <span className="stat-value">{currentPuppyAge} weeks</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Meals Per Day</span>
              <span className="stat-value">{currentGuideline.mealsPerDay}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">Daily Amount</span>
              <span className="stat-value">{currentGuideline.cupsPerDay} cups</span>
            </div>
          </div>
        </div>

        <div className="current-guidelines-summary">
          <h3>📌 Current Feeding Plan ({currentGuideline.ageRange})</h3>
          <div className="guideline-quick-view">
            <p><strong>Meals:</strong> {currentGuideline.mealsPerDay} times per day</p>
            <p><strong>Per Meal:</strong> {currentGuideline.cupsPerMeal.toFixed(2)} cups</p>
            <p><strong>Expected Weight:</strong> {currentGuideline.weightRange}</p>
          </div>
        </div>

          <div className="weekly-progress-card">
            <h3>📈 This Week's Progress</h3>
            <div className="progress-bar-container">
              <div className="progress-bar-large">
                <div 
                  className="progress-fill-large"
                  style={{ width: `${weeklyStats.completionRate}%` }}
                />
              </div>
              <span className="progress-label">
                {weeklyStats.totalMeals} of {weeklyStats.expectedMeals} meals completed ({weeklyStats.completionRate}%)
              </span>
            </div>
            {weeklyStats.completionRate >= 90 && (
              <div className="success-message">
                ✅ Great job! You're on track with feeding schedule!
              </div>
            )}
            {weeklyStats.completionRate < 70 && weeklyStats.totalMeals > 0 && (
              <div className="warning-message">
                ⚠️ Try to maintain a consistent feeding schedule for best results
              </div>
            )}
          </div>

          <div className="today-tracker">
            <h3>🍽️ Today's Feeding</h3>
            {!todayEntry ? (
              <div className="no-entry">
                <p>No entry for today yet.</p>
                <button className="create-entry-btn" onClick={createTodayEntry}>
                  Create Today's Entry
                </button>
              </div>
            ) : (
              <div className="feeding-checklist-mobile">
                {todayEntry.feedingTimes.map((ft, index) => (
                  <div key={index} className={`meal-item-mobile ${ft.completed ? 'meal-completed' : ''}`}>
                    <input
                      type="checkbox"
                      className="meal-checkbox-large"
                      checked={ft.completed}
                      onChange={(e) => onUpdateFeedingTime(todayEntry.id, index, e.target.checked)}
                    />
                    <div className="meal-info">
                      <div className="meal-time">{ft.time}</div>
                      <div className="meal-amount">{ft.amount?.toFixed(2)} cups</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="recent-entries">
            <h3>📅 Recent Entries</h3>
            {foodEntries.length === 0 ? (
              <p className="no-data">No entries yet. Start tracking above!</p>
            ) : (
              <div className="entries-list">
                {foodEntries.slice().reverse().slice(0, 7).map(entry => {
                  const completedMeals = entry.feedingTimes.filter(ft => ft.completed).length;
                  const totalMeals = entry.feedingTimes.length;
                  const percentage = Math.round((completedMeals / totalMeals) * 100);
                  
                  return (
                    <div key={entry.id} className="entry-card">
                      <div className="entry-header">
                        <span className="entry-date">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="entry-age">{entry.puppyAgeWeeks} weeks old</span>
                      </div>
                      <div className="entry-progress">
                        <div className="mini-progress-bar">
                          <div 
                            className="mini-progress-fill"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="entry-stats">
                          {completedMeals}/{totalMeals} meals
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        {/* Feeding Guidelines Section */}
        <div className="guidelines-section">
          <div className="section-header-collapsible" onClick={() => setShowAllGuidelines(!showAllGuidelines)}>
            <h2>🥘 Complete Feeding Guidelines (All Ages)</h2>
            <span className="toggle-icon">{showAllGuidelines ? '▼' : '▶'}</span>
          </div>
          
          {showAllGuidelines && (
            <>
              <div className="guidelines-intro">
                <p>These guidelines are based on veterinary recommendations for Siberian Husky puppies. 
                Actual amounts may vary based on activity level, metabolism, and specific food brand. 
                Always consult with your veterinarian.</p>
              </div>
              
              <div className="guidelines-grid">
                {feedingGuidelines.map((guideline, index) => (
                  <div 
                    key={index} 
                    className={`guideline-card ${currentPuppyAge >= guideline.ageWeeks && 
                      (index === feedingGuidelines.length - 1 || currentPuppyAge < feedingGuidelines[index + 1]?.ageWeeks) 
                      ? 'current-guideline' : ''}`}
                  >
                    <div className="guideline-header">
                      <h3>{guideline.ageRange}</h3>
                      {currentPuppyAge >= guideline.ageWeeks && 
                       (index === feedingGuidelines.length - 1 || currentPuppyAge < feedingGuidelines[index + 1]?.ageWeeks) && (
                        <span className="current-badge">Current</span>
                      )}
                    </div>
                    
                    <div className="guideline-stats">
                      <div className="stat-item">
                        <span className="stat-icon">🍽️</span>
                        <div className="stat-details">
                          <div className="stat-number">{guideline.mealsPerDay}</div>
                          <div className="stat-text">meals/day</div>
                        </div>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">📏</span>
                        <div className="stat-details">
                          <div className="stat-number">{guideline.cupsPerMeal.toFixed(2)}</div>
                          <div className="stat-text">cups/meal</div>
                        </div>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">⚖️</span>
                        <div className="stat-details">
                          <div className="stat-number">{guideline.cupsPerDay}</div>
                          <div className="stat-text">cups/day</div>
                        </div>
                      </div>
                    </div>

                    <div className="weight-range">
                      <strong>Expected Weight:</strong> {guideline.weightRange}
                    </div>

                    <div className="guideline-notes">
                      <h4>Important Notes:</h4>
                      <ul>
                        {guideline.notes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodTracker;
