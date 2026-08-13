import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { getEnvironmentConfig } from '../../config/environment.config';
import {
  FRAMEWORK_NAME,
  FRAMEWORK_VERSION,
} from '../../constants/FrameworkConstants';
import { REPORT_FILES, REPORT_PATHS } from '../../constants/PathConstants';
import { ReportGenerationException } from '../../exceptions';
import {
  AssertionReportPayload,
  IReportManager,
  CucumberAttach,
} from '../../interfaces';
import { sanitizeForReport } from '../string/maskHelper';
import {
  ValidationMatrixCollector,
  buildAssertionAttachmentTitle,
} from './validationMatrixCollector';
import { attachment, ContentType } from 'allure-js-commons';

export { CucumberAttach };

/**
 * Allure report manager — handles metadata, directories, and artifact attachments.
 */
export class AllureReportManager implements IReportManager {
  private validationMatrixCollector: ValidationMatrixCollector | null = null;
  ensureReportDirectories(): void {
    Object.values(REPORT_PATHS).forEach((dir) => {
      const resolved = path.resolve(process.cwd(), dir);
      if (!fs.existsSync(resolved)) {
        fs.mkdirSync(resolved, { recursive: true });
      }
    });
  }

  writeEnvironmentProperties(): void {
    const config = getEnvironmentConfig();
    const metadata = this.collectExecutionMetadata();

    const content = [
      `Framework=${FRAMEWORK_NAME}`,
      `Framework.Version=${FRAMEWORK_VERSION}`,
      `Browser=${config.browser}`,
      `Environment=${config.environment}`,
      `BaseURL=${config.baseUrl}`,
      `Headless=${config.headless}`,
      `Node.Version=${metadata.nodeVersion}`,
      `OS=${metadata.os}`,
      `Playwright.Version=${metadata.playwrightVersion}`,
      `Git.Branch=${metadata.gitBranch}`,
      `Git.Commit=${metadata.gitCommit}`,
      `Execution.Timestamp=${metadata.timestamp}`,
    ].join('\n');

    this.writePropertiesFile(REPORT_FILES.environmentProperties, content);
    this.writeExecutorProperties();
  }

  writeExecutorProperties(): void {
    const metadata = this.collectExecutionMetadata();
    const content = [
      `executor.type=framework`,
      `executor.name=${FRAMEWORK_NAME}`,
      `executor.version=${FRAMEWORK_VERSION}`,
      `executor.node=${metadata.nodeVersion}`,
      `executor.os=${metadata.os}`,
      `executor.buildBranch=${metadata.gitBranch}`,
      `executor.buildUrl=${metadata.gitCommit}`,
    ].join('\n');

    this.writePropertiesFile(REPORT_FILES.executorProperties, content);
  }

  async attachScreenshot(
    attach: CucumberAttach,
    screenshot: Buffer,
    name = 'Failure Screenshot',
  ): Promise<void> {
    await attach(screenshot, 'image/png');
    await attach(`Screenshot: ${name}`, 'text/plain');
  }

  async attachText(
    attach: CucumberAttach,
    name: string,
    content: string,
  ): Promise<void> {
    await attach(sanitizeForReport(`${name}\n${content}`), 'text/plain');
  }

  setValidationMatrixCollector(
    collector: ValidationMatrixCollector | null,
  ): void {
    this.validationMatrixCollector = collector;
  }

  async attachHtml(
    attach: CucumberAttach,
    name: string,
    html: string,
  ): Promise<void> {
    await attach(html, 'text/html');
    await attach(sanitizeForReport(name), 'text/plain');
  }

  async attachAssertionResult(
    _attach: CucumberAttach,
    payload: AssertionReportPayload,
  ): Promise<void> {
    this.validationMatrixCollector?.record(payload);

    const lines = [
      '--------------------------------',
      payload.assertionName,
      '--------------------------------',
      '',
      'Expected:',
      payload.expected,
      '',
      'Actual:',
      payload.actual,
      '',
      'Result:',
      payload.result,
      '--------------------------------',
    ];

    if (payload.scenarioName) {
      lines.splice(4, 0, `Scenario: ${payload.scenarioName}`, '');
    }

    if (payload.stepName) {
      lines.splice(
        payload.scenarioName ? 6 : 4,
        0,
        `Step: ${payload.stepName}`,
        '',
      );
    }

    if (payload.context) {
      lines.splice(lines.length - 1, 0, '', `Context: ${payload.context}`);
    }

    const attachmentTitle = buildAssertionAttachmentTitle(payload);
    await attachment(
      attachmentTitle,
      sanitizeForReport(lines.join('\n')),
      ContentType.TEXT,
    );
  }

  async attachVideo(
    attach: CucumberAttach,
    videoPath: string | null | undefined,
  ): Promise<void> {
    if (!videoPath || !fs.existsSync(videoPath)) return;
    const videoBuffer = fs.readFileSync(videoPath);
    await attach(videoBuffer, 'video/webm');
  }

  async attachTrace(attach: CucumberAttach, tracePath: string): Promise<void> {
    if (!fs.existsSync(tracePath)) return;
    const traceBuffer = fs.readFileSync(tracePath);
    await attach(traceBuffer, 'application/zip');
  }

  private writePropertiesFile(fileName: string, content: string): void {
    try {
      const filePath = path.join(
        process.cwd(),
        REPORT_PATHS.allureResults,
        fileName,
      );
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content);
    } catch (error) {
      throw new ReportGenerationException(`Failed to write ${fileName}`, error);
    }
  }

  private collectExecutionMetadata(): {
    nodeVersion: string;
    os: string;
    playwrightVersion: string;
    gitBranch: string;
    gitCommit: string;
    timestamp: string;
  } {
    let playwrightVersion = 'unknown';
    try {
      playwrightVersion = require('playwright/package.json').version;
    } catch {
      /* optional */
    }

    return {
      nodeVersion: process.version,
      os: `${process.platform} ${process.arch}`,
      playwrightVersion,
      gitBranch: this.safeGitCommand('git rev-parse --abbrev-ref HEAD'),
      gitCommit: this.safeGitCommand('git rev-parse --short HEAD'),
      timestamp: new Date().toISOString(),
    };
  }

  private safeGitCommand(command: string): string {
    try {
      return execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
    } catch {
      return 'unavailable';
    }
  }
}
