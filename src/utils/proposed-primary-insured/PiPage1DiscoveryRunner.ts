import { Page } from 'playwright';
import { ApplicationCreationPage } from '../../pages/ApplicationCreationPage';
import { LicensingPage } from '../../pages/LicensingPage';
import { ProposedPrimaryInsuredPage1Page } from '../../pages/ProposedPrimaryInsuredPage1Page';
import { LicensingFlowResolver } from '../licensing/LicensingFlowResolver';
import { PiPage1DiscoveryCollector } from './PiPage1DiscoveryCollector';
import { PiPage1DiscoveryComparator } from './PiPage1DiscoveryComparator';
import {
  PI_PAGE1_DISCOVERY_STATES,
  PiPage1DiscoveryResult,
  PiPage1DiscoveryState,
  PiPage1StructureSnapshot,
} from './PiPage1DiscoveryTypes';

/**
 * Orchestrates the temporary PI Page 1 discovery pass across representative states.
 * Reuses existing login/application/licensing/page-object flows without regression validations.
 */
export class PiPage1DiscoveryRunner {
  constructor(
    private readonly page: Page,
    private readonly applicationCreationPage: ApplicationCreationPage,
    private readonly licensingPage: LicensingPage,
    private readonly piPage: ProposedPrimaryInsuredPage1Page,
  ) {}

  async runRepresentativeStates(): Promise<PiPage1DiscoveryResult> {
    const snapshots: PiPage1StructureSnapshot[] = [];

    for (const stateName of PI_PAGE1_DISCOVERY_STATES) {
      snapshots.push(await this.inspectState(stateName));
    }

    return PiPage1DiscoveryComparator.analyze(snapshots);
  }

  private async inspectState(
    stateName: PiPage1DiscoveryState,
  ): Promise<PiPage1StructureSnapshot> {
    const licensingFlow = LicensingFlowResolver.resolveFlow(stateName);
    const profile = LicensingFlowResolver.getFlowProfile(licensingFlow);
    const stateCode = LicensingFlowResolver.getStateCode(stateName);

    try {
      if (await this.canReturnToApplications()) {
        await this.licensingPage.returnToApplications();
      }

      const selection = LicensingFlowResolver.buildTermLifeSelection(stateName);
      await this.applicationCreationPage.openCreateApplicationDialog();
      await this.applicationCreationPage.selectApplicationCombination(
        selection,
      );
      await this.applicationCreationPage.startApplication();
      await this.licensingPage.waitForLicensingModuleReady();
      await this.licensingPage.fillCompleteValidLicensing(
        profile.licenseNumberPresent,
        profile.agentAddressPresent,
        stateName,
      );
      await this.licensingPage.clickPrimaryNext();
      this.piPage.configureForState(stateName);
      await this.piPage.waitForReady();

      const collector = new PiPage1DiscoveryCollector(this.page, this.piPage);

      return await collector.capture(stateName, licensingFlow, stateCode);
    } catch (error) {
      return {
        state: stateName,
        licensingFlow,
        status: 'blocked',
        error: error instanceof Error ? error.message : String(error),
        pageHeading: null,
        pageIndicator: null,
        mailingQuestion: null,
        questionGroups: [],
        headings: [],
        navSections: [],
        fields: [],
        fieldOrder: [],
        nextButton: {
          testId: null,
          visible: false,
          text: '',
          disabled: false,
        },
        reflexive: null,
      };
    }
  }

  private async canReturnToApplications(): Promise<boolean> {
    return this.page
      .getByTestId('agp-form-button-back')
      .isVisible()
      .catch(() => false);
  }
}
