import { BaseAdapter } from './base';
import { DayData } from '../types';

interface CSVAdapterConfig {
  file: string | File;
  dateColumn: string;
  valueColumn: string;
  aggregateFunction?: 'sum' | 'count' | 'average';
}

export class CSVAdapter extends BaseAdapter {
  private data: Map<string, number> = new Map();
  private config: CSVAdapterConfig;

  constructor(config: CSVAdapterConfig) {
    super();
    this.config = config;
  }

  protected async doInitialize(): Promise<void> {
    let content: string;

    if (typeof this.config.file === 'string') {
      const response = await fetch(this.config.file);
      content = await response.text();
    } else {
      content = await this.config.file.text();
    }

    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const dateIndex = headers.indexOf(this.config.dateColumn);
    const valueIndex = headers.indexOf(this.config.valueColumn);

    if (dateIndex === -1 || valueIndex === -1) {
      throw new Error('Required columns not found in CSV');
    }

    const aggregatedData = new Map<string, number[]>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim());
      const date = values[dateIndex];
      const value = parseFloat(values[valueIndex]);

      if (!isNaN(value)) {
        if (!aggregatedData.has(date)) {
          aggregatedData.set(date, []);
        }
        aggregatedData.get(date)!.push(value);
      }
    }

    aggregatedData.forEach((values, date) => {
      let finalValue: number;
      switch (this.config.aggregateFunction) {
        case 'count':
          finalValue = values.length;
          break;
        case 'average':
          finalValue = values.reduce((a, b) => a + b, 0) / values.length;
          break;
        case 'sum':
        default:
          finalValue = values.reduce((a, b) => a + b, 0);
      }
      this.data.set(date, finalValue);
    });
  }

  async getData(startDate: Date, endDate: Date): Promise<DayData[]> {
    this.validateDate(startDate);
    this.validateDate(endDate);

    const result: DayData[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = this.formatDate(currentDate);
      const value = this.data.get(dateStr) || 0;

      result.push({
        date: dateStr,
        value
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }
} 