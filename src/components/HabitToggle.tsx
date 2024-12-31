import React from 'react';
import { Habit, ColorScale, defaultColorScales } from '../types';

interface HabitToggleProps {
  habit: Habit;
  isActive: boolean;
  onToggle: (habitName: string) => void;
}

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