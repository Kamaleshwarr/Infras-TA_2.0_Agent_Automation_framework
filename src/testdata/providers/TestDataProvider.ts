import * as path from 'path';
import { ITestDataProvider } from './ITestDataProvider';
import { JsonDataProvider } from './JsonDataProvider';

/**
 * Unified test data access layer.
 * Add CSV, Excel, database, and API providers here as the framework evolves.
 */
export class TestDataProvider {
  private static readonly basePath = path.resolve(__dirname, '..');
  private static readonly jsonProvider = new JsonDataProvider(this.basePath);

  static loadJson<T>(fileName: string): T {
    return this.jsonProvider.load<T>(fileName);
  }

  static loadByKey<T, K extends keyof T>(fileName: string, key: K): T[K] {
    const data = this.loadJson<T>(fileName);
    return data[key];
  }

  /** Reserved for future CSV support. */
  static loadCsv<T>(_fileName: string): T {
    throw new Error(
      'CSV provider not yet implemented. Use loadJson() or extend CsvDataProvider.',
    );
  }

  /** Reserved for future Excel support. */
  static loadExcel<T>(_fileName: string): T {
    throw new Error(
      'Excel provider not yet implemented. Use loadJson() or extend ExcelDataProvider.',
    );
  }

  /** Reserved for future database support. */
  static loadFromDatabase<T>(_query: string): T {
    throw new Error(
      'Database provider not yet implemented. Extend DatabaseDataProvider.',
    );
  }

  /** Reserved for future API-driven test data. */
  static loadFromApi<T>(_endpoint: string): T {
    throw new Error(
      'API provider not yet implemented. Extend ApiDataProvider.',
    );
  }

  static registerProvider(_name: string, _provider: ITestDataProvider): void {
    throw new Error(
      'Custom provider registration will be available in a future release.',
    );
  }
}
