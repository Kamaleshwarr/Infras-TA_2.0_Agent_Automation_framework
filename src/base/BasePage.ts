import { Page } from 'playwright';
import { dependencies } from '../core/DependencyRegistry';
import { ILogger } from '../interfaces';
import { BaseActions } from './BaseActions';
import { BaseAssertions } from './BaseAssertions';

/**
 * Abstract base for all page objects.
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly actions: BaseActions;
  protected readonly assertions: BaseAssertions;
  protected readonly logger: ILogger;

  constructor(page: Page, loggerContext: string) {
    this.page = page;
    this.logger = dependencies.createLogger(loggerContext);
    this.actions = new BaseActions(page, this.logger);
    this.assertions = new BaseAssertions(page, this.logger);
  }
}
