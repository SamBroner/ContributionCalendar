export interface DayData {
  date: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface DataSourceAdapter {
  getData(startDate: Date, endDate: Date): Promise<DayData[]>;
  initialize(): Promise<void>;
}

export interface ColorScale {
  empty: string;
  l1: string;
  l2: string;
  l3: string;
  l4: string;
}

export const defaultColorScales: Record<string, ColorScale> = {
  green: {
    empty: '#ebedf0',
    l1: '#9be9a8',
    l2: '#40c463',
    l3: '#30a14e',
    l4: '#216e39'
  },
  blue: {
    empty: '#ebedf0',
    l1: '#9cc7ff',
    l2: '#5094f0',
    l3: '#2f6ecc',
    l4: '#1c4587'
  },
  purple: {
    empty: '#ebedf0',
    l1: '#d8b9ff',
    l2: '#a371f7',
    l3: '#8957e5',
    l4: '#6e40c9'
  },
  orange: {
    empty: '#ebedf0',
    l1: '#ffd9b3',
    l2: '#ffa657',
    l3: '#e38549',
    l4: '#c96a3b'
  },
  red: {
    empty: '#ebedf0',
    l1: '#ffa3a3',
    l2: '#ff6b6b',
    l3: '#e64c4c',
    l4: '#cc3333'
  },
  teal: {
    empty: '#ebedf0',
    l1: '#9be9e9',
    l2: '#40c4c4',
    l3: '#30a1a1',
    l4: '#216e6e'
  },
  pink: {
    empty: '#ebedf0',
    l1: '#ffc3e1',
    l2: '#ff80bf',
    l3: '#e6509e',
    l4: '#cc337d'
  },
  indigo: {
    empty: '#ebedf0',
    l1: '#b4c6ff',
    l2: '#7a8ff7',
    l3: '#5465cc',
    l4: '#3b4999'
  },
  brown: {
    empty: '#ebedf0',
    l1: '#d4b499',
    l2: '#b38b6d',
    l3: '#8b6d4d',
    l4: '#664d33'
  },
  cyan: {
    empty: '#ebedf0',
    l1: '#99e6ff',
    l2: '#33ccff',
    l3: '#00a3cc',
    l4: '#007a99'
  }
};

export interface Habit {
  name: string;
  dataSource: DataSourceAdapter;
  color: string | ColorScale;
  threshold?: number;
  segment?: number;
}

export interface Theme {
  background: string;
  text: string;
  tooltip: {
    background: string;
    text: string;
    border: string;
  };
  empty: string;
}

export type ShapeType = 'triangle' | 'square' | 'hexagon' | 'octagon';

export type DateRangeType = 'calendar-year' | 'trailing-12-months';

export interface HabitCalendarProps {
  habits: Habit[];
  dateRangeType?: DateRangeType;
  year?: number; // Only used when dateRangeType is 'calendar-year'
  shape?: ShapeType;
  size?: number;
  gap?: number;
  theme?: Theme;
}

export interface DayCellProps {
  date: string;
  size: number;
  segments: Array<{
    habit: Habit;
    value: number;
  }>;
  theme: Theme;
}

export const defaultTheme: Theme = {
  background: '#ffffff',
  text: '#57606a',
  tooltip: {
    background: '#ffffff',
    text: '#24292f',
    border: '#d0d7de'
  },
  empty: '#ebedf0'
}; 