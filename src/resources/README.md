# Resources

## Purpose

Static files used during test execution — upload fixtures, sample documents, images, and demo application pages.

## Agent Portal Demo

| Path                                    | Description                                                      |
| --------------------------------------- | ---------------------------------------------------------------- |
| [agent-portal/](agent-portal/README.md) | Static HTML demo for Login → Dashboard → Application Wizard flow |

## Usage

Reference files from page objects or test data:

```typescript
await this.actions.uploadFile(
  this.locators.fileInput,
  'src/resources/sample-document.pdf',
  'File input',
);
```

## Coding Standards

- Keep files small and purpose-specific.
- Document each resource folder in this README when added.
- Do not store credentials or secrets here.

## Related

- [BaseActions — uploadFile](../base/BaseActions.ts)
- [ApplicationConstants](../constants/ApplicationConstants.ts)
