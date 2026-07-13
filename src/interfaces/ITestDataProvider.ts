/**
 * Contract for loading test data from various sources.
 */
export interface ITestDataProvider {
  load<T>(source: string): T;
}
