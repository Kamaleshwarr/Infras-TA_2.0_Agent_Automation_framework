# Core

## Purpose

Framework core services — dependency access and shared registry.

## Contents

| File                    | Responsibility                                   |
| ----------------------- | ------------------------------------------------ |
| `DependencyRegistry.ts` | Lightweight service locator for shared instances |

## Design

Avoids scattering `new` across the codebase while keeping DI lightweight (no container framework).

```typescript
import { dependencies } from '../core/DependencyRegistry';

dependencies.getBrowserFactory();
dependencies.getReportManager();
dependencies.createLogger('Context');
```

## Testing

Substitute implementations for testing:

```typescript
dependencies.setBrowserFactory(mockFactory);
```

## Related

- [interfaces/README.md](../interfaces/README.md)
