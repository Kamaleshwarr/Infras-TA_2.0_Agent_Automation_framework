import { BrowserContextOptions, LaunchOptions } from 'playwright';
import { getEnvironmentConfig } from './environment.config';

/**
 * Centralized Playwright browser and context configuration.
 * Artifacts follow retain-on-failure semantics via hooks.
 */
export interface PlaywrightConfig {
  launchOptions: LaunchOptions;
  contextOptions: BrowserContextOptions;
  traceDir: string;
  videoDir: string;
  screenshotDir: string;
  enableTracing: boolean;
  recordVideo: boolean;
  screenshotOnFailure: boolean;
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
    recordVideo: env.recordVideo,
    screenshotOnFailure: env.screenshotOnFailure,
  };
}
