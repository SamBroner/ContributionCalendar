import React from 'react';
import { Theme } from '../types';

interface TooltipProps {
  date: string;
  content: string;
  theme: Theme;
}

export const Tooltip: React.FC<TooltipProps> = ({
  date,
  content,
  theme
}) => {
  return (
    <div
      style={{
        position: 'fixed', // Changed to fixed for global positioning
        transform: 'translate(-50%, -100%)',
        marginBottom: '10px',
        backgroundColor: theme.tooltip.background,
        border: `1px solid ${theme.tooltip.border}`,
        borderRadius: '6px',
        padding: '8px 10px',
        zIndex: 9999, // Ensure it's always on top
        whiteSpace: 'pre-line',
        color: theme.tooltip.text,
        fontSize: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)',
        pointerEvents: 'none',
        minWidth: '150px',
        maxWidth: '300px'
      }}
    >
      <div 
        style={{ 
          fontWeight: 600, 
          marginBottom: '6px',
          paddingBottom: '6px',
          borderBottom: `1px solid ${theme.tooltip.border}`
        }}
      >
        {date}
      </div>
      {content.split('\n').map((line, i) => (
        <div 
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '2px 0'
          }}
        >
          <span>{line.split(': ')[0]}</span>
          <span style={{ fontWeight: 500 }}>{line.split(': ')[1]}</span>
        </div>
      ))}
    </div>
  );
}; 