import { AssertionReportPayload } from './IAssertionReporter';
import type { ValidationMatrixCollector } from '../utils/report/validationMatrixCollector';

export type CucumberAttach = (
  data: Buffer | string,
  mediaType?: string,
) => void | Promise<void>;

/**
 * Contract for report generation and artifact management.
 */
export interface IReportManager {
  ensureReportDirectories(): void;
  writeEnvironmentProperties(): void;
  writeExecutorProperties(): void;
  attachScreenshot(
    attach: CucumberAttach,
    screenshot: Buffer,
    name?: string,
  ): Promise<void>;
  attachText(
    attach: CucumberAttach,
    name: string,
    content: string,
  ): Promise<void>;
  attachAssertionResult(
    attach: CucumberAttach,
    payload: AssertionReportPayload,
  ): Promise<void>;
  setValidationMatrixCollector(
    collector: ValidationMatrixCollector | null,
  ): void;
  attachHtml(attach: CucumberAttach, name: string, html: string): Promise<void>;
  attachVideo(
    attach: CucumberAttach,
    videoPath: string | null | undefined,
  ): Promise<void>;
  attachTrace(attach: CucumberAttach, tracePath: string): Promise<void>;
}
