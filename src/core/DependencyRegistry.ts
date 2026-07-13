import { IBrowserFactory, ILogger, IReportManager } from '../interfaces';
import { BrowserFactory, browserFactory } from '../config/browserFactory';
import { Logger, createLogger } from '../utils/common/logger';
import { AllureReportManager } from '../utils/report/allureReportManager';

/**
 * Lightweight dependency registry — central access point for shared services.
 * Avoids scattering `new` across hooks and page objects.
 */
class DependencyRegistry {
  private browserFactoryInstance: IBrowserFactory = browserFactory;
  private reportManagerInstance: IReportManager = new AllureReportManager();

  getBrowserFactory(): IBrowserFactory {
    return this.browserFactoryInstance;
  }

  getReportManager(): IReportManager {
    return this.reportManagerInstance;
  }

  createLogger(context: string): ILogger {
    return createLogger(context);
  }

  /** Allows test-time substitution without changing consumers. */
  setBrowserFactory(factory: IBrowserFactory): void {
    this.browserFactoryInstance = factory;
  }

  setReportManager(manager: IReportManager): void {
    this.reportManagerInstance = manager;
  }
}

export const dependencies = new DependencyRegistry();

export { Logger, BrowserFactory };
