import { TestDataException } from '../../exceptions';
import { LicensingFlowResolver } from '../licensing/LicensingFlowResolver';

/**
 * Scenario execution context for Proposed Primary Insured Page 1.
 * The state name is set once from the feature file and reused by all steps.
 */
export class PiPage1ExecutionContext {
  readonly stateName: string;
  readonly flowLabel: string;
  readonly matrixTitle: string;

  private constructor(stateName: string) {
    this.stateName = stateName;
    this.flowLabel = `${stateName} — Term Life Proposed Primary Insured Page 1`;
    this.matrixTitle = `Proposed Primary Insured Page 1 – ${stateName}`;
  }

  static create(stateName: string): PiPage1ExecutionContext {
    const normalized = stateName.trim();
    if (!normalized) {
      throw new TestDataException(
        'Proposed Primary Insured Page 1 requires a non-empty application state.',
      );
    }

    LicensingFlowResolver.resolveFlow(normalized);

    return new PiPage1ExecutionContext(normalized);
  }
}
