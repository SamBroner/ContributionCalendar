export interface DayData {
  date: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface DataSourceAdapter {
  getData(startDate: Date, endDate: Date): Promise<DayData[]>;
  initialize(): Promise<void>;
}

export interface Habit {
  name: string;
  dataSource: DataSourceAdapter;
  color: string;
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
  shape: ShapeType;
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