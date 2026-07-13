import { FrameworkException } from './FrameworkException';

export class TestDataException extends FrameworkException {
  constructor(message: string, cause?: unknown) {
    super(message, 'TEST_DATA_ERROR', cause);
  }
}
