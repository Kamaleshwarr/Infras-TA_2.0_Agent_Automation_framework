# Resources

## Purpose

Static files used during test execution — upload fixtures, sample documents, and supporting files for the Transamerica Agent Portal automation suite.

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
- Do not store credentials, mock applications, or secrets here.

## Current Contents

No upload fixtures added yet. This folder is reserved for future document upload scenarios in the Application Wizard flow.

## Related

- [BaseActions — uploadFile](../base/BaseActions.ts)
