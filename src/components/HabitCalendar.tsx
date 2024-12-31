import React, { useEffect, useState } from 'react';
import { startOfYear, endOfToday, eachDayOfInterval, format } from 'date-fns';
import { HabitCalendarProps, DayData, defaultTheme } from '../types';
import { DayCell } from './DayCell';

export const HabitCalendar: React.FC<HabitCalendarProps> = ({
  habits,
  startDate = format(startOfYear(new Date()), 'yyyy-MM-dd'),
  endDate = format(endOfToday(), 'yyyy-MM-dd'),
  shape,
  size = 16,
  gap = 2,
  theme = defaultTheme
}) => {
  const [habitData, setHabitData] = useState<Map<string, Map<string, DayData>>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const start = new Date(startDate);
      const end = new Date(endDate);

      const newHabitData = new Map();
      
      for (const habit of habits) {
        await habit.dataSource.initialize();
        const data = await habit.dataSource.getData(start, end);
        const habitMap = new Map();
        data.forEach(day => {
          habitMap.set(day.date, day);
        });
        newHabitData.set(habit.name, habitMap);
      }

      setHabitData(newHabitData);
      setLoading(false);
    };

    fetchData();
  }, [habits, startDate, endDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const days = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate)
  });

  const determinedShape = shape || (habits.length <= 2 ? 'square' : 
    habits.length === 3 ? 'triangle' :
    habits.length === 6 ? 'hexagon' : 'octagon');

  return (
    <div
      style={{
        background: theme.background,
        padding: gap,
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, ${size}px)`,
        gap: `${gap}px`,
        width: 'fit-content'
      }}
    >
      {days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const segments = habits.map(habit => ({
          habit,
          value: habitData.get(habit.name)?.get(dateStr)?.value || 0
        }));

        return (
          <DayCell
            key={dateStr}
            date={dateStr}
            size={size}
            shape={determinedShape}
            segments={segments}
            theme={theme}
          />
        );
      })}
    </div>
  );
}; 