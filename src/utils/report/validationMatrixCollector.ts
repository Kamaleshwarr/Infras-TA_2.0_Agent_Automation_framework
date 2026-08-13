import {
  AssertionReportPayload,
  AssertionResultStatus,
  CucumberAttach,
} from '../../interfaces';

export interface ValidationMatrixRow {
  category: string;
  validation: string;
  expected: string;
  actual: string;
  result: AssertionResultStatus;
}

const FIELD_VALIDATION_FORMAT_KEYWORDS = ['format', 'numeric'];

/**
 * Collects assertion payloads during a Licensing flow and renders a consolidated HTML matrix.
 */
export class ValidationMatrixCollector {
  private readonly rows: ValidationMatrixRow[] = [];

  record(payload: AssertionReportPayload): void {
    const { category, validation } = parseAssertionMetadata(payload);

    this.rows.push({
      category,
      validation,
      expected: payload.expected,
      actual: payload.actual,
      result: payload.result,
    });
  }

  getSummary(): { total: number; pass: number; fail: number } {
    const pass = this.rows.filter((row) => row.result === 'PASS').length;
    return {
      total: this.rows.length,
      pass,
      fail: this.rows.length - pass,
    };
  }

  buildHtml(flowLabel: string): string {
    const summary = this.getSummary();
    const rowsHtml = this.rows
      .map((row, index) => renderRow(index + 1, row))
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Licensing Validation Matrix</title>
<style>
  body { font-family: Segoe UI, Arial, sans-serif; margin: 20px; color: #1f2937; background: #ffffff; }
  h1 { font-size: 1.35rem; margin: 0 0 12px 0; color: #111827; }
  .summary { margin: 0 0 18px 0; padding: 12px 14px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; }
  .summary p { margin: 4px 0; font-size: 0.95rem; }
  table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  th, td { border: 1px solid #d1d5db; padding: 8px 10px; vertical-align: top; text-align: left; }
  th { background: #e5e7eb; font-weight: 600; }
  tr:nth-child(even) td { background: #f9fafb; }
  .pass { color: #166534; font-weight: 600; white-space: nowrap; }
  .fail { color: #b91c1c; font-weight: 600; white-space: nowrap; background: #fef2f2; }
  td.num { text-align: center; width: 42px; }
  td.category { width: 170px; font-weight: 500; }
  td.result { width: 92px; }
</style>
</head>
<body>
<h1>LICENSING VALIDATION MATRIX</h1>
<div class="summary">
  <p><strong>Flow:</strong> ${escapeHtml(flowLabel)}</p>
  <p><strong>Total Validations:</strong> ${summary.total}</p>
  <p><strong>PASS:</strong> ${summary.pass}</p>
  <p><strong>FAIL:</strong> ${summary.fail}</p>
</div>
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Category</th>
      <th>Validation</th>
      <th>Expected</th>
      <th>Actual</th>
      <th>Result</th>
    </tr>
  </thead>
  <tbody>
${rowsHtml}
  </tbody>
</table>
</body>
</html>`;
  }

  async attachHtml(
    attach: CucumberAttach,
    title: string,
    flowLabel: string,
  ): Promise<void> {
    const html = this.buildHtml(flowLabel);
    await attach(html, 'text/html');
    await attach(title, 'text/plain');
  }
}

function renderRow(index: number, row: ValidationMatrixRow): string {
  const resultClass = row.result === 'PASS' ? 'pass' : 'fail';
  const resultLabel = row.result === 'PASS' ? '✅ PASS' : '❌ FAIL';

  return `    <tr>
      <td class="num">${index}</td>
      <td class="category">${escapeHtml(row.category)}</td>
      <td>${escapeHtml(row.validation)}</td>
      <td>${escapeHtml(row.expected)}</td>
      <td>${escapeHtml(row.actual)}</td>
      <td class="result ${resultClass}">${resultLabel}</td>
    </tr>`;
}

function parseAssertionMetadata(payload: AssertionReportPayload): {
  category: string;
  validation: string;
} {
  for (const candidate of [payload.assertionName, payload.context ?? '']) {
    const parsed = parseLabeledAssertion(candidate);
    if (parsed) {
      return {
        category: mapDisplayCategory(parsed.rawCategory, parsed.validation),
        validation: parsed.validation,
      };
    }
  }

  return {
    category: 'Validation',
    validation: payload.assertionName,
  };
}

function parseLabeledAssertion(
  raw: string,
): { rawCategory: string; validation: string } | null {
  let text = raw.trim();
  text = text.replace(/^Verify\s+(?:attribute\s+"[^"]+"\s+of\s+)?/, '');
  text = text.replace(/\s+contains expected text$/, '');
  text = text.replace(/\s+is\s+(visible|hidden|enabled|disabled)$/, '');

  const prefixMatch = text.match(/^\[(?:PASS|FAIL)\]\s*[✅❌]\s*(.+)$/);
  if (!prefixMatch) {
    return null;
  }

  const remainder = prefixMatch[1].trim();
  const separatorIndex = remainder.indexOf(' — ');
  if (separatorIndex < 0) {
    return {
      rawCategory: 'Validation',
      validation: remainder,
    };
  }

  return {
    rawCategory: remainder.slice(0, separatorIndex).trim(),
    validation: remainder.slice(separatorIndex + 3).trim(),
  };
}

function parseLabeledAssertionForAttachment(
  raw: string,
): { rawCategory: string; validation: string } | null {
  let text = raw.trim();
  text = text.replace(/^Verify\s+(?:attribute\s+"[^"]+"\s+of\s+)?/, '');
  text = text.replace(/\s+contains expected text$/, '');
  text = text.replace(/\s+is\s+(visible|hidden|enabled|disabled)$/, '');

  const prefixMatch = text.match(/^\[(?:PASS|FAIL)\]\s*[✅❌]\s*(.+)$/);
  if (!prefixMatch) {
    return null;
  }

  const remainder = prefixMatch[1].trim();
  const nestedCategory = parseNestedSplitAgentCategory(remainder);
  if (nestedCategory) {
    return nestedCategory;
  }

  const separatorIndex = remainder.indexOf(' — ');
  if (separatorIndex < 0) {
    return {
      rawCategory: 'Validation',
      validation: remainder,
    };
  }

  return {
    rawCategory: remainder.slice(0, separatorIndex).trim(),
    validation: remainder.slice(separatorIndex + 3).trim(),
  };
}

function parseNestedSplitAgentCategory(
  remainder: string,
): { rawCategory: string; validation: string } | null {
  const nestedPrefixes = [
    'Split Agent — Add',
    'Split Agent — Edit',
    'Split Agent — Cancel',
    'Split Agent — Delete',
    'Split Agent — Maximum',
  ];

  for (const prefix of nestedPrefixes) {
    const nestedSeparator = `${prefix} — `;
    if (remainder.startsWith(nestedSeparator)) {
      return {
        rawCategory: prefix,
        validation: remainder.slice(nestedSeparator.length).trim(),
      };
    }
  }

  return null;
}

export function buildAssertionAttachmentTitle(
  payload: AssertionReportPayload,
): string {
  const { category, validation } =
    parseAssertionMetadataForAttachmentTitle(payload);
  const indicator = payload.result === 'PASS' ? '✅' : '❌';
  return `${indicator} ${category} — ${validation}`;
}

function parseAssertionMetadataForAttachmentTitle(
  payload: AssertionReportPayload,
): { category: string; validation: string } {
  for (const candidate of [payload.assertionName, payload.context ?? '']) {
    const parsed = parseLabeledAssertionForAttachment(candidate);
    if (parsed) {
      return {
        category: mapDisplayCategory(parsed.rawCategory, parsed.validation),
        validation: parsed.validation,
      };
    }
  }

  return {
    category: 'Validation',
    validation: payload.assertionName,
  };
}

function mapDisplayCategory(rawCategory: string, validation: string): string {
  if (rawCategory === 'Licensing Page') {
    return 'Page Structure';
  }

  if (rawCategory === 'Agent Address' || rawCategory === 'License Number') {
    return 'Page Structure';
  }

  if (rawCategory === 'Field Validations') {
    const lowerValidation = validation.toLowerCase();
    if (
      FIELD_VALIDATION_FORMAT_KEYWORDS.some((keyword) =>
        lowerValidation.includes(keyword),
      )
    ) {
      return 'Format Validation';
    }
    return 'Required Validation';
  }

  if (rawCategory === 'Additional Agents') {
    return 'Additional Agents';
  }

  if (rawCategory === 'Split Agent — Add') {
    return 'Add Agent';
  }

  if (rawCategory === 'Split Agent — Edit') {
    return 'Edit Agent';
  }

  if (rawCategory === 'Split Agent — Cancel') {
    return 'Cancel Edit';
  }

  if (rawCategory === 'Split Agent — Delete') {
    return 'Delete Agent';
  }

  if (rawCategory === 'Split Agent — Maximum') {
    return 'Maximum Agents';
  }

  if (rawCategory === 'Percentage Validation') {
    return 'Percentage Validation';
  }

  if (rawCategory === 'Navigation') {
    return 'Navigation';
  }

  if (rawCategory === 'Persistence') {
    return 'Persistence';
  }

  if (rawCategory === 'Form Restore') {
    return 'Restore/Cleanup';
  }

  return rawCategory;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
