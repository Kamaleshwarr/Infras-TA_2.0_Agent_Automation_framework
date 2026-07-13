import { FrameworkException } from './FrameworkException';

export class ElementNotFoundException extends FrameworkException {
  constructor(elementName: string, cause?: unknown) {
    super(
      `Element "${elementName}" was not found or not interactable within the timeout period.`,
      'ELEMENT_NOT_FOUND',
      cause,
    );
  }
}
