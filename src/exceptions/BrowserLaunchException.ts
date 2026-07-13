import { FrameworkException } from './FrameworkException';

export class BrowserLaunchException extends FrameworkException {
  constructor(browser: string, cause?: unknown) {
    super(
      `Failed to launch browser "${browser}". Verify installation with "npx playwright install".`,
      'BROWSER_LAUNCH_FAILED',
      cause,
    );
  }
}
