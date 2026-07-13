import * as fs from 'fs';
import * as path from 'path';

/**
 * Loads JSON test data from src/testdata/.
 * Keeps credentials and scenario inputs out of source code.
 */
export class TestDataLoader {
  private static readonly basePath = path.resolve(__dirname, '../testdata');

  static load<T>(fileName: string): T {
    const filePath = path.join(this.basePath, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  }

  static loadByKey<T, K extends keyof T>(fileName: string, key: K): T[K] {
    const data = this.load<T>(fileName);
    return data[key];
  }
}
