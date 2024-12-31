import { DayData } from '../../src/types';

// Helper to generate random values with some patterns
const generateValue = (baseValue: number, variance: number): number => {
  return Math.max(0, baseValue + (Math.random() - 0.5) * variance);
};

// Generate data for a specific habit with patterns
const generateHabitData = (
  startDate: Date,
  endDate: Date,
  config: {
    baseValue: number,
    variance: number,
    weekendMultiplier?: number,
    skipProbability?: number,
    seasonalMultiplier?: boolean
  }
): DayData[] => {
  const data: DayData[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const month = currentDate.getMonth();
    const seasonalFactor = config.seasonalMultiplier
      ? 1 + Math.sin((month / 12) * 2 * Math.PI) * 0.3 // Higher values in summer
      : 1;

    if (Math.random() > (config.skipProbability || 0)) {
      let value = generateValue(config.baseValue, config.variance);
      
      // Apply multipliers
      if (isWeekend && config.weekendMultiplier) {
        value *= config.weekendMultiplier;
      }
      value *= seasonalFactor;

      data.push({
        date: currentDate.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

// Generate demo data for each habit
const startDate = new Date('2023-01-01');
const endDate = new Date('2024-12-31');

// Create a simple data source class that implements DataSourceAdapter
class DemoDataSource {
  constructor(private data: DayData[]) {}

  async getData(startDate: Date, endDate: Date): Promise<DayData[]> {
    return this.data.filter(d => {
      const date = new Date(d.date);
      return date >= startDate && date <= endDate;
    });
  }

  async initialize(): Promise<void> {
    // No initialization needed for demo data
  }
}

// Generate the data
const runningData = generateHabitData(startDate, endDate, {
  baseValue: 5, // 5km average
  variance: 3,
  weekendMultiplier: 1.5, // Longer runs on weekends
  skipProbability: 0.3, // Skip some days
  seasonalMultiplier: true // More running in summer
});

const meditationData = generateHabitData(startDate, endDate, {
  baseValue: 20, // 20 minutes average
  variance: 10,
  skipProbability: 0.15 // More consistent habit
});

const writingData = generateHabitData(startDate, endDate, {
  baseValue: 500, // 500 words
  variance: 300,
  weekendMultiplier: 1.8, // More writing on weekends
  skipProbability: 0.25
});

const codingData = generateHabitData(startDate, endDate, {
  baseValue: 4, // 4 hours
  variance: 2,
  weekendMultiplier: 0.5, // Less coding on weekends
  skipProbability: 0.1 // Very consistent
});

const exerciseData = generateHabitData(startDate, endDate, {
  baseValue: 45, // 45 minutes
  variance: 20,
  skipProbability: 0.2,
  seasonalMultiplier: true // More exercise in summer
});

// Export habit configurations with proper data sources
export const habits = [
  {
    name: 'Running',
    dataSource: new DemoDataSource(runningData),
    color: 'red', // Using predefined color scale
    unit: 'km'
  },
  {
    name: 'Meditation',
    dataSource: new DemoDataSource(meditationData),
    color: 'blue', // Using predefined color scale
    unit: 'min'
  },
  {
    name: 'Writing',
    dataSource: new DemoDataSource(writingData),
    color: 'green', // Using predefined color scale
    unit: 'words'
  },
  {
    name: 'Coding',
    dataSource: new DemoDataSource(codingData),
    color: 'purple', // Using predefined color scale
    unit: 'hours'
  },
  {
    name: 'Exercise',
    dataSource: new DemoDataSource(exerciseData),
    color: 'orange', // Using predefined color scale
    unit: 'min'
  }
]; 