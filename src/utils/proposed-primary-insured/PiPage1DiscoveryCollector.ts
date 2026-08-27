import * as path from 'path';
import { Page } from 'playwright';
import { LicensingFlowId } from '../licensing/LicensingFlowResolver';
import { ProposedPrimaryInsuredPage1Page } from '../../pages/ProposedPrimaryInsuredPage1Page';
import {
  PiPage1DiscoveryState,
  PiPage1FieldSnapshot,
  PiPage1ReflexiveSnapshot,
  PiPage1StructureSnapshot,
} from './PiPage1DiscoveryTypes';

/**
 * Captures PI Page 1 DOM structure for flow comparison.
 * Does not invoke regression validations or the validation matrix.
 */
export class PiPage1DiscoveryCollector {
  constructor(
    private readonly page: Page,
    private readonly piPage: ProposedPrimaryInsuredPage1Page,
  ) {}

  async capture(
    state: PiPage1DiscoveryState,
    licensingFlow: LicensingFlowId,
    stateCode: string,
  ): Promise<PiPage1StructureSnapshot> {
    const staticStructure = await this.captureStaticStructure();
    const reflexive = await this.captureReflexiveBehavior();
    const screenshotPath = path.join(
      process.cwd(),
      'src/reports',
      `pi-page1-discovery-${stateCode}.png`,
    );
    await this.page.screenshot({ path: screenshotPath, fullPage: true });

    return {
      state,
      licensingFlow,
      status: 'success',
      screenshotPath,
      ...staticStructure,
      reflexive,
    };
  }

  private async captureStaticStructure(): Promise<
    Omit<
      PiPage1StructureSnapshot,
      'state' | 'licensingFlow' | 'status' | 'reflexive' | 'screenshotPath'
    >
  > {
    const locators = this.piPage.getLocators();
    const pageHeading =
      (await locators.moduleHeading.textContent())?.trim() ?? null;
    const pageIndicator =
      (await locators.page1Indicator.textContent())?.trim() ?? null;
    const mailingQuestion =
      (await locators.mailingSameQuestion.textContent())?.trim() ?? null;

    const questionGroups: string[] = [];
    if (await locators.personalInformationGroup.isVisible()) {
      questionGroups.push(
        (await locators.personalInformationGroup.textContent())?.trim() ?? '',
      );
    }
    if (await locators.physicalAddressGroup.isVisible()) {
      questionGroups.push(
        (await locators.physicalAddressGroup.textContent())?.trim() ?? '',
      );
    }
    if (mailingQuestion) {
      questionGroups.push(mailingQuestion);
    }

    const domCapture = await this.captureDomStructure(locators);

    return {
      pageHeading,
      pageIndicator,
      mailingQuestion,
      questionGroups: questionGroups.filter(Boolean),
      ...domCapture,
    };
  }

  private async captureDomStructure(
    locators: ReturnType<ProposedPrimaryInsuredPage1Page['getLocators']>,
  ): Promise<{
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
  }> {
    const { fields, fieldOrder } = await this.captureFormFields();
    const headings = await this.captureHeadings();
    const navSections = await this.captureNavSections();
    const next = locators.nextButton;

    return {
      headings,
      navSections,
      fields,
      fieldOrder,
      nextButton: {
        testId: await next.getAttribute('data-testid'),
        visible: await next.isVisible().catch(() => false),
        text: (await next.textContent())?.trim() ?? '',
        disabled: await next.isDisabled().catch(() => false),
      },
    };
  }

  private async captureFormFields(): Promise<{
    fields: PiPage1FieldSnapshot[];
    fieldOrder: string[];
  }> {
    const candidates = this.page.locator('[data-testid^="agp-form-field-"]');
    const count = await candidates.count();
    const fieldMap = new Map<string, PiPage1FieldSnapshot>();
    const fieldOrder: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const candidate = candidates.nth(index);
      const testId = await candidate.getAttribute('data-testid');
      if (!testId) continue;

      const match = testId.match(
        /^agp-form-field-(text|number|date|email|dropdown|radiobutton|radioswitch|phonenumber)-([^-]+)$/,
      );
      if (!match) continue;

      const [, type, fieldId] = match;
      const key = `${type}:${fieldId}`;
      if (fieldMap.has(key)) continue;

      const container = this.page.getByTestId(
        `agp-form-field-${type}-${fieldId}`,
      );
      const labelLocator = container.locator('[data-testid$="-label"]').first();
      let label: string | null = null;
      if ((await labelLocator.count()) > 0) {
        label =
          (await labelLocator.textContent())?.replace(/\s+/g, ' ').trim() ??
          null;
      }

      const required =
        /\*/.test(label || '') ||
        (await container.locator('[aria-required="true"]').count()) > 0 ||
        (await container.locator('[required]').count()) > 0;
      const visible = await container.isVisible().catch(() => false);

      fieldMap.set(key, {
        type,
        fieldId,
        label: label?.replace(/\*+$/, '').trim() || null,
        required: Boolean(required),
        visible,
        containerTestId: `agp-form-field-${type}-${fieldId}`,
      });
      fieldOrder.push(key);
    }

    return {
      fields: Array.from(fieldMap.values()),
      fieldOrder,
    };
  }

  private async captureHeadings(): Promise<
    Array<{ tag: string; text: string; testId: string | null }>
  > {
    const headingLocator = this.page.locator('h1,h2,h3,h4,h5,h6');
    const count = await headingLocator.count();
    const headings: Array<{
      tag: string;
      text: string;
      testId: string | null;
    }> = [];

    for (let index = 0; index < count; index += 1) {
      const heading = headingLocator.nth(index);
      if (!(await heading.isVisible().catch(() => false))) continue;

      headings.push({
        tag: await heading.evaluate((node) => node.tagName),
        text: (await heading.textContent())?.replace(/\s+/g, ' ').trim() ?? '',
        testId: await heading.getAttribute('data-testid'),
      });
    }

    return headings;
  }

  private async captureNavSections(): Promise<
    Array<{ testId: string | null; text: string }>
  > {
    const navLocator = this.page.locator(
      '[data-testid*="proposed-primary-insured"]',
    );
    const count = await navLocator.count();
    const navSections: Array<{ testId: string | null; text: string }> = [];

    for (let index = 0; index < count; index += 1) {
      const navItem = navLocator.nth(index);
      if (!(await navItem.isVisible().catch(() => false))) continue;

      navSections.push({
        testId: await navItem.getAttribute('data-testid'),
        text:
          (await navItem.textContent())
            ?.replace(/\s+/g, ' ')
            .trim()
            .slice(0, 200) ?? '',
      });
    }

    return navSections;
  }

  private async captureReflexiveBehavior(): Promise<PiPage1ReflexiveSnapshot> {
    const data = this.piPage.getData();
    const fields = data.fields;
    const locators = this.piPage.getLocators();

    const otherCountryInitial = await this.piPage
      .input(fields.otherCountry)
      .isVisible()
      .catch(() => false);
    const mailingInitial = await this.piPage
      .input(fields.mailingAddress)
      .isVisible()
      .catch(() => false);

    await this.piPage.selectCountry('other');
    const otherCountryAfterOther = await this.piPage
      .input(fields.otherCountry)
      .isVisible();

    await this.piPage.selectCountry('usa');
    const otherCountryAfterUsa = await this.piPage
      .input(fields.otherCountry)
      .isVisible()
      .catch(() => false);

    await this.piPage.selectMailingSameAsPhysical('no');
    const afterMailingNo = {
      address: await this.piPage.input(fields.mailingAddress).isVisible(),
      city: await this.piPage.input(fields.mailingCity).isVisible(),
      state: await locators
        .dropdownTrigger(fields.mailingStateTerritory.fieldId)
        .isVisible(),
      zip: await this.piPage.input(fields.mailingZipCode).isVisible(),
    };

    await this.piPage.selectMailingSameAsPhysical('yes');
    const afterMailingYes = {
      address: await this.piPage
        .input(fields.mailingAddress)
        .isVisible()
        .catch(() => false),
      city: await this.piPage
        .input(fields.mailingCity)
        .isVisible()
        .catch(() => false),
      state: await locators
        .dropdownTrigger(fields.mailingStateTerritory.fieldId)
        .isVisible()
        .catch(() => false),
      zip: await this.piPage
        .input(fields.mailingZipCode)
        .isVisible()
        .catch(() => false),
    };

    return {
      otherCountry: {
        initialVisible: otherCountryInitial,
        afterCountryOther: otherCountryAfterOther,
        afterCountryUsa: otherCountryAfterUsa,
      },
      mailingFields: {
        initialAddressVisible: mailingInitial,
        afterMailingNo,
        afterMailingYes,
      },
    };
  }
}
