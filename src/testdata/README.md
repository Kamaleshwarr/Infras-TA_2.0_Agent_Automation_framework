# Test Data

JSON-based test inputs separated from source code. Accessed via the **TestDataProvider** abstraction.

## Architecture

```
TestDataProvider (facade)
├── JsonDataProvider     ✅ implemented
├── CsvDataProvider      🔜 reserved
├── ExcelDataProvider    🔜 reserved
├── DatabaseDataProvider 🔜 reserved
└── ApiDataProvider      🔜 reserved
```

## Current Files

| File         | Module                               |
| ------------ | ------------------------------------ |
| `login.json` | Login credentials and error messages |

## Usage

```typescript
import { TestDataProvider } from '../testdata/providers/TestDataProvider';

const data = TestDataProvider.loadJson<LoginTestData>('login.json');
const user = TestDataProvider.loadByKey('login.json', 'validUser');
```

Legacy wrapper (still supported):

```typescript
import { TestDataLoader } from '../utils/testDataLoader';
const data = TestDataLoader.load<LoginTestData>('login.json');
```

## Coding Standards

- One JSON file per module.
- No hardcoded credentials in source code.
- Extend `ITestDataProvider` for new data sources.

## Providers

See [providers/](providers/) for the data provider implementation.

## Related

- [Test Data Strategy](../../.cursor/rules/architecture.md)
- [src/testdata/providers/TestDataProvider.ts](providers/TestDataProvider.ts)
