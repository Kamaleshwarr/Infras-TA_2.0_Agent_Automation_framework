import { Page } from 'playwright';
import { BaseActions } from './BaseActions';
import { BaseAssertions } from './BaseAssertions';
import { createLogger, Logger } from '../utils/logger';

/**
 * Abstract base for all page objects.
 * Provides shared actions, assertions, and logging to every page class.
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly actions: BaseActions;
  protected readonly assertions: BaseAssertions;
  protected readonly logger: Logger;

  constructor(page: Page, loggerContext: string) {
    this.page = page;
    this.logger = createLogger(loggerContext);
    this.actions = new BaseActions(page, this.logger);
    this.assertions = new BaseAssertions(page, this.logger);
  }
}
