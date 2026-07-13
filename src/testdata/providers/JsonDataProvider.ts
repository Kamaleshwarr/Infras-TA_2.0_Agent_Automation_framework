import * as fs from 'fs';
import * as path from 'path';
import { ITestDataProvider } from './ITestDataProvider';

/**
 * Loads test data from JSON files in src/testdata/.
 */
export class JsonDataProvider implements ITestDataProvider {
  constructor(private readonly basePath: string) {}

  load<T>(source: string): T {
    const filePath = path.join(this.basePath, source);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  }
}
