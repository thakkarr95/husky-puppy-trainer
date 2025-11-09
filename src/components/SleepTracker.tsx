import { useState, useEffect } from 'react';
import type { SleepEntry } from '../types';
import { 
  sleepGuidelines, 
  getGuidelineForAge, 
  calculatePuppyAge,
  evaluateDailySleep,
  formatDuration
} from '../sleepData';

interface SleepTrackerProps {
  sleepEntries: SleepEntry[];
  onAddSleepEntry: (entry: SleepEntry) => void;
  onDeleteSleepEntry: (id: string) => void;
}

const SleepTracker = ({ sleepEntries, onAddSleepEntry, onDeleteSleepEntry }: SleepTrackerProps) => {
  // Fixed puppy birth date - 09/13/2025 (pickup date is 11/8/2025 at 8 weeks old)
  const PUPPY_BIRTH_DATE = new Date('2025-09-13T00:00:00');
  const PUPPY_PICKUP_DATE = new Date('2025-11-08T00:00:00');
  const [puppyBirthDate] = useState<Date>(PUPPY_BIRTH_DATE);
  const [currentPuppyAge, setCurrentPuppyAge] = useState(8);
  const [showAllGuidelines, setShowAllGuidelines] = useState(false);
  
  // Form state
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [quality, setQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  const [location, setLocation] = useState<'crate' | 'bed' | 'couch' | 'other'>('crate');
  const [notes, setNotes] = useState('');

  // Get today's entries
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEntries = sleepEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });

  // Calculate total sleep for today
  const totalSleepToday = todayEntries.reduce((total, entry) => total + entry.duration, 0);
  const sleepEvaluation = evaluateDailySleep(totalSleepToday, currentPuppyAge);

  useEffect(() => {
    const age = calculatePuppyAge(puppyBirthDate);
    setCurrentPuppyAge(age);
  }, [puppyBirthDate, sleepEntries]);

  const currentGuideline = getGuidelineForAge(currentPuppyAge);

  // Calculate duration in minutes
  const calculateDuration = (start: string, end: string): number => {
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    
    let startTotalMinutes = startHours * 60 + startMinutes;
    let endTotalMinutes = endHours * 60 + endMinutes;
    
    // If end time is earlier than start time, assume it's the next day
    if (endTotalMinutes < startTotalMinutes) {
      endTotalMinutes += 24 * 60;
    }
    
    return endTotalMinutes - startTotalMinutes;
  };

  const handleQuickLogSleep = () => {
    if (!startTime || !endTime) {
      alert('Please enter both start and end times');
      return;
    }

    const duration = calculateDuration(startTime, endTime);
    
    if (duration <= 0) {
      alert('End time must be after start time');
      return;
    }

    // Convert to 12-hour format
    const format12Hour = (time24: string) => {
      const [hours, minutes] = time24.split(':');
      const hour12 = parseInt(hours) % 12 || 12;
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
      return `${String(hour12).padStart(2, '0')}:${minutes} ${ampm}`;
    };

    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      date: new Date(),
      startTime: format12Hour(startTime),
      endTime: format12Hour(endTime),
      duration,
      quality,
      location,
      puppyAgeWeeks: currentPuppyAge,
      notes: notes || undefined
    };

    onAddSleepEntry(newEntry);
    
    // Reset form
    setStartTime('');
    setEndTime('');
    setQuality('good');
    setLocation('crate');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sleep entry?')) {
      onDeleteSleepEntry(id);
    }
  };

  const getQualityEmoji = (quality?: string) => {
    switch (quality) {
      case 'excellent': return '😴';
      case 'good': return '😊';
      case 'fair': return '😐';
      case 'poor': return '😰';
      default: return '💤';
    }
  };

  const getLocationEmoji = (location?: string) => {
    switch (location) {
      case 'crate': return '🏠';
      case 'bed': return '🛏️';
      case 'couch': return '🛋️';
      case 'other': return '📍';
      default: return '📍';
    }
  };

  return (
    <div className="sleep-tracker-container">
      <div className="tracker-content">
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
          <div className="info-row">
            <label>Current Age:</label>
            <span className="age-display">{currentPuppyAge} weeks old</span>
          </div>
        </div>

        <div className="current-guideline-card">
          <h3>💤 Current Sleep Requirements</h3>
          <div className="guideline-header">
            <div className="guideline-age">{currentGuideline.ageRange}</div>
            <div className="guideline-target">
              <strong>{currentGuideline.hoursPerDay} hours/day</strong>
              <span className="range-text">({currentGuideline.minHours}-{currentGuideline.maxHours}h)</span>
            </div>
          </div>
          <div className="guideline-detail">
            <strong>Nap Frequency:</strong> {currentGuideline.napFrequency}
          </div>
          <div className="guideline-notes">
            {currentGuideline.notes.slice(0, showAllGuidelines ? undefined : 3).map((note, index) => (
              <div key={index} className="guideline-note">• {note}</div>
            ))}
          </div>
          <button 
            className="toggle-guidelines-btn"
            onClick={() => setShowAllGuidelines(!showAllGuidelines)}
          >
            {showAllGuidelines ? 'Show Less' : 'Show More'}
          </button>
        </div>

        <div className="daily-progress-card">
          <h3>📊 Today's Sleep</h3>
          <div className="progress-header">
            <span className="progress-label">Total: {formatDuration(totalSleepToday)}</span>
            <span className={`progress-status status-${sleepEvaluation.status}`}>
              {sleepEvaluation.message}
            </span>
          </div>
          <div className="progress-bar-container">
            <div 
              className={`progress-bar-fill status-${sleepEvaluation.status}`}
              style={{ 
                width: `${Math.min(100, (totalSleepToday / 60 / currentGuideline.hoursPerDay) * 100)}%` 
              }}
            />
          </div>
          <div className="progress-stats">
            <div className="stat-item">
              <span className="stat-label">Target</span>
              <span className="stat-value">{currentGuideline.hoursPerDay}h</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Logged</span>
              <span className="stat-value">{(totalSleepToday / 60).toFixed(1)}h</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Sessions</span>
              <span className="stat-value">{todayEntries.length}</span>
            </div>
          </div>
        </div>

        <div className="quick-log-section">
          <h3>⚡ Quick Log Sleep</h3>
          
          <div className="time-inputs-row">
            <div className="time-input-group">
              <label>Start Time:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="time-input-mobile"
              />
            </div>
            <div className="time-input-group">
              <label>End Time:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="time-input-mobile"
              />
            </div>
          </div>

          {startTime && endTime && (
            <div className="duration-preview">
              Duration: {formatDuration(calculateDuration(startTime, endTime))}
            </div>
          )}

          <div className="quality-selector">
            <label>Sleep Quality:</label>
            <div className="quality-buttons">
              {(['excellent', 'good', 'fair', 'poor'] as const).map((q) => (
                <button
                  key={q}
                  className={`quality-btn ${quality === q ? 'selected' : ''}`}
                  onClick={() => setQuality(q)}
                >
                  {getQualityEmoji(q)} {q.charAt(0).toUpperCase() + q.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="location-selector">
            <label>Location:</label>
            <div className="location-buttons">
              {(['crate', 'bed', 'couch', 'other'] as const).map((loc) => (
                <button
                  key={loc}
                  className={`location-btn ${location === loc ? 'selected' : ''}`}
                  onClick={() => setLocation(loc)}
                >
                  {getLocationEmoji(loc)} {loc.charAt(0).toUpperCase() + loc.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="notes-input-container">
            <label>Notes (optional):</label>
            <textarea
              className="notes-input-mobile"
              placeholder="Any observations about this sleep session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <button 
            className="log-button-large"
            onClick={handleQuickLogSleep}
            disabled={!startTime || !endTime}
          >
            Log Sleep Session
          </button>
        </div>

        <div className="today-entries-section">
          <h3>📅 Today's Sleep Log ({todayEntries.length} sessions)</h3>
          {todayEntries.length === 0 ? (
            <div className="no-entries">
              <p>No sleep sessions logged yet today</p>
            </div>
          ) : (
            <div className="entries-list-mobile">
              {todayEntries.slice().reverse().map(entry => (
                <div key={entry.id} className="entry-card-mobile sleep-entry-card">
                  <div className="entry-header">
                    <span className="entry-type">{getQualityEmoji(entry.quality)}</span>
                    <span className="entry-time">{entry.startTime} - {entry.endTime}</span>
                    <span className="entry-duration">{formatDuration(entry.duration)}</span>
                    <button
                      className="delete-entry-btn"
                      onClick={() => handleDelete(entry.id)}
                      title="Delete entry"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="entry-details">
                    <span className="entry-location">
                      {getLocationEmoji(entry.location)} {entry.location}
                    </span>
                    {entry.quality && (
                      <span className="entry-quality">
                        Quality: {entry.quality}
                      </span>
                    )}
                  </div>
                  {entry.notes && (
                    <div className="entry-notes">📝 {entry.notes}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="all-guidelines-section">
          <h3>📚 Sleep Guidelines by Age</h3>
          <div className="guidelines-grid">
            {sleepGuidelines.map((guideline) => (
              <div 
                key={guideline.ageWeeks} 
                className={`guideline-card ${guideline.ageWeeks === currentGuideline.ageWeeks ? 'current' : ''}`}
              >
                <div className="guideline-card-header">
                  <h4>{guideline.ageRange}</h4>
                  {guideline.ageWeeks === currentGuideline.ageWeeks && (
                    <span className="current-badge">Current</span>
                  )}
                </div>
                <div className="guideline-card-body">
                  <div className="guideline-main-stat">
                    {guideline.hoursPerDay} hours/day
                  </div>
                  <div className="guideline-range">
                    Range: {guideline.minHours}-{guideline.maxHours} hours
                  </div>
                  <div className="guideline-naps">
                    🔄 {guideline.napFrequency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepTracker;
