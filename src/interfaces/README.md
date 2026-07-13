# Interfaces

## Purpose

Contracts for interface-driven design and extensibility.

## Interfaces

| Interface           | Implementation        |
| ------------------- | --------------------- |
| `IBrowserFactory`   | `BrowserFactory`      |
| `ILogger`           | `Logger` (Winston)    |
| `ITestDataProvider` | `JsonDataProvider`    |
| `IBaseActions`      | `BaseActions`         |
| `IBaseAssertions`   | `BaseAssertions`      |
| `IReportManager`    | `AllureReportManager` |

## Usage

Consumers depend on interfaces via `DependencyRegistry`:

```typescript
import { dependencies } from '../core/DependencyRegistry';

const factory = dependencies.getBrowserFactory();
const logger = dependencies.createLogger('MyComponent');
const reports = dependencies.getReportManager();
```

## Standards

- Program against interfaces, not concrete classes, in hooks and core.
- Page objects may use concrete base classes directly.
