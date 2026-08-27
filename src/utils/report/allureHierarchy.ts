import * as allure from 'allure-js-commons';

/** Top-level module names shown as parentSuite in Allure Suites view. */
export const ALLURE_MODULES = {
  login: 'Login',
  applicationCreation: 'Application Creation',
  licensing: 'Licensing',
  proposedPrimaryInsured: 'Proposed Primary Insured',
} as const;

export interface AllureSuiteHierarchy {
  parentSuite: string;
  suite: string;
  subSuite?: string;
}

const LOGIN_SUITES = {
  successfulLogin: 'Successful Login',
  loginValidation: 'Login Validation',
  forgotPassword: 'Forgot Password',
} as const;

const APPLICATION_CREATION_SUITES = {
  dialogNavigation: 'Dialog / Navigation',
  stateSelection: 'State Selection',
  productSelection: 'Product Selection',
  stateProductAvailability: 'State/Product Availability',
  applicationSubmission: 'Application Submission',
} as const;

const PI_PAGE1_SUITES = {
  page1: 'Page 1',
  discovery: 'Discovery',
} as const;

const LICENSING_FLOW_SUITE_BY_TAG: Record<string, string> = {
  'flow-a': 'Flow A',
  'flow-b': 'Flow B',
  'flow-c': 'Flow C',
  'flow-d': 'Flow D',
};

const APPLICATION_CREATION_SUITE_BY_SCENARIO: Record<string, string> = {
  'Create New Application dialog can be opened':
    APPLICATION_CREATION_SUITES.dialogNavigation,
  'Create New Application button is available from Applications page':
    APPLICATION_CREATION_SUITES.dialogNavigation,
  'Cancel closes Create New Application dialog':
    APPLICATION_CREATION_SUITES.dialogNavigation,
  'Close closes Create New Application dialog':
    APPLICATION_CREATION_SUITES.dialogNavigation,
  'Product is disabled before state selection':
    APPLICATION_CREATION_SUITES.stateSelection,
  'State selection enables Product': APPLICATION_CREATION_SUITES.stateSelection,
  'State dropdown displays the expected number of available locations':
    APPLICATION_CREATION_SUITES.stateSelection,
  'State dropdown contains all expected available locations':
    APPLICATION_CREATION_SUITES.stateSelection,
  'New York is not available in State dropdown':
    APPLICATION_CREATION_SUITES.stateSelection,
  'U.S. Virgin Islands is not available in State dropdown':
    APPLICATION_CREATION_SUITES.stateSelection,
  'Template is hidden before product selection':
    APPLICATION_CREATION_SUITES.productSelection,
  'Term Life selection populates Template':
    APPLICATION_CREATION_SUITES.productSelection,
  'Start Application is disabled before required selections':
    APPLICATION_CREATION_SUITES.productSelection,
  'IUL product is available for a regular supported state':
    APPLICATION_CREATION_SUITES.stateProductAvailability,
  'Puerto Rico only offers IUL':
    APPLICATION_CREATION_SUITES.stateProductAvailability,
  'Guam only offers IUL': APPLICATION_CREATION_SUITES.stateProductAvailability,
  'IUL template is consistent across supported locations':
    APPLICATION_CREATION_SUITES.stateProductAvailability,
  'Alabama Term Life application can be created':
    APPLICATION_CREATION_SUITES.applicationSubmission,
  'Successful application opens the Application Form shell':
    APPLICATION_CREATION_SUITES.applicationSubmission,
  'Dashboard application record is created after successful application creation':
    APPLICATION_CREATION_SUITES.applicationSubmission,
  'Puerto Rico Indexed Universal Life application can be created':
    APPLICATION_CREATION_SUITES.applicationSubmission,
  'Guam Indexed Universal Life application can be created':
    APPLICATION_CREATION_SUITES.applicationSubmission,
};

function normalizeTagNames(tags: readonly { name: string }[]): string[] {
  return tags.map((tag) => tag.name.replace(/^@/, ''));
}

function hasTag(tagNames: string[], tagName: string): boolean {
  return tagNames.includes(tagName);
}

function resolveLoginSuite(scenarioName: string): AllureSuiteHierarchy {
  if (scenarioName === 'Successful login with valid credentials') {
    return {
      parentSuite: ALLURE_MODULES.login,
      suite: LOGIN_SUITES.successfulLogin,
    };
  }

  if (scenarioName === 'Login validation rejects invalid input') {
    return {
      parentSuite: ALLURE_MODULES.login,
      suite: LOGIN_SUITES.loginValidation,
    };
  }

  if (/forgot password/i.test(scenarioName)) {
    return {
      parentSuite: ALLURE_MODULES.login,
      suite: LOGIN_SUITES.forgotPassword,
    };
  }

  return {
    parentSuite: ALLURE_MODULES.login,
    suite: scenarioName,
  };
}

function resolveApplicationCreationSuite(
  scenarioName: string,
): AllureSuiteHierarchy {
  return {
    parentSuite: ALLURE_MODULES.applicationCreation,
    suite: APPLICATION_CREATION_SUITE_BY_SCENARIO[scenarioName] ?? scenarioName,
  };
}

function resolveLicensingSuite(tagNames: string[]): AllureSuiteHierarchy {
  for (const [flowTag, suiteName] of Object.entries(
    LICENSING_FLOW_SUITE_BY_TAG,
  )) {
    if (hasTag(tagNames, flowTag)) {
      return {
        parentSuite: ALLURE_MODULES.licensing,
        suite: suiteName,
      };
    }
  }

  return {
    parentSuite: ALLURE_MODULES.licensing,
    suite: 'Licensing Coverage',
  };
}

function resolveProposedPrimaryInsuredSuite(
  tagNames: string[],
): AllureSuiteHierarchy {
  if (hasTag(tagNames, 'discovery')) {
    return {
      parentSuite: ALLURE_MODULES.proposedPrimaryInsured,
      suite: PI_PAGE1_SUITES.discovery,
    };
  }

  return {
    parentSuite: ALLURE_MODULES.proposedPrimaryInsured,
    suite: PI_PAGE1_SUITES.page1,
  };
}

/**
 * Maps Cucumber scenario metadata to Allure parentSuite / suite / subSuite labels.
 * Used only for report organization; does not affect test execution.
 */
export function resolveAllureSuiteHierarchy(
  scenarioName: string,
  tags: readonly { name: string }[],
): AllureSuiteHierarchy | null {
  const tagNames = normalizeTagNames(tags);

  if (hasTag(tagNames, 'proposed-primary-insured-page1')) {
    return resolveProposedPrimaryInsuredSuite(tagNames);
  }

  if (hasTag(tagNames, 'discovery')) {
    return resolveProposedPrimaryInsuredSuite(tagNames);
  }

  if (hasTag(tagNames, 'licensing')) {
    return resolveLicensingSuite(tagNames);
  }

  if (hasTag(tagNames, 'create-application')) {
    return resolveApplicationCreationSuite(scenarioName);
  }

  if (hasTag(tagNames, 'login')) {
    return resolveLoginSuite(scenarioName);
  }

  return null;
}

/** Applies the selected PI Page 1 application state as subSuite after the Given step binds it. */
export async function applyPiPage1SelectedStateSubSuite(
  stateName: string,
): Promise<void> {
  await allure.subSuite(stateName);
}

/** Writes parentSuite / suite / optional subSuite labels for the active Cucumber scenario. */
export async function applyAllureSuiteHierarchy(
  hierarchy: AllureSuiteHierarchy,
): Promise<void> {
  await allure.parentSuite(hierarchy.parentSuite);
  await allure.suite(hierarchy.suite);

  if (hierarchy.subSuite) {
    await allure.subSuite(hierarchy.subSuite);
  }
}

let pendingHierarchy: AllureSuiteHierarchy | null = null;
let hierarchyApplied = false;

/** Stores hierarchy for the active scenario. Called from Before hooks only. */
export function setPendingAllureHierarchy(
  hierarchy: AllureSuiteHierarchy | null,
): void {
  pendingHierarchy = hierarchy;
  hierarchyApplied = false;
}

/** Clears pending hierarchy after the scenario completes. */
export function clearPendingAllureHierarchy(): void {
  pendingHierarchy = null;
  hierarchyApplied = false;
}

/**
 * Applies pending suite labels during a Gherkin step (not a Before/After hook).
 * allure-cucumberjs only merges label metadata into the test result while steps run.
 */
export async function applyPendingAllureHierarchyOnce(): Promise<void> {
  if (hierarchyApplied || !pendingHierarchy) {
    return;
  }

  hierarchyApplied = true;
  await applyAllureSuiteHierarchy(pendingHierarchy);
}
