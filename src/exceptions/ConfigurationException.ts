import { FrameworkException } from './FrameworkException';

export class ConfigurationException extends FrameworkException {
  constructor(message: string, cause?: unknown) {
    super(message, 'CONFIGURATION_ERROR', cause);
  }
}
