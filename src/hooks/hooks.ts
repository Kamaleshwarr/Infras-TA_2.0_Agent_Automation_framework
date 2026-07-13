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
import { AllureHelper, CucumberAttach } from '../utils/allureHelper';
import { createLogger } from '../utils/logger';
import { CustomWorld } from './world';

const logger = createLogger('Hooks');

BeforeAll(async function () {
  logger.info('Framework initialization started');
  AllureHelper.ensureReportDirectories();
  AllureHelper.writeEnvironmentProperties();
});

Before(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const config = getEnvironmentConfig();

  logger.info(
    `Starting scenario: ${scenario.pickle.name} [${scenario.pickle.tags.map((t) => t.name).join(', ')}]`,
  );

  await this.launchBrowser();
  await this.createContext();
  await this.createPage();

  logger.info(`Environment: ${config.environment} | Browser: ${config.browser}`);
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

      const screenshot = await this.page.screenshot({ fullPage: true });
      await AllureHelper.attachScreenshot(attach, screenshot);

      this.tracePath = path.join(
        pwConfig.traceDir,
        `${scenarioName}-${Date.now()}.zip`,
      );
      await this.context.tracing.stop({ path: this.tracePath });
      await AllureHelper.attachTrace(attach, this.tracePath);

      await AllureHelper.attachText(
        attach,
        'Failure Details',
        `Scenario: ${scenario.pickle.name}\nStatus: ${scenario.result?.status}\nMessage: ${scenario.result?.message ?? 'N/A'}`,
      );
    } else {
      await this.context.tracing.stop();
      logger.info(`Scenario passed: ${scenario.pickle.name}`);
    }
  } finally {
    await this.closeBrowser();

    if (failed) {
      const videoPath = await video?.path();
      await AllureHelper.attachVideo(attach, videoPath);
    }

    if (this.tracePath && !failed && fs.existsSync(this.tracePath)) {
      fs.unlinkSync(this.tracePath);
    }
  }
});

AfterAll(async function () {
  logger.info('Framework teardown completed');
});
