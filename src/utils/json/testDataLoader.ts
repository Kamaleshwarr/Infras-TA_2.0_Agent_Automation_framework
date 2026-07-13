import { TestDataProvider } from '../../testdata/providers/TestDataProvider';

/**
 * @deprecated Use TestDataProvider.loadJson() directly.
 */
export class TestDataLoader {
  static load<T>(fileName: string): T {
    return TestDataProvider.loadJson<T>(fileName);
  }

  static loadByKey<T, K extends keyof T>(fileName: string, key: K): T[K] {
    return TestDataProvider.loadByKey<T, K>(fileName, key);
  }
}

export { TestDataProvider };
