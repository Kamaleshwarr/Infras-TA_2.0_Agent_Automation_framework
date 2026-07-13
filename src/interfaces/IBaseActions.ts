import { Locator } from 'playwright';

/**
 * Contract for reusable Playwright interaction methods.
 */
export interface IBaseActions {
  click(locator: Locator, elementName: string): Promise<void>;
  fill(locator: Locator, value: string, elementName: string): Promise<void>;
  navigateTo(path: string): Promise<void>;
  waitForVisible(locator: Locator, elementName: string): Promise<void>;
  waitForPageLoad(): Promise<void>;
}
