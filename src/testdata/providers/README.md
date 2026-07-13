# Test Data Providers

## Purpose

Single abstraction layer for loading test data from multiple sources.

## Files

| File                   | Status                            |
| ---------------------- | --------------------------------- |
| `ITestDataProvider.ts` | Interface                         |
| `JsonDataProvider.ts`  | ✅ Implemented                    |
| `TestDataProvider.ts`  | Facade / entry point              |
| `agentCredentials.ts`  | ✅ Agent env credentials resolver |

## Extending

Implement `ITestDataProvider` and register in `TestDataProvider`:

```typescript
export class CsvDataProvider implements ITestDataProvider {
  load<T>(source: string): T {
    // Parse CSV and return typed data
  }
}
```

## Usage

```typescript
TestDataProvider.loadJson<MyData>('module.json');
// Future:
// TestDataProvider.loadCsv<MyData>('module.csv');
// TestDataProvider.loadFromApi<MyData>('/api/users');
```
