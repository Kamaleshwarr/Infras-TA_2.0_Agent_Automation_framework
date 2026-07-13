import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  ITestCaseHookParameter,
  Status,
} from '@cucumber/cucumber';
import * as fs from 'fs';
import * as path from 'path';
import { getPlaywrightConfig } from '../config/playwright.config';
import { getEnvironmentConfig } from '../config/environment.config';
import { dependencies } from '../core/DependencyRegistry';
import { CucumberAttach } from '../interfaces';
import { browserManager } from './browserManager';
import { CustomWorld } from './world';

const logger = dependencies.createLogger('Hooks');
const reportManager = dependencies.getReportManager();

BeforeAll(async function () {
  logger.info('Framework initialization started');
  reportManager.ensureReportDirectories();
  reportManager.writeEnvironmentProperties();
});

Before(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const config = getEnvironmentConfig();

  logger.info(
    `Starting scenario: ${scenario.pickle.name} [${scenario.pickle.tags.map((t) => t.name).join(', ')}]`,
  );

  await this.createContext();
  await this.createPage();

  logger.info(
    `Environment: ${config.environment} | Browser: ${config.browser}`,
  );
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const pwConfig = getPlaywrightConfig();
  const scenarioName = scenario.pickle.name.replace(/\W+/g, '_');
  const failed = scenario.result?.status === Status.FAILED;
  const video = this.page?.video();
  const attach = this.attach.bind(this) as unknown as CucumberAttach;

  try {
    if (failed) {
      logger.error(`Scenario failed: ${scenario.pickle.name}`);

      if (pwConfig.screenshotOnFailure) {
        const screenshot = await this.page.screenshot({ fullPage: true });
        await reportManager.attachScreenshot(attach, screenshot);
      }

      if (pwConfig.enableTracing) {
        this.tracePath = path.join(
          pwConfig.traceDir,
          `${scenarioName}-${Date.now()}.zip`,
        );
        await this.context.tracing.stop({ path: this.tracePath });
        await reportManager.attachTrace(attach, this.tracePath);
      }

      await reportManager.attachText(
        attach,
        'Failure Details',
        `Scenario: ${scenario.pickle.name}\nStatus: ${scenario.result?.status}\nMessage: ${scenario.result?.message ?? 'N/A'}`,
      );
    } else if (pwConfig.enableTracing) {
      await this.context.tracing.stop();
      logger.info(`Scenario passed: ${scenario.pickle.name}`);
    } else {
      logger.info(`Scenario passed: ${scenario.pickle.name}`);
    }
  } finally {
    await this.closeContext();

    if (failed) {
      const videoPath = await video?.path();
      await reportManager.attachVideo(attach, videoPath);
    } else {
      await cleanupPassArtifact(video);
    }

    if (this.tracePath && !failed && fs.existsSync(this.tracePath)) {
      fs.unlinkSync(this.tracePath);
    }
  }
});

AfterAll(async function () {
  await browserManager.closeBrowser();
  logger.info('Framework teardown completed');
});

async function cleanupPassArtifact(
  video: { path: () => Promise<string | null> } | null,
): Promise<void> {
  if (!video) return;

  try {
    const videoPath = await video.path();
    if (videoPath && fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }
  } catch {
    /* video not recorded */
  }
}
