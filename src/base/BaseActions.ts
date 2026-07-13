import { Locator, Page } from 'playwright';
import { getEnvironmentConfig } from '../config/environment.config';
import { Logger } from '../utils/logger';

/**
 * Reusable Playwright interaction layer.
 * All page classes delegate low-level browser actions here to avoid duplication.
 */
export class BaseActions {
  protected readonly page: Page;
  protected readonly logger: Logger;
  private readonly actionTimeout: number;

  constructor(page: Page, logger: Logger) {
    this.page = page;
    this.logger = logger;
    this.actionTimeout = getEnvironmentConfig().actionTimeout;
  }

  async click(locator: Locator, elementName: string): Promise<void> {
    this.logger.info(`Clicking ${elementName}`);
    await locator.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await locator.click({ timeout: this.actionTimeout });
  }

  async fill(
    locator: Locator,
    value: string,
    elementName: string,
  ): Promise<void> {
    this.logger.info(`Entering value into ${elementName}`);
    await locator.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await locator.fill(value, { timeout: this.actionTimeout });
  }

  async clear(locator: Locator, elementName: string): Promise<void> {
    this.logger.info(`Clearing ${elementName}`);
    await locator.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await locator.clear({ timeout: this.actionTimeout });
  }

  async doubleClick(locator: Locator, elementName: string): Promise<void> {
    this.logger.info(`Double-clicking ${elementName}`);
    await locator.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await locator.dblclick({ timeout: this.actionTimeout });
  }

  async hover(locator: Locator, elementName: string): Promise<void> {
    this.logger.info(`Hovering over ${elementName}`);
    await locator.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await locator.hover({ timeout: this.actionTimeout });
  }

  async rightClick(locator: Locator, elementName: string): Promise<void> {
    this.logger.info(`Right-clicking ${elementName}`);
    await locator.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await locator.click({ button: 'right', timeout: this.actionTimeout });
  }

  async dragAndDrop(
    source: Locator,
    target: Locator,
    sourceName: string,
    targetName: string,
  ): Promise<void> {
    this.logger.info(`Dragging ${sourceName} to ${targetName}`);
    await source.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await target.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await source.dragTo(target, { timeout: this.actionTimeout });
  }

  async uploadFile(
    locator: Locator,
    filePath: string,
    elementName: string,
  ): Promise<void> {
    this.logger.info(`Uploading file to ${elementName}: ${filePath}`);
    await locator.setInputFiles(filePath, { timeout: this.actionTimeout });
  }

  async downloadFile(
    triggerLocator: Locator,
    elementName: string,
  ): Promise<string> {
    this.logger.info(`Downloading file via ${elementName}`);
    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout: this.actionTimeout }),
      this.click(triggerLocator, elementName),
    ]);
    const filePath = await download.path();
    if (!filePath) {
      throw new Error(`Download failed for ${elementName}`);
    }
    return filePath;
  }

  async selectDropdown(
    locator: Locator,
    value: string,
    elementName: string,
  ): Promise<void> {
    this.logger.info(`Selecting "${value}" in ${elementName}`);
    await locator.waitFor({ state: 'visible', timeout: this.actionTimeout });
    await locator.selectOption(value, { timeout: this.actionTimeout });
  }

  async scrollIntoView(
    locator: Locator,
    elementName: string,
  ): Promise<void> {
    this.logger.info(`Scrolling ${elementName} into view`);
    await locator.scrollIntoViewIfNeeded({ timeout: this.actionTimeout });
  }

  async scrollToTop(): Promise<void> {
    this.logger.info('Scrolling to top of page');
    await this.page.evaluate('window.scrollTo(0, 0)');
  }

  async scrollToBottom(): Promise<void> {
    this.logger.info('Scrolling to bottom of page');
    await this.page.evaluate(
      'window.scrollTo(0, document.body.scrollHeight)',
    );
  }

  async pressKey(key: string, elementName?: string): Promise<void> {
    const target = elementName ?? 'page';
    this.logger.info(`Pressing key "${key}" on ${target}`);
    await this.page.keyboard.press(key);
  }

  async waitForVisible(
    locator: Locator,
    elementName: string,
  ): Promise<void> {
    this.logger.info(`Waiting for ${elementName} to be visible`);
    await locator.waitFor({ state: 'visible', timeout: this.actionTimeout });
  }

  async waitForHidden(locator: Locator, elementName: string): Promise<void> {
    this.logger.info(`Waiting for ${elementName} to be hidden`);
    await locator.waitFor({ state: 'hidden', timeout: this.actionTimeout });
  }

  async waitForPageLoad(): Promise<void> {
    this.logger.info('Waiting for page load');
    await this.page.waitForLoadState('load', {
      timeout: getEnvironmentConfig().navigationTimeout,
    });
  }

  async waitForNetworkIdle(): Promise<void> {
    this.logger.info('Waiting for network idle');
    await this.page.waitForLoadState('networkidle', {
      timeout: getEnvironmentConfig().navigationTimeout,
    });
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    this.logger.info(`Taking screenshot: ${name}`);
    return this.page.screenshot({ fullPage: true });
  }

  async getText(locator: Locator, elementName: string): Promise<string> {
    this.logger.info(`Getting text from ${elementName}`);
    await locator.waitFor({ state: 'visible', timeout: this.actionTimeout });
    const text = await locator.textContent();
    return text?.trim() ?? '';
  }

  async getAttribute(
    locator: Locator,
    attribute: string,
    elementName: string,
  ): Promise<string | null> {
    this.logger.info(`Getting attribute "${attribute}" from ${elementName}`);
    await locator.waitFor({ state: 'attached', timeout: this.actionTimeout });
    return locator.getAttribute(attribute);
  }

  async isVisible(locator: Locator, elementName: string): Promise<boolean> {
    this.logger.info(`Checking visibility of ${elementName}`);
    return locator.isVisible();
  }

  async isEnabled(locator: Locator, elementName: string): Promise<boolean> {
    this.logger.info(`Checking if ${elementName} is enabled`);
    return locator.isEnabled();
  }

  async isDisabled(locator: Locator, elementName: string): Promise<boolean> {
    this.logger.info(`Checking if ${elementName} is disabled`);
    return locator.isDisabled();
  }

  async navigateTo(path: string): Promise<void> {
    const config = getEnvironmentConfig();
    const url = path.startsWith('http') ? path : `${config.baseUrl}${path}`;
    this.logger.info(`Navigating to URL: ${url}`);
    await this.page.goto(url, {
      waitUntil: 'load',
      timeout: config.navigationTimeout,
    });
  }
}
