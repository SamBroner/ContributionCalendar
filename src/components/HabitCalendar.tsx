import React, { useEffect, useState } from 'react';
import { 
  startOfYear,
  endOfYear,
  subMonths,
  startOfDay,
  endOfDay,
  format,
  isWithinInterval,
  getMonth,
  startOfWeek,
  isSameMonth
} from 'date-fns';
import { HabitCalendarProps, DayData, defaultTheme } from '../types';
import { DayCell } from './DayCell';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * HabitCalendar displays a GitHub-style contribution calendar for multiple habits.
 * Each day is represented by a shape divided into segments, one for each habit.
 * The intensity of each segment's color represents the value for that habit on that day.
 * 
 * The calendar automatically adjusts its shape based on the number of active habits:
 * - 1 habit: Square
 * - 2 habits: Diagonal split square
 * - 3 habits: Hexagon with three segments
 * - 4 habits: Square split into four
 * - 5+ habits: Radial segments
 * 
 * @example
 * ```tsx
 * <HabitCalendar
 *   habits={[
 *     {
 *       name: 'Running',
 *       dataSource: new CSVAdapter(...),
 *       color: 'red'
 *     },
 *     {
 *       name: 'Writing',
 *       dataSource: new CSVAdapter(...),
 *       color: 'blue'
 *     }
 *   ]}
 *   activeHabits={['Running', 'Writing']}
 *   dateRangeType="calendar-year"
 *   year={2024}
 *   size={12}
 *   gap={2}
 * />
 * ```
 */
export const HabitCalendar: React.FC<HabitCalendarProps> = ({
  habits: allHabits,
  activeHabits,
  dateRangeType = 'calendar-year',
  year = new Date().getFullYear(),
  size = 10,
  gap = 2,
  theme = defaultTheme
}) => {
  const [habitData, setHabitData] = useState<Map<string, Map<string, DayData>>>(new Map());
  const [loading, setLoading] = useState(true);

  const habits = allHabits.filter(habit => activeHabits.includes(habit.name));

  // Calculate date range based on type
  const getDateRange = () => {
    if (dateRangeType === 'calendar-year') {
      return {
        start: startOfYear(new Date(year, 0, 1)),
        end: endOfYear(new Date(year, 0, 1))
      };
    } else {
      const now = new Date();
      const start = startOfDay(subMonths(now, 12));
      return {
        start,
        end: endOfDay(now)
      };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { start, end } = getDateRange();

      const newHabitData = new Map();
      
      for (const habit of allHabits) {
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
  }, [allHabits, dateRangeType, year]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const { start, end } = getDateRange();
  
  // Calculate weeks starting from the first Monday
  const firstDay = startOfWeek(start, { weekStartsOn: 1 });
  const weeks: Date[][] = [];
  let currentDate = firstDay;

  while (currentDate <= end) {
    const week = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(currentDate);
      day.setDate(day.getDate() + i);
      return day;
    });
    weeks.push(week);
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: '16px',
      color: theme.text
    }}>
      <div style={{ 
        display: 'inline-block',
        paddingLeft: 32,
        fontSize: '9px'
      }}>
        {/* Month labels */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${weeks.length}, ${size}px)`,
          columnGap: `${gap}px`,
          marginBottom: 4,
          marginLeft: 24
        }}>
          {weeks.map((week, i) => {
            const firstDayOfWeek = week[0];
            const shouldShowLabel = i === 0 || !isSameMonth(firstDayOfWeek, weeks[i - 1][0]);
            return (
              <div key={i} style={{ 
                gridColumn: i + 1,
                textAlign: 'left',
                height: 15
              }}>
                {shouldShowLabel && MONTH_LABELS[getMonth(firstDayOfWeek)]}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex' }}>
          {/* Day labels */}
          <div style={{ 
            display: 'grid',
            gridTemplateRows: `repeat(7, ${size}px)`,
            rowGap: `${gap}px`,
            marginRight: 8,
            textAlign: 'right',
            position: 'relative',
            top: -2
          }}>
            {DAY_LABELS.map((day, i) => (
              <div key={i} style={{ lineHeight: `${size}px` }}>
                {i % 2 === 0 ? day : ''}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${weeks.length}, ${size}px)`,
            gridTemplateRows: `repeat(7, ${size}px)`,
            gap: `${gap}px`
          }}>
            {weeks.map((week, weekIndex) => 
              week.map((day, dayIndex) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isInRange = isWithinInterval(day, { start, end });
                
                if (!isInRange) {
                  return <div key={`${weekIndex}-${dayIndex}`} style={{ gridColumn: weekIndex + 1, gridRow: dayIndex + 1 }} />;
                }

                const segments = habits.map(habit => ({
                  habit,
                  value: habitData.get(habit.name)?.get(dateStr)?.value || 0
                }));

                return (
                  <div key={dateStr} style={{ gridColumn: weekIndex + 1, gridRow: dayIndex + 1 }}>
                    <DayCell
                      date={dateStr}
                      size={size}
                      segments={segments}
                      theme={theme}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 