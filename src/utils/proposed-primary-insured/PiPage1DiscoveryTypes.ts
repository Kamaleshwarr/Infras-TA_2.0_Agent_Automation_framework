import { LicensingFlowId } from '../licensing/LicensingFlowResolver';

export const PI_PAGE1_DISCOVERY_STATES = [
  'Alabama',
  'California',
  'Delaware',
  'Missouri',
  'Texas',
] as const;

export type PiPage1DiscoveryState = (typeof PI_PAGE1_DISCOVERY_STATES)[number];

export type PiPage1DiscoveryClassification =
  'A' | 'B' | 'C' | 'A (baseline)' | 'BLOCKED';

export interface PiPage1FieldSnapshot {
  type: string;
  fieldId: string;
  label: string | null;
  required: boolean;
  visible: boolean;
  containerTestId: string;
}

export interface PiPage1ReflexiveSnapshot {
  otherCountry: {
    initialVisible: boolean;
    afterCountryOther: boolean;
    afterCountryUsa: boolean;
  };
  mailingFields: {
    initialAddressVisible: boolean;
    afterMailingNo: {
      address: boolean;
      city: boolean;
      state: boolean;
      zip: boolean;
    };
    afterMailingYes: {
      address: boolean;
      city: boolean;
      state: boolean;
      zip: boolean;
    };
  };
}

export interface PiPage1StructureSnapshot {
  state: PiPage1DiscoveryState;
  licensingFlow: LicensingFlowId;
  status: 'success' | 'blocked';
  error?: string;
  screenshotPath?: string;
  pageHeading: string | null;
  pageIndicator: string | null;
  mailingQuestion: string | null;
  questionGroups: string[];
  headings: Array<{ tag: string; text: string; testId: string | null }>;
  navSections: Array<{ testId: string | null; text: string }>;
  fields: PiPage1FieldSnapshot[];
  fieldOrder: string[];
  nextButton: {
    testId: string | null;
    visible: boolean;
    text: string;
    disabled: boolean;
  };
  reflexive: PiPage1ReflexiveSnapshot | null;
}

export interface PiPage1DiscoveryDifference {
  state: string;
  area: string;
  fieldOrGroup: string;
  alabamaBehavior: string;
  observedBehavior: string;
  automationImpact: string;
}

export interface PiPage1DiscoveryStateResult {
  state: PiPage1DiscoveryState;
  licensingFlow: LicensingFlowId;
  classification: PiPage1DiscoveryClassification;
  actualDifferenceVsAlabama: string;
  automationImpact: string;
  snapshot: PiPage1StructureSnapshot | null;
  differences: PiPage1DiscoveryDifference[];
}

export interface PiPage1DiscoveryResult {
  generatedAt: string;
  baselineState: PiPage1DiscoveryState;
  stateResults: PiPage1DiscoveryStateResult[];
  architectureRecommendation: string;
}
