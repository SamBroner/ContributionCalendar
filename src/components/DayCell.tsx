import React, { useState } from 'react';
import { arc } from 'd3-shape';
import { DayCellProps } from '../types';

export const DayCell: React.FC<DayCellProps> = ({
  date,
  size,
  shape,
  segments,
  theme
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  const getPath = (startAngle: number, endAngle: number) => {
    const arcGenerator = arc()
      .innerRadius(0)
      .outerRadius(radius)
      .startAngle(startAngle)
      .endAngle(endAngle);

    return arcGenerator({} as any) || '';
  };

  const segmentCount = segments.length;
  const segmentAngle = (2 * Math.PI) / segmentCount;

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
      <svg width={size} height={size}>
        {segments.map((segment, index) => {
          const startAngle = index * segmentAngle;
          const endAngle = (index + 1) * segmentAngle;
          const value = segment.value;
          const color = value > 0 ? segment.habit.color : theme.empty;

          return (
            <path
              key={segment.habit.name}
              d={getPath(startAngle, endAngle)}
              fill={color}
              transform={`translate(${centerX}, ${centerY})`}
            />
          );
        })}
      </svg>

      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: theme.tooltip.background,
            border: `1px solid ${theme.tooltip.border}`,
            borderRadius: '4px',
            padding: '8px',
            zIndex: 1000,
            whiteSpace: 'nowrap',
            color: theme.tooltip.text,
            fontSize: '12px'
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{date}</div>
          {segments.map(segment => (
            <div key={segment.habit.name}>
              {segment.habit.name}: {segment.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 