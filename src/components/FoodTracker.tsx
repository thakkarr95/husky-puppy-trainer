import { useState, useEffect } from 'react';
import type { FoodEntry } from '../types';
import { feedingGuidelines, getGuidelineForAge, calculatePuppyAge } from '../feedingData';

interface FoodTrackerProps {
  foodEntries: FoodEntry[];
  onAddFoodEntry: (entry: FoodEntry) => void;
  onUpdateFoodEntry: (entry: FoodEntry) => void;
  onDeleteFoodEntry: (id: string) => void;
}

const FoodTracker = ({ foodEntries, onAddFoodEntry, onUpdateFoodEntry, onDeleteFoodEntry }: FoodTrackerProps) => {
  // Fixed puppy birth date - 09/13/2025 (pickup date is 11/8/2025 at 8 weeks old)
  const PUPPY_BIRTH_DATE = new Date('2025-09-13T00:00:00');
  const PUPPY_PICKUP_DATE = new Date('2025-11-08T00:00:00');
  const [puppyBirthDate] = useState<Date>(PUPPY_BIRTH_DATE);
  const [currentPuppyAge, setCurrentPuppyAge] = useState(8);
  const [showAllGuidelines, setShowAllGuidelines] = useState(false);
  const [customTime, setCustomTime] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [feedAmount, setFeedAmount] = useState(0.25);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Get today's entries
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEntries = foodEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });

  useEffect(() => {
    const age = calculatePuppyAge(puppyBirthDate);
    setCurrentPuppyAge(age);
  }, [puppyBirthDate, foodEntries]);

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

  // Calculate kibble transition amounts
  const getTransitionDay = () => {
    const pickupDate = new Date(PUPPY_PICKUP_DATE);
    const today = new Date();
    const diffTime = today.getTime() - pickupDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Day 1 is pickup day
  };

  const getKibbleAmounts = () => {
    const transitionDay = getTransitionDay();
    const totalPerMeal = currentGuideline.cupsPerMeal;
    
    if (transitionDay <= 2) {
      // Days 1-2: 90% old, 10% new (Gentle start)
      return {
        oldKibble: (totalPerMeal * 0.90).toFixed(2),
        newKibble: (totalPerMeal * 0.10).toFixed(2),
        phase: 'Days 1-2'
      };
    } else if (transitionDay <= 4) {
      // Days 3-4: 75% old, 25% new
      return {
        oldKibble: (totalPerMeal * 0.75).toFixed(2),
        newKibble: (totalPerMeal * 0.25).toFixed(2),
        phase: 'Days 3-4'
      };
    } else if (transitionDay <= 6) {
      // Days 5-6: 50% old, 50% new
      return {
        oldKibble: (totalPerMeal * 0.50).toFixed(2),
        newKibble: (totalPerMeal * 0.50).toFixed(2),
        phase: 'Days 5-6'
      };
    } else if (transitionDay <= 8) {
      // Days 7-8: 25% old, 75% new
      return {
        oldKibble: (totalPerMeal * 0.25).toFixed(2),
        newKibble: (totalPerMeal * 0.75).toFixed(2),
        phase: 'Days 7-8'
      };
    } else if (transitionDay <= 10) {
      // Days 9-10: 10% old, 90% new (Final adjustment)
      return {
        oldKibble: (totalPerMeal * 0.10).toFixed(2),
        newKibble: (totalPerMeal * 0.90).toFixed(2),
        phase: 'Days 9-10'
      };
    } else {
      // Day 11+: 100% new
      return {
        oldKibble: '0.00',
        newKibble: totalPerMeal.toFixed(2),
        phase: 'Day 11+ (Complete)'
      };
    }
  };

  const kibbleAmounts = getKibbleAmounts();
  const transitionDay = getTransitionDay();

  const handleQuickLogFood = () => {
    const now = new Date();
    let timeString: string;

    if (useCustomTime && customTime) {
      // Convert custom time to 12-hour format
      const [hours, minutes] = customTime.split(':');
      const hour12 = parseInt(hours) % 12 || 12;
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
      timeString = `${String(hour12).padStart(2, '0')}:${minutes} ${ampm}`;
    } else {
      timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }

    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      date: now,
      puppyAgeWeeks: currentPuppyAge,
      feedingTimes: [{
        time: timeString,
        completed: true,
        amount: feedAmount
      }],
      notes: useCustomTime ? 'Logged at specific time' : 'Quick logged'
    };

    if (editingId) {
      // Update existing entry
      const existingEntry = foodEntries.find(e => e.id === editingId);
      if (existingEntry) {
        onUpdateFoodEntry({
          ...newEntry,
          id: editingId,
          date: existingEntry.date
        });
      }
    } else {
      // Add new entry
      onAddFoodEntry(newEntry);
    }
    
    // Reset form
    setCustomTime('');
    setUseCustomTime(false);
    setFeedAmount(0.25);
    setEditingId(null);
  };

  const handleEdit = (entry: FoodEntry) => {
    // Convert 12-hour time to 24-hour format for input
    const feedingTime = entry.feedingTimes[0];
    if (feedingTime) {
      const [time, period] = feedingTime.time.split(' ');
      const [hours, minutes] = time.split(':');
      let hour24 = parseInt(hours);
      if (period === 'PM' && hour24 !== 12) hour24 += 12;
      if (period === 'AM' && hour24 === 12) hour24 = 0;
      const time24 = `${hour24.toString().padStart(2, '0')}:${minutes}`;
      
      setCustomTime(time24);
      setUseCustomTime(true);
      setFeedAmount(feedingTime.amount || 0.25);
      setEditingId(entry.id);
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setCustomTime('');
    setUseCustomTime(false);
    setFeedAmount(0.25);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this food entry?')) {
      onDeleteFoodEntry(id);
      if (editingId === id) {
        handleCancelEdit();
      }
    }
  };

  return (
    <div className="food-tracker-container">
      <div className="tracker-content">
        {editingId && (
          <div className="edit-mode-banner">
            <span>✏️ Editing food entry</span>
            <button className="cancel-edit-btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        )}
        <div className="puppy-info-card">
          <h3>🐺 Puppy Information</h3>
          <div className="info-row">
            <label>Birth Date:</label>
            <input
              type="date"
              value={puppyBirthDate.toISOString().split('T')[0]}
              readOnly
              disabled
              className="date-input"
              title="Puppy birth date: September 13, 2025"
            />
          </div>
          <div className="info-row">
            <label>Pickup Date:</label>
            <input
              type="date"
              value={PUPPY_PICKUP_DATE.toISOString().split('T')[0]}
              readOnly
              disabled
              className="date-input"
              title="Puppy pickup date: November 8, 2025 (8 weeks old)"
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

        {/* Kibble Transition Guide */}
        <div className="kibble-transition-card">
          <h3>🔄 Kibble Transition Plan</h3>
          <p className="transition-intro">
            Transitioning to <strong>Kirkland Signature Nature's Domain Puppy Formula (Chicken & Pea)</strong>
          </p>
          <p className="transition-warning">⚠️ Gradual transition over 7-10 days prevents digestive upset</p>
          
          <div className="transition-schedule">
            <div className="transition-day">
              <div className="day-label">Days 1-2</div>
              <div className="ratio-info">
                <div className="ratio-bar">
                  <div className="old-food" style={{width: '75%'}}>75% Old</div>
                  <div className="new-food" style={{width: '25%'}}>25% New</div>
                </div>
              </div>
            </div>
            
            <div className="transition-day">
              <div className="day-label">Days 3-4</div>
              <div className="ratio-info">
                <div className="ratio-bar">
                  <div className="old-food" style={{width: '50%'}}>50% Old</div>
                  <div className="new-food" style={{width: '50%'}}>50% New</div>
                </div>
              </div>
            </div>
            
            <div className="transition-day">
              <div className="day-label">Days 5-7</div>
              <div className="ratio-info">
                <div className="ratio-bar">
                  <div className="old-food" style={{width: '25%'}}>25% Old</div>
                  <div className="new-food" style={{width: '75%'}}>75% New</div>
                </div>
              </div>
            </div>
            
            <div className="transition-day">
              <div className="day-label">Day 8+</div>
              <div className="ratio-info">
                <div className="ratio-bar">
                  <div className="new-food" style={{width: '100%'}}>100% New Food</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="transition-tips">
            <h4>💡 Transition Tips:</h4>
            <ul>
              <li>Mix foods thoroughly at each meal</li>
              <li>Monitor for signs of digestive upset (loose stools, vomiting)</li>
              <li>If issues occur, slow down the transition process</li>
              <li>Keep fresh water available at all times</li>
              <li>Maintain same feeding times and locations</li>
            </ul>
          </div>
        </div>

        <div className="current-guidelines-summary">
          <h3>📌 Current Feeding Plan ({currentGuideline.ageRange})</h3>
          <div className="guideline-quick-view">
            <p><strong>Meals:</strong> {currentGuideline.mealsPerDay} times per day</p>
            <p><strong>Total Per Meal:</strong> {currentGuideline.cupsPerMeal.toFixed(2)} cups</p>
            {transitionDay <= 7 && (
              <div className="kibble-breakdown">
                <p className="transition-phase-label">🔄 Transition Phase: <strong>{kibbleAmounts.phase}</strong> (Day {transitionDay})</p>
                <div className="kibble-amounts">
                  <div className="kibble-amount old">
                    <span className="kibble-label">Old Kibble:</span>
                    <span className="kibble-value">{kibbleAmounts.oldKibble} cups</span>
                  </div>
                  <div className="kibble-amount new">
                    <span className="kibble-label">Kirkland Nature's Domain:</span>
                    <span className="kibble-value">{kibbleAmounts.newKibble} cups</span>
                  </div>
                </div>
              </div>
            )}
            {transitionDay > 7 && (
              <div className="kibble-breakdown">
                <p className="transition-complete">✅ <strong>Transition Complete!</strong> Using 100% Kirkland Nature's Domain</p>
                <div className="kibble-amounts">
                  <div className="kibble-amount new">
                    <span className="kibble-label">Kirkland Nature's Domain:</span>
                    <span className="kibble-value">{kibbleAmounts.newKibble} cups per meal</span>
                  </div>
                </div>
              </div>
            )}
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

          {/* Quick Log Section */}
          <div className="quick-log-section">
            <h3>🍖 Quick Log Feeding</h3>
            
            <div className="quick-log-form">
              {/* Amount Input */}
              <div className="form-group">
                <label>Amount (cups)</label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="5"
                  value={feedAmount}
                  onChange={(e) => setFeedAmount(parseFloat(e.target.value) || 0.25)}
                  className="amount-input-large"
                />
              </div>

              {/* Custom Time Toggle */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={useCustomTime}
                    onChange={(e) => setUseCustomTime(e.target.checked)}
                  />
                  <span>Log at specific time</span>
                </label>
              </div>

              {/* Custom Time Input */}
              {useCustomTime && (
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    className="time-input-mobile"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                  />
                </div>
              )}

              {/* Submit Button */}
              <button 
                className="log-button-large" 
                onClick={handleQuickLogFood}
                disabled={useCustomTime && !customTime}
              >
                <span className="log-icon">📝</span>
                <span>{editingId ? 'Update' : 'Log'} Feeding</span>
              </button>
            </div>
          </div>

          <div className="today-entries-section">
            <h3>📅 Today's Log ({todayEntries.reduce((count, entry) => count + entry.feedingTimes.length, 0)})</h3>
            {todayEntries.length === 0 ? (
              <div className="no-entries">
                <p>No feedings logged yet today</p>
              </div>
            ) : (
              <div className="entries-list-mobile">
                {todayEntries.map(entry => 
                  entry.feedingTimes.map((feeding, index) => (
                    <div key={`${entry.id}-${index}`} className="entry-card-mobile">
                      <div className="entry-header">
                        <span className="entry-type">🍖</span>
                        <span className="entry-time">{feeding.time}</span>
                        <span className="entry-amount">{feeding.amount?.toFixed(2)} cups</span>
                        <div className="entry-actions">
                          <button 
                            className="edit-entry-btn" 
                            onClick={() => handleEdit(entry)}
                            title="Edit entry"
                          >
                            ✏️
                          </button>
                          <button 
                            className="delete-entry-btn" 
                            onClick={() => handleDelete(entry.id)}
                            title="Delete entry"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      {entry.notes && (
                        <div className="entry-notes">📝 {entry.notes}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="recent-entries">
            <h3>📅 Recent Entries</h3>
            {foodEntries.length === 0 ? (
              <p className="no-data">No entries yet. Start tracking above!</p>
            ) : (
              <div className="entries-list">
                {foodEntries.slice(0, 7).map(entry => {
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
