import { useState } from 'react';
import type { PottyEntry } from '../types';

interface PottyTrackerProps {
  pottyEntries: PottyEntry[];
  onAddPottyEntry: (entry: Omit<PottyEntry, 'id'>) => void;
  onUpdatePottyEntry: (entry: PottyEntry) => void;
  onDeletePottyEntry: (id: string) => void;
}

function PottyTracker({ pottyEntries, onAddPottyEntry, onUpdatePottyEntry, onDeletePottyEntry }: PottyTrackerProps) {
  const [selectedType, setSelectedType] = useState<'pee' | 'poop' | 'both'>('pee');
  const [selectedLocation, setSelectedLocation] = useState<'outside' | 'inside'>('outside');
  const [notes, setNotes] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [context, setContext] = useState('');
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Get today's entries
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEntries = pottyEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    const matches = entryDate.getTime() === today.getTime();
    if (!matches) {
      console.log('Entry date mismatch:', { 
        entryDate: entryDate.toString(), 
        today: today.toString(), 
        entryTime: entryDate.getTime(), 
        todayTime: today.getTime(),
        rawDate: entry.date
      });
    }
    return matches;
  });
  
  console.log('Today\'s potty entries:', todayEntries.length, 'Total entries:', pottyEntries.length);

  // Get this week's stats
  const getWeekStart = () => {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day;
    const weekStart = new Date(date.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  };

  const weekStart = getWeekStart();
  const weekEntries = pottyEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart;
  });

  const weekStats = {
    outside: weekEntries.filter(e => e.location === 'outside').length,
    accidents: weekEntries.filter(e => e.location === 'inside').length,
    successRate: weekEntries.length > 0 
      ? Math.round((weekEntries.filter(e => e.location === 'outside').length / weekEntries.length) * 100)
      : 0
  };

  const handleQuickLog = () => {
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

    if (editingId) {
      // Update existing entry
      const existingEntry = pottyEntries.find(e => e.id === editingId);
      if (existingEntry) {
        onUpdatePottyEntry({
          ...existingEntry,
          time: timeString,
          type: selectedType,
          location: selectedLocation,
          context: context.trim() || undefined,
          notes: notes.trim() || undefined
        });
      }
      setEditingId(null);
    } else {
      // Add new entry
      onAddPottyEntry({
        date: now,
        time: timeString,
        type: selectedType,
        location: selectedLocation,
        context: context.trim() || undefined,
        notes: notes.trim() || undefined
      });
    }

    // Reset form after logging
    setNotes('');
    setContext('');
    setCustomTime('');
    setUseCustomTime(false);
  };

  const handleEdit = (entry: PottyEntry) => {
    // Convert 12-hour format back to 24-hour for the input
    const convert12to24 = (time12: string) => {
      const [time, period] = time12.split(' ');
      let [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      
      if (period === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) {
        hour = 0;
      }
      
      return `${String(hour).padStart(2, '0')}:${minutes}`;
    };

    setEditingId(entry.id);
    setSelectedType(entry.type);
    setSelectedLocation(entry.location);
    setContext(entry.context || '');
    setNotes(entry.notes || '');
    setCustomTime(convert12to24(entry.time));
    setUseCustomTime(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNotes('');
    setContext('');
    setCustomTime('');
    setUseCustomTime(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this potty entry?')) {
      onDeletePottyEntry(id);
      if (editingId === id) {
        handleCancelEdit();
      }
    }
  };

  const getTypeEmoji = (type: 'pee' | 'poop' | 'both') => {
    switch (type) {
      case 'pee': return '💧';
      case 'poop': return '💩';
      case 'both': return '💧💩';
    }
  };

  const getLocationColor = (location: string) => {
    switch (location) {
      case 'outside': return '#10b981';
      case 'inside': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLocationLabel = (location: string) => {
    switch (location) {
      case 'outside': return '✓ Outside';
      case 'inside': return '✗ Accident';
      default: return location;
    }
  };

  return (
    <div className="potty-tracker-container">
      <div className="tracker-content">
        
        {/* Weekly Progress Card */}
        <div className="weekly-progress-card">
          <h3>📈 This Week's Progress</h3>
          <div className="progress-bar-container">
            <div className="progress-bar-large">
              <div 
                className="progress-fill-large success"
                style={{ width: `${weekStats.successRate}%` }}
              />
            </div>
            <span className="progress-label">
              {weekStats.outside} outside, {weekStats.accidents} accidents ({weekStats.successRate}% success)
            </span>
          </div>
          {weekStats.successRate >= 80 && (
            <div className="success-message">
              ✅ Excellent! Your pup is doing great with potty training!
            </div>
          )}
          {weekStats.successRate < 60 && weekEntries.length > 5 && (
            <div className="warning-message">
              💪 Keep working on it! Consistency is key for potty training.
            </div>
          )}
          <div className="weekly-stats-grid">
            <div className="stat-card">
              <div className="stat-value-large">{weekEntries.length}</div>
              <div className="stat-label-small">Total Breaks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value-large">{weekStats.outside}</div>
              <div className="stat-label-small">Outside</div>
            </div>
            <div className="stat-card">
              <div className="stat-value-large">{weekStats.accidents}</div>
              <div className="stat-label-small">Accidents</div>
            </div>
          </div>
        </div>
        
        {/* Weekly Stats - Compact */}
        <div className="potty-stats-compact">
          <div className="stat-item success">
            <div className="stat-value">{weekStats.successRate}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{weekStats.outside}</div>
            <div className="stat-label">Outside</div>
          </div>
          <div className="stat-item accidents">
            <div className="stat-value">{weekStats.accidents}</div>
            <div className="stat-label">Accidents</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{todayEntries.length}</div>
            <div className="stat-label">Today</div>
          </div>
        </div>

        {/* Quick Log - Mobile Optimized */}
        <div className="quick-log-section">
          <h3>{editingId ? '✏️ Edit Potty Entry' : '🚽 Quick Log'}</h3>
          
          {editingId && (
            <div className="edit-mode-banner">
              <span>Editing potty entry</span>
              <button onClick={handleCancelEdit} className="cancel-edit-btn">
                Cancel
              </button>
            </div>
          )}
          
          <div className="quick-log-form">
            {/* Type Selection - Large Touch Targets */}
            <div className="form-group">
              <label>Type</label>
              <div className="button-group-large">
                <button
                  className={`type-btn ${selectedType === 'pee' ? 'active' : ''}`}
                  onClick={() => setSelectedType('pee')}
                >
                  <span className="btn-emoji">💧</span>
                  <span>Pee</span>
                </button>
                <button
                  className={`type-btn ${selectedType === 'poop' ? 'active' : ''}`}
                  onClick={() => setSelectedType('poop')}
                >
                  <span className="btn-emoji">💩</span>
                  <span>Poop</span>
                </button>
                <button
                  className={`type-btn ${selectedType === 'both' ? 'active' : ''}`}
                  onClick={() => setSelectedType('both')}
                >
                  <span className="btn-emoji">💧💩</span>
                  <span>Both</span>
                </button>
              </div>
            </div>

            {/* Location Selection - Large Touch Targets */}
            <div className="form-group">
              <label>Location</label>
              <div className="button-group-large location-group">
                <button
                  className={`location-btn location-outside ${selectedLocation === 'outside' ? 'active' : ''}`}
                  onClick={() => setSelectedLocation('outside')}
                >
                  <span className="btn-emoji">✓</span>
                  <span>Outside</span>
                </button>
                <button
                  className={`location-btn location-inside ${selectedLocation === 'inside' ? 'active' : ''}`}
                  onClick={() => setSelectedLocation('inside')}
                >
                  <span className="btn-emoji">✗</span>
                  <span>Accident</span>
                </button>
              </div>
            </div>

            {/* Context Input */}
            <div className="form-group">
              <label>Context (Optional)</label>
              <input
                type="text"
                className="notes-input-mobile"
                placeholder="e.g., After breakfast, After play..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            {/* Optional Notes */}
            <div className="form-group">
              <label>Notes (Optional)</label>
              <input
                type="text"
                className="notes-input-mobile"
                placeholder="Additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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

            {/* Large Submit Button */}
            <button 
              className="log-button-large" 
              onClick={handleQuickLog}
              disabled={useCustomTime && !customTime}
            >
              <span className="log-icon">📝</span>
              <span>{editingId ? 'Update Potty Entry' : 'Log Potty Break'}</span>
            </button>
          </div>
        </div>

        {/* Today's Entries */}
        <div className="today-entries-section">
          <h3>📅 Today's Log ({todayEntries.length})</h3>
          {todayEntries.length === 0 ? (
            <div className="no-entries">
              <p>No potty breaks logged yet today</p>
            </div>
          ) : (
            <div className="entries-list-mobile">
              {todayEntries.map(entry => (
                <div key={entry.id} className="entry-card-mobile">
                  <div className="entry-header">
                    <span className="entry-type">{getTypeEmoji(entry.type)}</span>
                    <span className="entry-time">{entry.time}</span>
                    <span 
                      className="entry-location"
                      style={{ backgroundColor: getLocationColor(entry.location) }}
                    >
                      {getLocationLabel(entry.location)}
                    </span>
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
                  {entry.context && (
                    <div className="entry-context">📍 {entry.context}</div>
                  )}
                  {entry.notes && (
                    <div className="entry-notes">{entry.notes}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent History - Collapsible */}
        <details className="recent-history-section">
          <summary>📊 This Week's History ({weekEntries.length} total)</summary>
          <div className="history-by-day">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - i);
              date.setHours(0, 0, 0, 0);
              
              const dayEntries = pottyEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                entryDate.setHours(0, 0, 0, 0);
                return entryDate.getTime() === date.getTime();
              });

              const dayName = i === 0 ? 'Today' : i === 1 ? 'Yesterday' : date.toLocaleDateString('en-US', { weekday: 'short' });
              const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <div key={i} className="day-summary">
                  <div className="day-header">
                    <span className="day-name">{dayName}</span>
                    <span className="day-date">{dateStr}</span>
                    <span className="day-count">{dayEntries.length} breaks</span>
                  </div>
                  {dayEntries.length > 0 && (
                    <div className="day-entries">
                      {dayEntries.map(entry => (
                        <span key={entry.id} className="mini-entry" style={{ borderColor: getLocationColor(entry.location) }}>
                          {getTypeEmoji(entry.type)} {entry.time}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </details>

      </div>
    </div>
  );
}

export default PottyTracker;
