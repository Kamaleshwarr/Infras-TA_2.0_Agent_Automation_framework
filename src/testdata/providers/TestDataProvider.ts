import * as path from 'path';
import { TestDataException } from '../../exceptions';
import { ITestDataProvider } from '../../interfaces';
import { JsonDataProvider } from '../../utils/json/jsonDataProvider';

/**
 * Unified test data access layer (facade).
 * Extend with CSV, Excel, database, and API providers as needed.
 */
export class TestDataProvider {
  private static readonly basePath = path.resolve(__dirname, '..');
  private static readonly jsonProvider: ITestDataProvider =
    new JsonDataProvider(TestDataProvider.basePath);

  static loadJson<T>(fileName: string): T {
    return TestDataProvider.jsonProvider.load<T>(fileName);
  }

  static loadByKey<T, K extends keyof T>(fileName: string, key: K): T[K] {
    const data = TestDataProvider.loadJson<T>(fileName);
    return data[key];
  }

  static loadCsv<T>(_fileName: string): T {
    throw new TestDataException(
      'CSV provider not yet implemented. Use loadJson() or extend CsvDataProvider.',
    );
  }

  static loadExcel<T>(_fileName: string): T {
    throw new TestDataException(
      'Excel provider not yet implemented. Use loadJson() or extend ExcelDataProvider.',
    );
  }

  static loadFromDatabase<T>(_query: string): T {
    throw new TestDataException(
      'Database provider not yet implemented. Extend DatabaseDataProvider.',
    );
  }

  static loadFromApi<T>(_endpoint: string): T {
    throw new TestDataException(
      'API provider not yet implemented. Extend ApiDataProvider.',
    );
  }
}
