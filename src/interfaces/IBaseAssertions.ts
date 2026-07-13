import { Locator } from 'playwright';

/**
 * Contract for reusable verification methods.
 */
export interface IBaseAssertions {
  verifyVisible(locator: Locator, elementName: string): Promise<void>;
  verifyText(
    locator: Locator,
    expectedText: string,
    elementName: string,
  ): Promise<void>;
  verifyURL(expectedUrl: string | RegExp): Promise<void>;
  verifyContains(
    locator: Locator,
    expectedSubstring: string,
    elementName: string,
  ): Promise<void>;
}
