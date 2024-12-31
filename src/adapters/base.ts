import { DataSourceAdapter, DayData } from '../types';

export abstract class BaseAdapter implements DataSourceAdapter {
  protected initialized: boolean = false;

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    await this.doInitialize();
    this.initialized = true;
  }

  protected abstract doInitialize(): Promise<void>;
  
  abstract getData(startDate: Date, endDate: Date): Promise<DayData[]>;

  protected validateDate(date: Date): void {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid date provided');
    }
  }

  protected formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
} 