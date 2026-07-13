/**
 * Abstraction for loading test data from multiple sources.
 * Extend with CSV, Excel, database, and API providers as needed.
 */
export interface ITestDataProvider {
  load<T>(source: string): T;
}
