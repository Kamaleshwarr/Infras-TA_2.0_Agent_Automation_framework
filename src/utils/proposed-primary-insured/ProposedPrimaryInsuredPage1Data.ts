import { TestDataException } from '../../exceptions';
import { TestDataProvider } from '../../testdata/providers/TestDataProvider';

export interface PiPage1Field {
  fieldId: string;
  type: 'text' | 'date' | 'number' | 'dropdown' | 'radiobutton';
  label: string;
}

export interface PiPage1ValidSamples {
  legalFirstName: string;
  middleName: string;
  legalLastName: string;
  dateOfBirth: string;
  physicalAddress: string;
  apartmentUnit: string;
  city: string;
  state: string;
  zipCode: string;
  mailingAddress: string;
  mailingCity: string;
  mailingState: string;
  mailingZipCode: string;
}

interface PiPage1SharedTestData {
  fields: ProposedPrimaryInsuredPage1TestData['fields'];
  country: ProposedPrimaryInsuredPage1TestData['country'];
  suffixOptions: string[];
  validSamplesByState: Record<string, PiPage1ValidSamples>;
}

export interface ProposedPrimaryInsuredPage1TestData {
  applicationState: string;
  fields: {
    legalFirstName: PiPage1Field;
    middleName: PiPage1Field;
    legalLastName: PiPage1Field;
    suffix: PiPage1Field;
    dateOfBirth: PiPage1Field;
    age: PiPage1Field;
    country: PiPage1Field;
    otherCountry: PiPage1Field;
    physicalAddress: PiPage1Field;
    apartmentUnit: PiPage1Field;
    city: PiPage1Field;
    usStateTerritory: PiPage1Field;
    zipCode: PiPage1Field;
    mailingSameAsPhysical: PiPage1Field;
    mailingAddress: PiPage1Field;
    mailingCity: PiPage1Field;
    mailingStateTerritory: PiPage1Field;
    mailingZipCode: PiPage1Field;
  };
  valid: PiPage1ValidSamples;
  country: {
    usa: string;
    canada: string;
    other: string;
  };
  suffixOptions: string[];
}

export class ProposedPrimaryInsuredPage1Data {
  private static shared: PiPage1SharedTestData | null = null;

  private static loadShared(): PiPage1SharedTestData {
    if (!this.shared) {
      this.shared = TestDataProvider.loadJson<PiPage1SharedTestData>(
        'proposed-primary-insured-page1.json',
      );
    }
    return this.shared;
  }

  static getValidSamples(stateName: string): PiPage1ValidSamples {
    const normalized = stateName.trim();
    const samples = this.loadShared().validSamplesByState[normalized];
    if (!samples) {
      throw new TestDataException(
        `No Proposed Primary Insured Page 1 valid samples found for state "${normalized}". Add an entry to validSamplesByState in proposed-primary-insured-page1.json.`,
      );
    }
    return samples;
  }

  static buildForState(stateName: string): ProposedPrimaryInsuredPage1TestData {
    const normalized = stateName.trim();
    const shared = this.loadShared();

    return {
      applicationState: normalized,
      fields: shared.fields,
      country: shared.country,
      suffixOptions: shared.suffixOptions,
      valid: this.getValidSamples(normalized),
    };
  }
}
