import React from 'react';
import { Habit, ColorScale, defaultColorScales, HabitToggleProps } from '../types';

/**
 * Gets a ColorScale object from either a predefined color name or a custom ColorScale object.
 * If a string is provided and it matches a predefined scale, that scale is used.
 * Otherwise, creates a single-color scale using the provided color.
 */
const getColorScale = (color: string | ColorScale): ColorScale => {
  if (typeof color === 'string') {
    return color in defaultColorScales ? defaultColorScales[color] : {
      empty: '#ebedf0',
      l1: color,
      l2: color,
      l3: color,
      l4: color
    };
  }
  return color;
};

/**
 * HabitToggle is a single toggle button for a habit.
 * Shows the habit's name and a preview of its color scale.
 * When clicked, toggles the habit's visibility in the calendar.
 * 
 * @example
 * ```tsx
 * <HabitToggle
 *   habit={{
 *     name: 'Running',
 *     color: 'red',
 *     dataSource: new CSVAdapter(...)
 *   }}
 *   isActive={true}
 *   onToggle={(name) => console.log(`Toggle ${name}`)}
 * />
 * ```
 */
export const HabitToggle: React.FC<HabitToggleProps> = ({
  habit,
  isActive,
  onToggle
}) => {
  const colorScale = getColorScale(habit.color);
  const levels = [colorScale.empty, colorScale.l1, colorScale.l2, colorScale.l3, colorScale.l4];

  return (
    <div 
      onClick={() => onToggle(habit.name)}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        cursor: 'pointer',
        opacity: isActive ? 1 : 0.5,
        padding: '4px 8px',
        borderRadius: '4px',
        backgroundColor: isActive ? 'rgba(27, 31, 35, 0.05)' : 'transparent',
        fontSize: '12px'
      }}
    >
      <div style={{ 
        display: 'flex',
        gap: '2px'
      }}>
        {levels.map((color, index) => (
          <div
            key={index}
            style={{ 
              width: '10px', 
              height: '10px', 
              backgroundColor: color,
              border: '1px solid rgba(27, 31, 35, 0.06)',
              borderRadius: '2px'
            }}
          />
        ))}
      </div>
      <span>{habit.name}</span>
    </div>
  );
}; 