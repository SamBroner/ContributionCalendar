import React, { useState } from 'react';
import { HabitCalendar, CSVAdapter, DateRangeType } from 'habit-contribution-calendar';

// Example CSV data
const runningData = `date,distance
2023-01-01,5.2
2023-01-02,3.1
2023-02-15,4.5
2023-03-20,6.2
2023-04-10,3.8
2023-05-05,5.0
2023-06-15,4.2
2023-07-20,6.5
2023-08-10,3.9
2023-09-05,5.3
2023-10-15,4.7
2023-11-20,6.1
2023-12-10,3.5
2024-01-01,5.2
2024-01-02,3.1
2024-01-03,0
2024-01-04,6.5
2024-01-05,4.2`;

const writingData = `date,words
2023-01-01,1200
2023-02-01,800
2023-03-15,1500
2023-04-01,900
2023-05-10,2000
2023-06-01,1100
2023-07-15,1800
2023-08-01,950
2023-09-10,2200
2023-10-01,1300
2023-11-15,1600
2023-12-01,1000
2024-01-01,1200
2024-01-02,800
2024-01-03,1500
2024-01-04,0
2024-01-05,2000`;

const meditationData = `date,minutes
2023-01-01,20
2023-02-01,15
2023-03-15,25
2023-04-01,30
2023-05-10,20
2023-06-01,15
2023-07-15,25
2023-08-01,30
2023-09-10,20
2023-10-01,15
2023-11-15,25
2023-12-01,30
2024-01-01,20
2024-01-02,15
2024-01-03,25
2024-01-04,30
2024-01-05,20`;

const readingData = `date,pages
2023-01-01,45
2023-02-01,30
2023-03-15,60
2023-04-01,25
2023-05-10,50
2023-06-01,35
2023-07-15,55
2023-08-01,40
2023-09-10,45
2023-10-01,30
2023-11-15,65
2023-12-01,35
2024-01-01,45
2024-01-02,30
2024-01-03,60
2024-01-04,25
2024-01-05,50`;

const codingData = `date,commits
2023-01-01,8
2023-02-01,5
2023-03-15,12
2023-04-01,6
2023-05-10,9
2023-06-01,7
2023-07-15,10
2023-08-01,4
2023-09-10,8
2023-10-01,6
2023-11-15,11
2023-12-01,5
2024-01-01,8
2024-01-02,5
2024-01-03,12
2024-01-04,6
2024-01-05,9`;

const createBlobUrl = (content: string) => {
  const blob = new Blob([content], { type: 'text/csv' });
  return URL.createObjectURL(blob);
};

const App: React.FC = () => {
  const [shape, setShape] = useState<'triangle' | 'square' | 'hexagon' | 'octagon'>('hexagon');
  const [size, setSize] = useState(10);
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>('calendar-year');
  const [year, setYear] = useState(new Date().getFullYear());
  const [activeHabits, setActiveHabits] = useState<string[]>(['Running', 'Writing', 'Meditation', 'Reading', 'Coding']);

  const allHabits = [
    {
      name: 'Running',
      dataSource: new CSVAdapter({
        file: createBlobUrl(runningData),
        dateColumn: 'date',
        valueColumn: 'distance'
      }),
      color: '#39d353'
    },
    {
      name: 'Writing',
      dataSource: new CSVAdapter({
        file: createBlobUrl(writingData),
        dateColumn: 'date',
        valueColumn: 'words'
      }),
      color: '#0969da'
    },
    {
      name: 'Meditation',
      dataSource: new CSVAdapter({
        file: createBlobUrl(meditationData),
        dateColumn: 'date',
        valueColumn: 'minutes'
      }),
      color: '#8957e5'
    },
    {
      name: 'Reading',
      dataSource: new CSVAdapter({
        file: createBlobUrl(readingData),
        dateColumn: 'date',
        valueColumn: 'pages'
      }),
      color: '#e34c26'
    },
    {
      name: 'Coding',
      dataSource: new CSVAdapter({
        file: createBlobUrl(codingData),
        dateColumn: 'date',
        valueColumn: 'commits'
      }),
      color: '#f1e05a'
    }
  ];

  const habits = allHabits.filter(habit => activeHabits.includes(habit.name));

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
      maxWidth: '1012px',
      margin: '0 auto',
      color: '#24292f',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        padding: '16px',
        backgroundColor: '#ffffff',
        border: '1px solid #d0d7de',
        borderRadius: '6px'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          padding: '0 0 16px',
          borderBottom: '1px solid #d0d7de'
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

          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            Shape:
            <select 
              value={shape} 
              onChange={(e) => setShape(e.target.value as typeof shape)}
              style={selectStyle}
            >
              <option value="triangle">Triangle</option>
              <option value="square">Square</option>
              <option value="hexagon">Hexagon</option>
              <option value="octagon">Octagon</option>
            </select>
          </label>

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

        <div style={{ overflowX: 'auto' }}>
          <HabitCalendar
            habits={habits}
            dateRangeType={dateRangeType}
            year={year}
            shape={shape}
            size={size}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '24px', 
          justifyContent: 'flex-start',
          fontSize: '12px',
          flexWrap: 'wrap'
        }}>
          {allHabits.map(habit => (
            <div 
              key={habit.name} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                cursor: 'pointer',
                opacity: activeHabits.includes(habit.name) ? 1 : 0.5,
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: activeHabits.includes(habit.name) ? 'rgba(27, 31, 35, 0.05)' : 'transparent'
              }}
              onClick={() => toggleHabit(habit.name)}
            >
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: habit.color,
                border: '1px solid rgba(27, 31, 35, 0.06)',
                borderRadius: '2px'
              }} />
              <span>{habit.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App; 