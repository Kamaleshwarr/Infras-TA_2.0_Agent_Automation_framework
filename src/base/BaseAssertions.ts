import { expect, Locator, Page } from '@playwright/test';
import { getEnvironmentConfig } from '../config/environment.config';
import { dependencies } from '../core/DependencyRegistry';
import {
  AssertionReportContext,
  AssertionResultStatus,
  IBaseAssertions,
  ILogger,
} from '../interfaces';

/**
 * Reusable assertion layer with optional Expected/Actual Allure reporting.
 */
export class BaseAssertions implements IBaseAssertions {
  protected readonly page: Page;
  protected readonly logger: ILogger;
  private readonly actionTimeout: number;
  private reportContext: AssertionReportContext;

  constructor(
    page: Page,
    logger: ILogger,
    reportContext: AssertionReportContext = {},
  ) {
    this.page = page;
    this.logger = logger;
    this.actionTimeout = getEnvironmentConfig().actionTimeout;
    this.reportContext = reportContext;
  }

  setReportContext(context: AssertionReportContext): void {
    this.reportContext = { ...this.reportContext, ...context };
  }

  async verifyText(
    locator: Locator,
    expectedText: string,
    elementName: string,
  ): Promise<void> {
    await this.assertTextEquals(
      `Verify text of ${elementName}`,
      locator,
      expectedText,
      elementName,
      { exact: true },
    );
  }

  async verifyContains(
    locator: Locator,
    expectedSubstring: string,
    elementName: string,
  ): Promise<void> {
    await this.assertTextEquals(
      `Verify ${elementName} contains expected text`,
      locator,
      expectedSubstring,
      elementName,
      { exact: false },
    );
  }

  async verifyVisible(locator: Locator, elementName: string): Promise<void> {
    this.logger.info(`Verifying ${elementName} is visible`);
    try {
      await expect(locator).toBeVisible({ timeout: this.actionTimeout });
      await this.recordAssertion(
        `Verify ${elementName} is visible`,
        'visible',
        'visible',
        'PASS',
        elementName,
      );
    } catch (error) {
      const actual = (await this.isLocatorVisible(locator))
        ? 'visible'
        : 'hidden';
      await this.recordAssertion(
        `Verify ${elementName} is visible`,
        'visible',
        actual,
        'FAIL',
        elementName,
      );
      throw error;
    }
  }

  async verifyHidden(locator: Locator, elementName: string): Promise<void> {
    this.logger.info(`Verifying ${elementName} is hidden`);
    try {
      await expect(locator).toBeHidden({ timeout: this.actionTimeout });
      await this.recordAssertion(
        `Verify ${elementName} is hidden`,
        'hidden',
        'hidden',
        'PASS',
        elementName,
      );
    } catch (error) {
      const actual = (await this.isLocatorVisible(locator))
        ? 'visible'
        : 'hidden';
      await this.recordAssertion(
        `Verify ${elementName} is hidden`,
        'hidden',
        actual,
        'FAIL',
        elementName,
      );
      throw error;
    }
  }

  async verifyEnabled(locator: Locator, elementName: string): Promise<void> {
    this.logger.info(`Verifying ${elementName} is enabled`);
    try {
      await expect(locator).toBeEnabled({ timeout: this.actionTimeout });
      await this.recordAssertion(
        `Verify ${elementName} is enabled`,
        'enabled',
        'enabled',
        'PASS',
        elementName,
      );
    } catch (error) {
      const enabled = await locator.isEnabled();
      await this.recordAssertion(
        `Verify ${elementName} is enabled`,
        'enabled',
        enabled ? 'enabled' : 'disabled',
        'FAIL',
        elementName,
      );
      throw error;
    }
  }

  async verifyDisabled(locator: Locator, elementName: string): Promise<void> {
    this.logger.info(`Verifying ${elementName} is disabled`);
    try {
      await expect(locator).toBeDisabled({ timeout: this.actionTimeout });
      await this.recordAssertion(
        `Verify ${elementName} is disabled`,
        'disabled',
        'disabled',
        'PASS',
        elementName,
      );
    } catch (error) {
      const enabled = await locator.isEnabled();
      await this.recordAssertion(
        `Verify ${elementName} is disabled`,
        'disabled',
        enabled ? 'enabled' : 'disabled',
        'FAIL',
        elementName,
      );
      throw error;
    }
  }

  async verifyValue(
    locator: Locator,
    expectedValue: string | RegExp,
    elementName: string,
  ): Promise<void> {
    const actualValue = await locator.inputValue();
    const passed =
      expectedValue instanceof RegExp
        ? expectedValue.test(actualValue)
        : actualValue === expectedValue;
    const expectedLabel =
      expectedValue instanceof RegExp
        ? expectedValue.toString()
        : expectedValue;

    await this.recordAssertion(
      `Verify value of ${elementName}`,
      expectedLabel,
      actualValue,
      passed ? 'PASS' : 'FAIL',
      elementName,
    );
    await expect(locator).toHaveValue(expectedValue, {
      timeout: this.actionTimeout,
    });
  }

  async verifyURL(expectedUrl: string | RegExp): Promise<void> {
    const actualUrl = this.page.url();
    const passed =
      expectedUrl instanceof RegExp
        ? expectedUrl.test(actualUrl)
        : actualUrl.includes(expectedUrl);

    await this.recordAssertion(
      'Verify page URL',
      expectedUrl instanceof RegExp ? expectedUrl.toString() : expectedUrl,
      actualUrl,
      passed ? 'PASS' : 'FAIL',
    );
    await expect(this.page).toHaveURL(expectedUrl, {
      timeout: getEnvironmentConfig().navigationTimeout,
    });
  }

  async verifyTitle(expectedTitle: string | RegExp): Promise<void> {
    const actualTitle = await this.page.title();
    const passed =
      expectedTitle instanceof RegExp
        ? expectedTitle.test(actualTitle)
        : actualTitle === expectedTitle;

    await this.recordAssertion(
      'Verify page title',
      expectedTitle instanceof RegExp
        ? expectedTitle.toString()
        : expectedTitle,
      actualTitle,
      passed ? 'PASS' : 'FAIL',
    );
    await expect(this.page).toHaveTitle(expectedTitle, {
      timeout: this.actionTimeout,
    });
  }

  async verifyCount(
    locator: Locator,
    expectedCount: number,
    elementName: string,
  ): Promise<void> {
    const actualCount = await locator.count();
    await this.recordAssertion(
      `Verify count of ${elementName}`,
      String(expectedCount),
      String(actualCount),
      actualCount === expectedCount ? 'PASS' : 'FAIL',
      elementName,
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
    const actualValue = (await locator.getAttribute(attribute)) ?? '';
    const passed =
      expectedValue instanceof RegExp
        ? expectedValue.test(actualValue)
        : actualValue === expectedValue;

    await this.recordAssertion(
      `Verify attribute "${attribute}" of ${elementName}`,
      expectedValue instanceof RegExp
        ? expectedValue.toString()
        : expectedValue,
      actualValue,
      passed ? 'PASS' : 'FAIL',
      elementName,
    );
    await expect(locator).toHaveAttribute(attribute, expectedValue, {
      timeout: this.actionTimeout,
    });
  }

  protected async assertTextEquals(
    assertionName: string,
    locator: Locator,
    expected: string,
    elementName: string,
    options: { exact: boolean },
  ): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: this.actionTimeout });
    const actual = ((await locator.textContent()) ?? '').trim();
    const passed = options.exact
      ? actual === expected
      : actual.includes(expected);

    await this.recordAssertion(
      assertionName,
      expected,
      actual,
      passed ? 'PASS' : 'FAIL',
      elementName,
    );

    if (options.exact) {
      await expect(locator).toHaveText(expected, {
        timeout: this.actionTimeout,
      });
      return;
    }

    await expect(locator).toContainText(expected, {
      timeout: this.actionTimeout,
    });
  }

  protected async readVisibleText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout: this.actionTimeout });
    return ((await locator.textContent()) ?? '').trim();
  }

  protected async recordAssertion(
    assertionName: string,
    expected: string,
    actual: string,
    result: AssertionResultStatus,
    context?: string,
  ): Promise<void> {
    this.logger.info(
      `${assertionName} | expected="${expected}" actual="${actual}" result=${result}`,
    );

    if (!this.reportContext.attach) {
      return;
    }

    await dependencies
      .getReportManager()
      .attachAssertionResult(this.reportContext.attach, {
        assertionName,
        expected,
        actual,
        result,
        scenarioName: this.reportContext.scenarioName,
        stepName: this.reportContext.stepName,
        context,
      });
  }

  private async isLocatorVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }
}
