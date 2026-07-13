# Resources

## Purpose

Static files used during test execution — upload fixtures, sample documents, images, etc.

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
- Document each resource file in this README when added.
- Do not store credentials or secrets here.

## Current Contents

No resources added yet. Placeholder for future upload/download test fixtures.

## Related

- [BaseActions — uploadFile](../base/BaseActions.ts)
