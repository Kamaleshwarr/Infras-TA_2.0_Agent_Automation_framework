import { TestDataException } from '../../exceptions';
import { ApplicationCreationSelection } from '../../pages/ApplicationCreationPage';
import { TestDataProvider } from '../../testdata/providers/TestDataProvider';

export type LicensingFlowId = 'FLOW_A' | 'FLOW_B' | 'FLOW_C' | 'FLOW_D';

export interface LicensingFieldDefinition {
  fieldId: string;
  type: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  disabled?: boolean;
}

export interface LicensingFlowProfile {
  representativeState: string;
  agentAddressPresent: boolean;
  licenseNumberPresent: boolean;
}

export interface SplitAgentData {
  firstName: string;
  lastName: string;
  agentNumber: string;
  percent: string;
  licenseNumber?: string;
}

export interface LicensingTestData {
  module: string;
  validationMessages: {
    requiredField: string;
    licenseNumberRequired: string;
    invalidEmail: string;
    invalidNumeric: string;
    totalPercentMustEqual100: string;
  };
  validSamples: Record<string, string>;
  invalidSamples: Record<string, string>;
  splitAgentSamples: {
    agent1: SplitAgentData;
    agent2: SplitAgentData;
    agent3: SplitAgentData;
    editedAgent1Percent: string;
    invalidOverflowPercent: string;
    minimumPercent: string;
    zeroPercent: string;
    exact100SplitPercent: string;
  };
  splitAgentFields: Record<
    string,
    { suffix: string; label: string; defaultValue?: string }
  >;
  maxSplitAgents: number;
  agentAddressFields: Record<
    string,
    { fieldId: string; type: string; label: string }
  >;
  validAddressSamples: Record<string, string>;
  validAddressSamplesByState: Record<string, Record<string, string>>;
  agentAddressLabels: string[];
  tapdTraceabilityNote?: string;
  termLifeProduct: {
    product: string;
    productCode: string;
    template: string;
    templateCode: string;
    dashboardStatus: string;
  };
  termLifeUnavailableStates: string[];
  fields: Record<string, LicensingFieldDefinition>;
  flows: Record<LicensingFlowId, LicensingFlowProfile>;
  stateCodes: Record<string, string>;
  stateFlowMapping: Record<string, LicensingFlowId>;
}

/**
 * Resolves business state input to Licensing flow metadata.
 * Mapping lives in test data — not in step definitions.
 */
export class LicensingFlowResolver {
  private static readonly data =
    TestDataProvider.loadJson<LicensingTestData>('licensing.json');

  static getTestData(): LicensingTestData {
    return this.data;
  }

  static resolveFlow(stateName: string): LicensingFlowId {
    const normalized = stateName.trim();
    const flowId = this.data.stateFlowMapping[normalized];

    if (!flowId) {
      if (this.data.termLifeUnavailableStates.includes(normalized)) {
        throw new TestDataException(
          `Term Life is unavailable for state "${normalized}".`,
        );
      }

      throw new TestDataException(
        `No Licensing flow mapping found for state "${normalized}".`,
      );
    }

    return flowId;
  }

  static getFlowProfile(flowId: LicensingFlowId): LicensingFlowProfile {
    return this.data.flows[flowId];
  }

  static getStateCode(stateName: string): string {
    const normalized = stateName.trim();
    const stateCode = this.data.stateCodes[normalized];

    if (!stateCode) {
      throw new TestDataException(
        `No state code mapping found for state "${normalized}".`,
      );
    }

    return stateCode;
  }

  static buildTermLifeSelection(
    stateName: string,
  ): ApplicationCreationSelection {
    const normalized = stateName.trim();

    if (this.data.termLifeUnavailableStates.includes(normalized)) {
      throw new TestDataException(
        `Term Life is unavailable for state "${normalized}".`,
      );
    }

    return {
      state: normalized,
      stateCode: this.getStateCode(normalized),
      product: this.data.termLifeProduct.product,
      productCode: this.data.termLifeProduct.productCode,
      template: this.data.termLifeProduct.template,
      templateCode: this.data.termLifeProduct.templateCode,
      dashboardStatus: this.data.termLifeProduct.dashboardStatus,
    };
  }

  static getFlowReportLabel(flowId: LicensingFlowId): string {
    const profile = this.getFlowProfile(flowId);
    return `Licensing-${flowId} (representative: ${profile.representativeState})`;
  }
}
