import { Locator } from 'playwright';

/**
 * Contract for reusable verification methods.
 */
export interface IBaseAssertions {
  verifyVisible(locator: Locator, elementName: string): Promise<void>;
  verifyHidden(locator: Locator, elementName: string): Promise<void>;
  verifyEnabled(locator: Locator, elementName: string): Promise<void>;
  verifyDisabled(locator: Locator, elementName: string): Promise<void>;
  verifyText(
    locator: Locator,
    expectedText: string,
    elementName: string,
  ): Promise<void>;
  verifyContains(
    locator: Locator,
    expectedSubstring: string,
    elementName: string,
  ): Promise<void>;
  verifyValue(
    locator: Locator,
    expectedValue: string | RegExp,
    elementName: string,
  ): Promise<void>;
  verifyURL(expectedUrl: string | RegExp): Promise<void>;
  verifyTitle(expectedTitle: string | RegExp): Promise<void>;
  verifyCount(
    locator: Locator,
    expectedCount: number,
    elementName: string,
  ): Promise<void>;
  verifyAttribute(
    locator: Locator,
    attribute: string,
    expectedValue: string | RegExp,
    elementName: string,
  ): Promise<void>;
}
