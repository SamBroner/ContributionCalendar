import React, { useState, useCallback } from 'react';
import { format, isAfter, startOfDay, parseISO } from 'date-fns';
import { DayCellProps, ColorScale, defaultColorScales } from '../types';
import { Tooltip } from './Tooltip';

const getColorForValue = (value: number, color: string | ColorScale): string => {
  if (typeof color === 'string') {
    if (color in defaultColorScales) {
      color = defaultColorScales[color];
    } else {
      return value > 0 ? color : '#ebedf0';
    }
  }

  if (value === 0) return color.empty;
  if (value <= 3) return color.l1;
  if (value <= 6) return color.l2;
  if (value <= 9) return color.l3;
  return color.l4;
};

export const DayCell: React.FC<DayCellProps> = ({
  date,
  size,
  segments,
  theme
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Parse the ISO date string properly
  const cellDate = parseISO(date);
  const today = startOfDay(new Date());
  const isFutureDate = isAfter(cellDate, today);


  const formattedDate = format(cellDate, 'MMM d, yyyy');
  const tooltipContent = segments
    .filter(s => s.value > 0)
    .map(s => `${s.habit.name}: ${s.value}`)
    .join('\n');

  const renderShape = () => {
    // Return empty square for future dates
    if (isFutureDate) {
      return (
        <rect
          width={size}
          height={size}
          fill={theme.empty}
        />
      );
    }

    const numSegments = segments.length;

    // Single habit - simple square
    if (numSegments === 1) {
      return (
        <rect
          width={size}
          height={size}
          fill={getColorForValue(segments[0].value, segments[0].habit.color)}
        />
      );
    }

    // Two habits - diagonal split square
    if (numSegments === 2) {
      return (
        <>
          <path
            d={`M0,0 L${size},0 L${size},${size} L0,0`}
            fill={getColorForValue(segments[0].value, segments[0].habit.color)}
          />
          <path
            d={`M0,0 L0,${size} L${size},${size} L0,0`}
            fill={getColorForValue(segments[1].value, segments[1].habit.color)}
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
                fill={getColorForValue(segment.value, segment.habit.color)}
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
                fill={getColorForValue(segment.value, segment.habit.color)}
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
              fill={getColorForValue(segment.value, segment.habit.color)}
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
      onMouseEnter={() => !isFutureDate && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseMove={handleMouseMove}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          border: '1px solid rgba(27, 31, 35, 0.06)',
          borderRadius: '2px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {renderShape()}
      </svg>

      {showTooltip && tooltipContent && !isFutureDate && (
        <div style={{ 
          position: 'fixed',
          left: tooltipPosition.x,
          top: tooltipPosition.y,
          pointerEvents: 'none',
          zIndex: 10000 // Ensure tooltip is above everything
        }}>
          <Tooltip
            date={formattedDate}
            content={tooltipContent}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
}; 