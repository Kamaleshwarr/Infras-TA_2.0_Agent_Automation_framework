import { SENSITIVE_FIELD_PATTERNS } from '../../constants/FrameworkConstants';

/**
 * Determines if a field name represents sensitive data.
 */
export function isSensitiveField(fieldName: string): boolean {
  return SENSITIVE_FIELD_PATTERNS.some((pattern) => pattern.test(fieldName));
}

/**
 * Masks sensitive values for safe logging and reporting.
 */
export function maskValue(value: string, fieldName?: string): string {
  if (!value) return value;
  if (fieldName && isSensitiveField(fieldName)) {
    return '****';
  }
  return value;
}

/**
 * Sanitizes text before attaching to reports — removes potential secrets.
 */
export function sanitizeForReport(content: string): string {
  return content
    .replace(/password[=:]\s*\S+/gi, 'password=****')
    .replace(/secret[=:]\s*\S+/gi, 'secret=****')
    .replace(/token[=:]\s*\S+/gi, 'token=****');
}
