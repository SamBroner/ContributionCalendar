import React from 'react';
import { HabitTogglesProps } from '../types';
import { HabitToggle } from './HabitToggle';

/**
 * HabitToggles provides a row of toggles for showing/hiding habits in the calendar.
 * Each toggle shows the habit's name and a color scale preview.
 * 
 * @example
 * ```tsx
 * const [activeHabits, setActiveHabits] = useState(['Running', 'Writing']);
 * 
 * const toggleHabit = (habitName: string) => {
 *   setActiveHabits(prev => 
 *     prev.includes(habitName)
 *       ? prev.filter(name => name !== habitName)
 *       : [...prev, habitName]
 *   );
 * };
 * 
 * <HabitToggles
 *   habits={habits}
 *   activeHabits={activeHabits}
 *   onToggle={toggleHabit}
 *   style={{ justifyContent: 'center' }}
 * />
 * ```
 */
export const HabitToggles: React.FC<HabitTogglesProps> = ({
  habits,
  activeHabits,
  onToggle,
  style
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '24px', 
      justifyContent: 'flex-start',
      flexWrap: 'wrap',
      ...style
    }}>
      {habits.map(habit => (
        <HabitToggle
          key={habit.name}
          habit={habit}
          isActive={activeHabits.includes(habit.name)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}; 