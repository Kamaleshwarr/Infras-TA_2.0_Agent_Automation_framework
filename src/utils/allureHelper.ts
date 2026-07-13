import * as fs from 'fs';
import * as path from 'path';
import { getEnvironmentConfig } from '../config/environment.config';
import { REPORT_PATHS } from '../constants';

export type CucumberAttach = (
  data: Buffer | string,
  mediaType?: string,
) => void | Promise<void>;

/**
 * Allure metadata and artifact attachment helpers.
 * Uses Cucumber's attach API so artifacts flow into Allure via the reporter.
 */
export class AllureHelper {
  static writeEnvironmentProperties(): void {
    const config = getEnvironmentConfig();
    const content = [
      `Browser=${config.browser}`,
      `Environment=${config.environment}`,
      `BaseURL=${config.baseUrl}`,
    ].join('\n');

    const filePath = path.join(
      process.cwd(),
      REPORT_PATHS.allureResults,
      'environment.properties',
    );
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  }

  static async attachScreenshot(
    attach: CucumberAttach,
    screenshot: Buffer,
    name = 'Failure Screenshot',
  ): Promise<void> {
    await attach(screenshot, 'image/png');
    await attach(`Screenshot: ${name}`, 'text/plain');
  }

  static async attachText(
    attach: CucumberAttach,
    name: string,
    content: string,
  ): Promise<void> {
    await attach(`${name}\n${content}`, 'text/plain');
  }

  static async attachVideo(
    attach: CucumberAttach,
    videoPath: string | null | undefined,
  ): Promise<void> {
    if (!videoPath || !fs.existsSync(videoPath)) return;
    const videoBuffer = fs.readFileSync(videoPath);
    await attach(videoBuffer, 'video/webm');
  }

  static async attachTrace(
    attach: CucumberAttach,
    tracePath: string,
  ): Promise<void> {
    if (!fs.existsSync(tracePath)) return;
    const traceBuffer = fs.readFileSync(tracePath);
    await attach(traceBuffer, 'application/zip');
  }

  static ensureReportDirectories(): void {
    Object.values(REPORT_PATHS).forEach((dir) => {
      const resolved = path.resolve(process.cwd(), dir);
      if (!fs.existsSync(resolved)) {
        fs.mkdirSync(resolved, { recursive: true });
      }
    });
  }
}
