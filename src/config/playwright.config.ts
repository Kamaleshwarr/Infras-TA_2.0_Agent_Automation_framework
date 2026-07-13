import { BrowserContextOptions, LaunchOptions } from 'playwright';
import { getEnvironmentConfig } from './environment.config';

/**
 * Centralized Playwright browser and context configuration.
 * Consumed by hooks to launch browsers consistently across all scenarios.
 */
export interface PlaywrightConfig {
  launchOptions: LaunchOptions;
  contextOptions: BrowserContextOptions;
  traceDir: string;
  videoDir: string;
  screenshotDir: string;
}

export function getPlaywrightConfig(): PlaywrightConfig {
  const env = getEnvironmentConfig();

  return {
    launchOptions: {
      headless: env.headless,
      slowMo: env.slowMo,
    },
    contextOptions: {
      baseURL: env.baseUrl,
      viewport: env.viewport,
      recordVideo: {
        dir: 'src/reports/videos/',
        size: env.viewport,
      },
      acceptDownloads: true,
    },
    traceDir: 'src/reports/traces/',
    videoDir: 'src/reports/videos/',
    screenshotDir: 'src/reports/screenshots/',
  };
}
