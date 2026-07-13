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
  enableTracing: boolean;
}

export function getPlaywrightConfig(): PlaywrightConfig {
  const env = getEnvironmentConfig();

  const contextOptions: BrowserContextOptions = {
    baseURL: env.baseUrl,
    viewport: env.viewport,
    acceptDownloads: true,
  };

  if (env.recordVideo) {
    contextOptions.recordVideo = {
      dir: 'src/reports/videos/',
      size: env.viewport,
    };
  }

  return {
    launchOptions: {
      headless: env.headless,
      slowMo: env.slowMo,
    },
    contextOptions,
    traceDir: 'src/reports/traces/',
    videoDir: 'src/reports/videos/',
    screenshotDir: 'src/reports/screenshots/',
    enableTracing: env.enableTracing,
  };
}
