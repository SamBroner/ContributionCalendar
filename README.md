# Habit Contribution Calendar

A customizable React component that visualizes multi-habit tracking in a GitHub-like contribution calendar style. Instead of traditional squares, each day is represented by an n-sided shape split into slices, where each segment represents a different habit's contribution.

## Installation

```bash
npm install habit-contribution-calendar
# or
yarn add habit-contribution-calendar
```

## Quick Start

```tsx
import { HabitCalendar, HabitToggles } from 'habit-contribution-calendar';

const MyHabitTracker = () => {
  const [activeHabits, setActiveHabits] = useState(['Running', 'Writing']);

  const habits = [
    {
      name: 'Running',
      dataSource: new CSVAdapter({
        file: 'running-data.csv',
        dateColumn: 'date',
        valueColumn: 'distance'
      }),
      color: 'red' // Uses predefined color scale
    },
    {
      name: 'Writing',
      dataSource: new CSVAdapter({
        file: 'writing-data.csv',
        dateColumn: 'date',
        valueColumn: 'words'
      }),
      color: 'blue'
    }
  ];

  const toggleHabit = (habitName: string) => {
    setActiveHabits(prev => 
      prev.includes(habitName)
        ? prev.filter(name => name !== habitName)
        : [...prev, habitName]
    );
  };

  return (
    <div>
      <HabitCalendar
        habits={habits}
        activeHabits={activeHabits}
        dateRangeType="calendar-year"
        year={2024}
      />
      <HabitToggles
        habits={habits}
        activeHabits={activeHabits}
        onToggle={toggleHabit}
      />
    </div>
  );
};
```

## Components

### HabitCalendar

The main calendar component that displays habit data in a GitHub-style contribution grid.

```tsx
interface HabitCalendarProps {
  habits: Habit[];              // Array of habit configurations
  activeHabits: string[];       // Array of habit names to display
  dateRangeType?: 'calendar-year' | 'trailing-12-months';
  year?: number;                // Year to display (for calendar-year type)
  shape?: 'triangle' | 'square' | 'hexagon' | 'octagon';
  size?: number;                // Size of each day cell in pixels
  gap?: number;                 // Gap between cells in pixels
  theme?: Theme;                // Custom theme configuration
}
```

### HabitToggles

A component that provides toggles for showing/hiding habits in the calendar.

```tsx
interface HabitTogglesProps {
  habits: Habit[];              // Array of habit configurations
  activeHabits: string[];       // Currently active habit names
  onToggle: (name: string) => void; // Toggle callback
  style?: React.CSSProperties;  // Optional custom styles
}
```

## Habit Configuration

Each habit requires a configuration object:

```tsx
interface Habit {
  name: string;                 // Unique identifier for the habit
  dataSource: DataSourceAdapter; // Data provider for the habit
  color: string | ColorScale;   // Color or color scale name
  threshold?: number;           // Optional value to consider as "completed"
  segment?: number;             // Optional position in the shape (0-based)
}
```

## Color Scales

The library includes predefined color scales that can be used by name:
- `'red'` - Shades of red (good for high-intensity activities)
- `'blue'` - Shades of blue (good for calm activities)
- `'green'` - GitHub-style greens
- `'purple'` - Shades of purple
- `'orange'` - Shades of orange
- `'teal'` - Shades of teal
- `'pink'` - Shades of pink
- `'indigo'` - Shades of indigo
- `'brown'` - Shades of brown
- `'cyan'` - Shades of cyan

Each scale includes 5 levels: empty, l1, l2, l3, l4 (lightest to darkest).

## Data Sources

### Built-in Adapters

1. CSVAdapter - For CSV file data:
```tsx
new CSVAdapter({
  file: string | File,         // Path or File object
  dateColumn: string,          // Name of date column
  valueColumn: string,         // Name of value column
  dateFormat?: string         // Optional date format
})
```

2. BaseAdapter - For creating custom adapters:
```tsx
class MyAdapter extends BaseAdapter {
  async getData(startDate: Date, endDate: Date): Promise<DayData[]> {
    // Return array of { date: string, value: number }
  }
}
```

## Theming

Customize the appearance with a theme object:

```tsx
interface Theme {
  background: string;          // Calendar background
  text: string;               // Text color
  tooltip: {
    background: string;
    text: string;
    border: string;
  };
  empty: string;              // Color for days with no data
}
```

## Shape Rules

The calendar automatically chooses appropriate shapes based on the number of active habits:
- 1 habit: Square
- 2 habits: Diagonal split square
- 3 habits: Hexagon with three segments
- 4 habits: Square split into four
- 5+ habits: Radial segments

## Development

```bash
# Install dependencies
npm install

# Build library
npm run build

# Run demo
npm run dev:demo

# Run tests
npm test
```

## License

MIT
