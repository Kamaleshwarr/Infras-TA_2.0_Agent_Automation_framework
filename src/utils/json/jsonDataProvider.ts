import * as fs from 'fs';
import * as path from 'path';
import { TestDataException } from '../../exceptions';
import { ITestDataProvider } from '../../interfaces';

/**
 * Loads test data from JSON files in src/testdata/.
 */
export class JsonDataProvider implements ITestDataProvider {
  constructor(private readonly basePath: string) {}

  load<T>(source: string): T {
    const filePath = path.join(this.basePath, source);

    if (!fs.existsSync(filePath)) {
      throw new TestDataException(`Test data file not found: ${filePath}`);
    }

    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw) as T;
    } catch (error) {
      throw new TestDataException(
        `Failed to parse test data file: ${filePath}`,
        error,
      );
    }
  }
}
