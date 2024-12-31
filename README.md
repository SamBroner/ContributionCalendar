# Habit Contribution Calendar

A customizable React component that visualizes multi-habit tracking in a GitHub-like contribution calendar style. Instead of traditional squares, each day is represented by an n-sided shape split into slices, where each segment represents a different habit's contribution.

## Features

- Multiple habit tracking in a single, dense visualization
- Flexible data source integration through plugin architecture
- Customizable appearance (colors, shapes, sizes)
- Built-in data source adapters:
  - Strava activity imports
  - CSV data aggregation
  - Markdown file header analysis
- Responsive design with zoom and pan capabilities
- Tooltip support for detailed daily information

## Installation

```bash
npm install habit-contribution-calendar
# or
yarn add habit-contribution-calendar
```

## Basic Usage

```jsx
import { HabitCalendar } from 'habit-contribution-calendar';
import { StravaAdapter, CSVAdapter, MarkdownAdapter } from 'habit-contribution-calendar/adapters';

const MyHabitTracker = () => {
  const habits = [
    {
      name: 'Running',
      dataSource: new StravaAdapter({
        activityType: 'run',
        metricType: 'distance'
      }),
      color: '#ff4d4d'
    },
    {
      name: 'Writing',
      dataSource: new MarkdownAdapter({
        directory: './content',
        aggregateBy: 'headers'
      }),
      color: '#4d94ff'
    }
  ];

  return (
    <HabitCalendar
      habits={habits}
      startDate="2024-01-01"
      shape="hexagon"
      size={20}
      gap={2}
    />
  );
};
```

## Component API

### HabitCalendar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| habits | Habit[] | required | Array of habit configurations |
| startDate | string | current year start | ISO date string for calendar start |
| endDate | string | current date | ISO date string for calendar end |
| shape | 'triangle' \| 'square' \| 'hexagon' \| 'octagon' | Square for 1 or 2 habits, shape with n sides for n habits | Shape of day cells |
| size | number | 16 | Size of each day cell in pixels |
| gap | number | 2 | Gap between cells in pixels |
| theme | Theme | defaultTheme | Theme configuration object |

## Shape Rules

The calendar uses different shapes and segmentation rules based on the number of active habits:

1. **Single Habit**: A simple square cell, filled with the habit's color.
2. **Two Habits**: A square cell split diagonally from top-right to bottom-left, creating two triangular segments.
3. **Three Habits**: A hexagonal cell divided into three equal segments.
4. **Four Habits**: A square cell subdivided into four equal smaller squares.
5. **Five or More Habits**: A pentagonal cell divided into n equal radial segments, where n is the number of habits.

Each segment's color intensity represents the relative value of that habit's contribution for the day.

### Habit Configuration

```typescript
interface Habit {
  name: string;
  dataSource: DataSourceAdapter;
  color: string;
  threshold?: number; // Optional value to consider as "completed"
  segment?: number; // Position in the shape (0-based)
}
```

## Data Source Adapters

### Built-in Adapters

1. StravaAdapter
```typescript
interface StravaAdapterConfig {
  activityType: 'run' | 'ride' | 'swim' | string;
  metricType: 'distance' | 'time' | 'calories';
  authToken?: string;
}
```

2. CSVAdapter
```typescript
interface CSVAdapterConfig {
  file: string | File;
  dateColumn: string;
  valueColumn: string;
  aggregateFunction?: 'sum' | 'count' | 'average';
}
```

3. MarkdownAdapter
```typescript
interface MarkdownAdapterConfig {
  directory: string;
  aggregateBy: 'headers' | 'wordCount';
  headerPattern?: RegExp;
}
```

### Creating Custom Adapters

Implement the `DataSourceAdapter` interface to create custom data sources:

```typescript
interface DataSourceAdapter {
  getData(startDate: Date, endDate: Date): Promise<DayData[]>;
  initialize(): Promise<void>;
}

interface DayData {
  date: string; // ISO date string
  value: number;
  metadata?: Record<string, any>;
}
```

## Themes

The component supports comprehensive theming:

```typescript
interface Theme {
  background: string;
  text: string;
  tooltip: {
    background: string;
    text: string;
    border: string;
  };
  empty: string; // Color for days with no data
}
```

## Development

### Project Structure

```
src/
├── components/
│   ├── HabitCalendar.tsx
│   ├── DayCell.tsx
│   └── Tooltip.tsx
├── adapters/
│   ├── base.ts
│   ├── strava.ts
│   ├── csv.ts
│   └── markdown.ts
├── utils/
│   ├── shapes.ts
│   ├── date.ts
│   └── aggregate.ts
└── types.ts
```

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```
