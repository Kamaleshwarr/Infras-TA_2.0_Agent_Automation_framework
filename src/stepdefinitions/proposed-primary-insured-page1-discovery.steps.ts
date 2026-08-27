import { Before, Then, When, setDefaultTimeout } from '@cucumber/cucumber';
import { CustomWorld } from '../hooks/world';
import { PiPage1DiscoveryReporter } from '../utils/proposed-primary-insured/PiPage1DiscoveryReporter';
import { PiPage1DiscoveryResult } from '../utils/proposed-primary-insured/PiPage1DiscoveryTypes';
import { PiPage1DiscoveryRunner } from '../utils/proposed-primary-insured/PiPage1DiscoveryRunner';

const PI_PAGE1_DISCOVERY_TIMEOUT_MS = 1_200_000;

let discoveryResult: PiPage1DiscoveryResult | undefined;

Before({ tags: '@discovery' }, function () {
  setDefaultTimeout(PI_PAGE1_DISCOVERY_TIMEOUT_MS);
});

When(
  'the PI Page 1 discovery pass runs for the representative states',
  { timeout: PI_PAGE1_DISCOVERY_TIMEOUT_MS },
  async function (this: CustomWorld) {
    const runner = new PiPage1DiscoveryRunner(
      this.page,
      this.applicationCreationPage,
      this.licensingPage,
      this.proposedPrimaryInsuredPage1Page,
    );
    discoveryResult = await runner.runRepresentativeStates();
  },
);

Then(
  'the PI Page 1 discovery report should be written',
  { timeout: PI_PAGE1_DISCOVERY_TIMEOUT_MS },
  async function (this: CustomWorld) {
    if (!discoveryResult) {
      throw new Error('PI Page 1 discovery did not produce a result.');
    }

    const report = PiPage1DiscoveryReporter.write(discoveryResult);
    await this.attach(report.summary, 'text/plain');
    await this.attach(
      JSON.stringify(discoveryResult, null, 2),
      'application/json',
    );

    const alabamaBlocked = discoveryResult.stateResults.some(
      (stateResult) =>
        stateResult.state === 'Alabama' &&
        stateResult.classification === 'BLOCKED',
    );
    if (alabamaBlocked) {
      throw new Error(
        'PI Page 1 discovery failed to capture the Alabama baseline. Review the attached report and JSON artifact.',
      );
    }

    const blocked = discoveryResult.stateResults.filter(
      (stateResult) => stateResult.classification === 'BLOCKED',
    );
    if (blocked.length > 0) {
      const details = blocked
        .map(
          (stateResult) =>
            `${stateResult.state}: ${stateResult.actualDifferenceVsAlabama}`,
        )
        .join('\n');
      throw new Error(
        `PI Page 1 discovery completed with blocked state(s). Report written to ${report.markdownPath}.\n${details}`,
      );
    }
  },
);
