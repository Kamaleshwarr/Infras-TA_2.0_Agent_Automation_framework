import { Locator } from 'playwright';

/**
 * Contract for reusable Playwright interaction methods implemented by BaseActions.
 */
export interface IBaseActions {
  click(locator: Locator, elementName: string): Promise<void>;
  fill(locator: Locator, value: string, elementName: string): Promise<void>;
  clear(locator: Locator, elementName: string): Promise<void>;
  doubleClick(locator: Locator, elementName: string): Promise<void>;
  hover(locator: Locator, elementName: string): Promise<void>;
  rightClick(locator: Locator, elementName: string): Promise<void>;
  dragAndDrop(
    source: Locator,
    target: Locator,
    sourceName: string,
    targetName: string,
  ): Promise<void>;
  uploadFile(
    locator: Locator,
    filePath: string,
    elementName: string,
  ): Promise<void>;
  downloadFile(triggerLocator: Locator, elementName: string): Promise<string>;
  selectDropdown(
    locator: Locator,
    value: string,
    elementName: string,
  ): Promise<void>;
  scrollIntoView(locator: Locator, elementName: string): Promise<void>;
  scrollToTop(): Promise<void>;
  scrollToBottom(): Promise<void>;
  pressKey(key: string, elementName?: string): Promise<void>;
  waitForVisible(locator: Locator, elementName: string): Promise<void>;
  waitForHidden(locator: Locator, elementName: string): Promise<void>;
  waitForPageLoad(): Promise<void>;
  waitForNetworkIdle(): Promise<void>;
  takeScreenshot(name: string): Promise<Buffer>;
  getText(locator: Locator, elementName: string): Promise<string>;
  getAttribute(
    locator: Locator,
    attribute: string,
    elementName: string,
  ): Promise<string | null>;
  isVisible(locator: Locator, elementName: string): Promise<boolean>;
  isEnabled(locator: Locator, elementName: string): Promise<boolean>;
  isDisabled(locator: Locator, elementName: string): Promise<boolean>;
  navigateTo(path: string): Promise<void>;
}
