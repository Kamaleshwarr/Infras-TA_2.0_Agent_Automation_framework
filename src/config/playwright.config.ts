import { BrowserContextOptions, LaunchOptions } from 'playwright';
import { REPORT_PATHS } from '../constants/PathConstants';
import { getEnvironmentConfig } from './environment.config';

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
      dir: REPORT_PATHS.videos + '/',
      size: env.viewport,
    };
  }

  return {
    launchOptions: {
      headless: env.headless,
      slowMo: env.slowMo,
    },
    contextOptions,
    traceDir: REPORT_PATHS.traces + '/',
    videoDir: REPORT_PATHS.videos + '/',
    screenshotDir: REPORT_PATHS.screenshots + '/',
    enableTracing: env.enableTracing,
    recordVideo: env.recordVideo,
    screenshotOnFailure: env.screenshotOnFailure,
  };
}
