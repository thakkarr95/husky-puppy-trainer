import { useState } from 'react';
import type { PottyEntry } from '../types';

interface PottyTrackerProps {
  pottyEntries: PottyEntry[];
  onAddPottyEntry: (entry: Omit<PottyEntry, 'id'>) => void;
}

function PottyTracker({ pottyEntries, onAddPottyEntry }: PottyTrackerProps) {
  const [selectedType, setSelectedType] = useState<'pee' | 'poop' | 'both'>('pee');
  const [selectedLocation, setSelectedLocation] = useState<'outside' | 'inside'>('outside');
  const [notes, setNotes] = useState('');

  // Get today's entries
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEntries = pottyEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });

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
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    onAddPottyEntry({
      date: now,
      time: timeString,
      type: selectedType,
      location: selectedLocation,
      notes: notes.trim() || undefined
    });

    // Reset notes after logging
    setNotes('');
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
          <h3>🚽 Quick Log</h3>
          
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

            {/* Optional Notes */}
            <div className="form-group">
              <label>Notes (Optional)</label>
              <input
                type="text"
                className="notes-input-mobile"
                placeholder="e.g., After meal, Before walk..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Large Submit Button */}
            <button className="log-button-large" onClick={handleQuickLog}>
              <span className="log-icon">📝</span>
              <span>Log Potty Break</span>
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
              {todayEntries.slice().reverse().map(entry => (
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
                  </div>
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
