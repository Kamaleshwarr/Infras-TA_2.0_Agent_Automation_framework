import { expect, Locator, Page } from '@playwright/test';
import { getEnvironmentConfig } from '../config/environment.config';
import { Logger } from '../utils/logger';

/**
 * Reusable assertion layer.
 * Keeps verification logic out of page classes and step definitions.
 */
export class BaseAssertions {
  protected readonly page: Page;
  protected readonly logger: Logger;
  private readonly actionTimeout: number;

  constructor(page: Page, logger: Logger) {
    this.page = page;
    this.logger = logger;
    this.actionTimeout = getEnvironmentConfig().actionTimeout;
  }

  async verifyText(
    locator: Locator,
    expectedText: string,
    elementName: string,
  ): Promise<void> {
    this.logger.info(
      `Verifying text of ${elementName} equals "${expectedText}"`,
    );
    await expect(locator).toHaveText(expectedText, {
      timeout: this.actionTimeout,
    });
  }

  async verifyContains(
    locator: Locator,
    expectedSubstring: string,
    elementName: string,
  ): Promise<void> {
    this.logger.info(
      `Verifying ${elementName} contains "${expectedSubstring}"`,
    );
    await expect(locator).toContainText(expectedSubstring, {
      timeout: this.actionTimeout,
    });
  }

  async verifyVisible(locator: Locator, elementName: string): Promise<void> {
    this.logger.info(`Verifying ${elementName} is visible`);
    await expect(locator).toBeVisible({ timeout: this.actionTimeout });
  }

  async verifyHidden(locator: Locator, elementName: string): Promise<void> {
    this.logger.info(`Verifying ${elementName} is hidden`);
    await expect(locator).toBeHidden({ timeout: this.actionTimeout });
  }

  async verifyURL(expectedUrl: string | RegExp): Promise<void> {
    this.logger.info(`Verifying URL matches: ${expectedUrl}`);
    await expect(this.page).toHaveURL(expectedUrl, {
      timeout: getEnvironmentConfig().navigationTimeout,
    });
  }

  async verifyTitle(expectedTitle: string | RegExp): Promise<void> {
    this.logger.info(`Verifying page title: ${expectedTitle}`);
    await expect(this.page).toHaveTitle(expectedTitle, {
      timeout: this.actionTimeout,
    });
  }

  async verifyCount(
    locator: Locator,
    expectedCount: number,
    elementName: string,
  ): Promise<void> {
    this.logger.info(
      `Verifying count of ${elementName} equals ${expectedCount}`,
    );
    await expect(locator).toHaveCount(expectedCount, {
      timeout: this.actionTimeout,
    });
  }

  async verifyAttribute(
    locator: Locator,
    attribute: string,
    expectedValue: string | RegExp,
    elementName: string,
  ): Promise<void> {
    this.logger.info(
      `Verifying attribute "${attribute}" of ${elementName}`,
    );
    await expect(locator).toHaveAttribute(attribute, expectedValue, {
      timeout: this.actionTimeout,
    });
  }
}
