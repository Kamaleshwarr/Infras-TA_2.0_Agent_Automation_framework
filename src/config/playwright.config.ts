import { BrowserContextOptions, LaunchOptions } from 'playwright';
import { REPORT_PATHS } from '../constants/PathConstants';
import { getEnvironmentConfig } from './environment.config';

const AGENT_PORTAL_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

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
    userAgent: AGENT_PORTAL_USER_AGENT,
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
