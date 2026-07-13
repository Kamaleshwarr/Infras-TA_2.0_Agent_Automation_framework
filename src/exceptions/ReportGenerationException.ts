import { FrameworkException } from './FrameworkException';

export class ReportGenerationException extends FrameworkException {
  constructor(message: string, cause?: unknown) {
    super(message, 'REPORT_GENERATION_ERROR', cause);
  }
}
