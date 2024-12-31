import React, { useState } from 'react';
import { format } from 'date-fns';
import { DayCellProps } from '../types';

export const DayCell: React.FC<DayCellProps> = ({
  date,
  size,
  segments,
  theme
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const formattedDate = format(new Date(date), 'MMM d, yyyy');
  const tooltipContent = segments
    .filter(s => s.value > 0)
    .map(s => `${s.habit.name}: ${s.value}`)
    .join('\n');

  const renderShape = () => {
    const numSegments = segments.length;

    // Single habit - simple square
    if (numSegments === 1) {
      return (
        <rect
          width={size}
          height={size}
          fill={segments[0].value > 0 ? segments[0].habit.color : theme.empty}
        />
      );
    }

    // Two habits - diagonal split square
    if (numSegments === 2) {
      return (
        <>
          <path
            d={`M0,0 L${size},0 L${size},${size} L0,0`}
            fill={segments[0].value > 0 ? segments[0].habit.color : theme.empty}
          />
          <path
            d={`M0,0 L0,${size} L${size},${size} L0,0`}
            fill={segments[1].value > 0 ? segments[1].habit.color : theme.empty}
          />
        </>
      );
    }

    // Three habits - hexagon split into thirds
    if (numSegments === 3) {
      const center = size / 2;
      const radius = size / 2;
      return (
        <>
          {segments.map((segment, i) => {
            const startAngle = (i * 120 - 60) * (Math.PI / 180);
            const endAngle = ((i + 1) * 120 - 60) * (Math.PI / 180);
            const x1 = center + radius * Math.cos(startAngle);
            const y1 = center + radius * Math.sin(startAngle);
            const x2 = center + radius * Math.cos(endAngle);
            const y2 = center + radius * Math.sin(endAngle);
            
            return (
              <path
                key={i}
                d={`M${center},${center} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`}
                fill={segment.value > 0 ? segment.habit.color : theme.empty}
              />
            );
          })}
        </>
      );
    }

    // Four habits - four squares
    if (numSegments === 4) {
      const halfSize = size / 2;
      return (
        <>
          {segments.map((segment, i) => {
            const x = i % 2 === 0 ? 0 : halfSize;
            const y = i < 2 ? 0 : halfSize;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={halfSize}
                height={halfSize}
                fill={segment.value > 0 ? segment.habit.color : theme.empty}
              />
            );
          })}
        </>
      );
    }

    // Five or more habits - pentagon with radial segments
    const center = size / 2;
    const radius = size / 2;
    return (
      <>
        {segments.map((segment, i) => {
          const angleStep = (2 * Math.PI) / segments.length;
          const startAngle = i * angleStep - Math.PI / 2;
          const endAngle = (i + 1) * angleStep - Math.PI / 2;
          const x1 = center + radius * Math.cos(startAngle);
          const y1 = center + radius * Math.sin(startAngle);
          const x2 = center + radius * Math.cos(endAngle);
          const y2 = center + radius * Math.sin(endAngle);
          
          return (
            <path
              key={i}
              d={`M${center},${center} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`}
              fill={segment.value > 0 ? segment.habit.color : theme.empty}
            />
          );
        })}
      </>
    );
  };

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          border: '1px solid rgba(27, 31, 35, 0.06)',
          borderRadius: '2px'
        }}
      >
        {renderShape()}
      </svg>

      {showTooltip && tooltipContent && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '5px',
            backgroundColor: theme.tooltip.background,
            border: `1px solid ${theme.tooltip.border}`,
            borderRadius: '3px',
            padding: '8px',
            zIndex: 1000,
            whiteSpace: 'pre-line',
            color: theme.tooltip.text,
            fontSize: '11px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>{formattedDate}</div>
          {tooltipContent}
        </div>
      )}
    </div>
  );
}; 