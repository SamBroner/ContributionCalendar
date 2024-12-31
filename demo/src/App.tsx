import React, { useState } from 'react';
import { HabitCalendar, HabitToggles, DateRangeType } from 'habit-contribution-calendar';
import { habits } from './demoData';

const App: React.FC = () => {
  const [size, setSize] = useState(10);
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>('calendar-year');
  const [year, setYear] = useState(new Date().getFullYear());
  const [activeHabits, setActiveHabits] = useState<string[]>(habits.map(h => h.name));

  const buttonStyle = {
    padding: '5px 12px',
    fontSize: '12px',
    lineHeight: '20px',
    color: '#24292f',
    backgroundColor: '#f6f8fa',
    border: '1px solid rgba(27, 31, 35, 0.15)',
    borderRadius: '6px',
    cursor: 'pointer'
  };

  const selectStyle = {
    ...buttonStyle,
    marginLeft: '8px'
  };

  const toggleHabit = (habitName: string) => {
    setActiveHabits(prev => 
      prev.includes(habitName)
        ? prev.filter(name => name !== habitName)
        : [...prev, habitName]
    );
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px',
      padding: '24px',
      width: '95%',
      maxWidth: '1200px',
      margin: '0 auto',
      color: '#24292f',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        padding: '24px',
        backgroundColor: '#ffffff',
        border: '1px solid #d0d7de',
        borderRadius: '6px',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'auto'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          padding: '0 0 16px',
          borderBottom: '1px solid #d0d7de',
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: '100%'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
              View Type:
              <select 
                value={dateRangeType} 
                onChange={(e) => setDateRangeType(e.target.value as DateRangeType)}
                style={selectStyle}
              >
                <option value="calendar-year">Calendar Year</option>
                <option value="trailing-12-months">Trailing 12 Months</option>
              </select>
            </label>

            {dateRangeType === 'calendar-year' && (
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                Year:
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  style={selectStyle}
                >
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
              </label>
            )}

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              Size:
              <input
                type="range"
                min="8"
                max="16"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                style={{ verticalAlign: 'middle' }}
              />
              {size}px
            </label>
          </div>
        </div>

        <div style={{ 
          width: '100%',
          overflowX: 'auto',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <HabitCalendar
            habits={habits}
            activeHabits={activeHabits}
            dateRangeType={dateRangeType}
            year={year}
            size={size}
          />
        </div>

        <HabitToggles
          habits={habits}
          activeHabits={activeHabits}
          onToggle={toggleHabit}
          style={{
            padding: '16px 0 0',
            borderTop: '1px solid #d0d7de',
            justifyContent: 'center'
          }}
        />
      </div>
    </div>
  );
};

export default App; 