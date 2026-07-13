import { Page } from 'playwright';
import { BasePage } from '../base/BasePage';
import { DashboardLocators } from '../locators/DashboardLocators';

/**
 * Dashboard page — lightweight navigation layer only.
 */
export class DashboardPage extends BasePage {
  private readonly locators: DashboardLocators;

  constructor(page: Page) {
    super(page, 'DashboardPage');
    this.locators = new DashboardLocators(page);
  }

  async verifyDashboardLoaded(): Promise<void> {
    this.logger.info('Verifying dashboard is loaded');
    await this.assertions.verifyVisible(
      this.locators.dashboardContainer,
      'Dashboard container',
    );
  }

  async clickCreateNewApplication(): Promise<void> {
    this.logger.info('Clicking Create New Application');
    await this.actions.click(
      this.locators.createNewApplicationButton,
      'Create New Application button',
    );
    await this.actions.waitForPageLoad();
  }
}
