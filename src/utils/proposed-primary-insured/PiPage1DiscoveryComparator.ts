import {
  PiPage1DiscoveryClassification,
  PiPage1DiscoveryDifference,
  PiPage1DiscoveryResult,
  PiPage1DiscoveryStateResult,
  PiPage1FieldSnapshot,
  PiPage1StructureSnapshot,
} from './PiPage1DiscoveryTypes';

function fieldKey(field: PiPage1FieldSnapshot): string {
  return `${field.type}:${field.fieldId}`;
}

function describeField(field: PiPage1FieldSnapshot | null): string {
  if (!field) return 'Not present';
  return `${field.label ?? 'Unlabeled'} (${field.type}:${field.fieldId}, required=${field.required}, visible=${field.visible})`;
}

function describeReflexive(snapshot: PiPage1StructureSnapshot): string {
  if (!snapshot.reflexive) return 'Not captured';
  return JSON.stringify(snapshot.reflexive);
}

/**
 * Compares captured PI Page 1 structures against the Alabama runtime baseline.
 */
export class PiPage1DiscoveryComparator {
  static analyze(
    snapshots: PiPage1StructureSnapshot[],
  ): PiPage1DiscoveryResult {
    const baseline = snapshots.find(
      (snapshot) =>
        snapshot.state === 'Alabama' && snapshot.status === 'success',
    );
    const stateResults: PiPage1DiscoveryStateResult[] = snapshots.map(
      (snapshot) => this.buildStateResult(snapshot, baseline ?? null),
    );

    return {
      generatedAt: new Date().toISOString(),
      baselineState: 'Alabama',
      stateResults,
      architectureRecommendation: this.recommendArchitecture(stateResults),
    };
  }

  private static buildStateResult(
    snapshot: PiPage1StructureSnapshot,
    baseline: PiPage1StructureSnapshot | null,
  ): PiPage1DiscoveryStateResult {
    if (snapshot.status === 'blocked') {
      return {
        state: snapshot.state,
        licensingFlow: snapshot.licensingFlow,
        classification: 'BLOCKED',
        actualDifferenceVsAlabama: snapshot.error ?? 'PI Page 1 not reached',
        automationImpact:
          'Complete discovery for this state before assessing reuse',
        snapshot: null,
        differences: [
          {
            state: snapshot.state,
            area: 'execution',
            fieldOrGroup: 'PI Page 1 entry',
            alabamaBehavior: 'Reachable after Licensing Next',
            observedBehavior:
              snapshot.error ?? 'Blocked before PI Page 1 inspection',
            automationImpact: 'Record blocker; do not infer Page 1 differences',
          },
        ],
      };
    }

    if (snapshot.state === 'Alabama') {
      return {
        state: snapshot.state,
        licensingFlow: snapshot.licensingFlow,
        classification: 'A (baseline)',
        actualDifferenceVsAlabama: '—',
        automationImpact: 'Reference implementation for PI Page 1 automation',
        snapshot,
        differences: [],
      };
    }

    if (!baseline) {
      return {
        state: snapshot.state,
        licensingFlow: snapshot.licensingFlow,
        classification: 'BLOCKED',
        actualDifferenceVsAlabama:
          'Alabama baseline was not captured in this run',
        automationImpact:
          'Re-run discovery with Alabama completing successfully first',
        snapshot,
        differences: [],
      };
    }

    const differences = this.compareSnapshots(baseline, snapshot);
    const classification = this.classify(differences);
    const actualDifference =
      differences.length === 0
        ? 'Observed PI Page 1 matches the Alabama baseline for the inspected flow.'
        : differences
            .map(
              (diff) =>
                `${diff.fieldOrGroup}: Alabama=${diff.alabamaBehavior}; ${snapshot.state}=${diff.observedBehavior}`,
            )
            .join(' | ');

    return {
      state: snapshot.state,
      licensingFlow: snapshot.licensingFlow,
      classification,
      actualDifferenceVsAlabama: actualDifference,
      automationImpact: this.automationImpact(classification, differences),
      snapshot,
      differences,
    };
  }

  private static compareSnapshots(
    baseline: PiPage1StructureSnapshot,
    candidate: PiPage1StructureSnapshot,
  ): PiPage1DiscoveryDifference[] {
    const differences: PiPage1DiscoveryDifference[] = [];
    const baseFields = new Map(
      baseline.fields.map((field) => [fieldKey(field), field]),
    );
    const candidateFields = new Map(
      candidate.fields.map((field) => [fieldKey(field), field]),
    );

    for (const [key, baseField] of baseFields) {
      const candidateField = candidateFields.get(key);
      if (!candidateField) {
        differences.push({
          state: candidate.state,
          area: 'fields',
          fieldOrGroup: key,
          alabamaBehavior: describeField(baseField),
          observedBehavior: 'Missing field/container',
          automationImpact:
            'Locator or page-object coverage may need a state-specific branch',
        });
        continue;
      }

      if (baseField.label !== candidateField.label) {
        differences.push({
          state: candidate.state,
          area: 'fields',
          fieldOrGroup: key,
          alabamaBehavior: baseField.label ?? 'No label',
          observedBehavior: candidateField.label ?? 'No label',
          automationImpact:
            'Label-based assertions or data may need adjustment',
        });
      }

      if (baseField.type !== candidateField.type) {
        differences.push({
          state: candidate.state,
          area: 'fields',
          fieldOrGroup: key,
          alabamaBehavior: baseField.type,
          observedBehavior: candidateField.type,
          automationImpact: 'Control-type handling may differ for this state',
        });
      }

      if (baseField.required !== candidateField.required) {
        differences.push({
          state: candidate.state,
          area: 'required_rules',
          fieldOrGroup: key,
          alabamaBehavior: String(baseField.required),
          observedBehavior: String(candidateField.required),
          automationImpact: 'Required-field validation behavior may differ',
        });
      }

      if (baseField.visible !== candidateField.visible) {
        differences.push({
          state: candidate.state,
          area: 'initial_visibility',
          fieldOrGroup: key,
          alabamaBehavior: String(baseField.visible),
          observedBehavior: String(candidateField.visible),
          automationImpact: 'Initial Page 1 layout differs on load',
        });
      }
    }

    for (const [key, candidateField] of candidateFields) {
      if (!baseFields.has(key)) {
        differences.push({
          state: candidate.state,
          area: 'fields',
          fieldOrGroup: key,
          alabamaBehavior: 'Not present in Alabama baseline',
          observedBehavior: describeField(candidateField),
          automationImpact:
            'Additional field may require new automation coverage',
        });
      }
    }

    if (baseline.fieldOrder.join('|') !== candidate.fieldOrder.join('|')) {
      differences.push({
        state: candidate.state,
        area: 'field_order',
        fieldOrGroup: 'DOM field order',
        alabamaBehavior: baseline.fieldOrder.join(' → '),
        observedBehavior: candidate.fieldOrder.join(' → '),
        automationImpact:
          'Field order differs; usually low impact unless coupled to navigation',
      });
    }

    const baseNav = baseline.navSections
      .map((section) => section.testId)
      .filter(Boolean)
      .sort()
      .join('|');
    const candidateNav = candidate.navSections
      .map((section) => section.testId)
      .filter(Boolean)
      .sort()
      .join('|');
    if (baseNav !== candidateNav) {
      differences.push({
        state: candidate.state,
        area: 'navigation',
        fieldOrGroup: 'Left navigation test IDs',
        alabamaBehavior: baseNav || 'None observed',
        observedBehavior: candidateNav || 'None observed',
        automationImpact:
          'Navigation locators may need state-specific handling',
      });
    }

    const baseGroups = baseline.questionGroups.join('|');
    const candidateGroups = candidate.questionGroups.join('|');
    if (baseGroups !== candidateGroups) {
      differences.push({
        state: candidate.state,
        area: 'page_structure',
        fieldOrGroup: 'Question groups',
        alabamaBehavior: baseGroups || 'None observed',
        observedBehavior: candidateGroups || 'None observed',
        automationImpact: 'Page grouping differs; review structure assertions',
      });
    }

    if (describeReflexive(baseline) !== describeReflexive(candidate)) {
      differences.push({
        state: candidate.state,
        area: 'reflexive_behavior',
        fieldOrGroup: 'Country / mailing reflexive groups',
        alabamaBehavior: describeReflexive(baseline),
        observedBehavior: describeReflexive(candidate),
        automationImpact:
          'Conditional show/hide logic may require state-specific branches',
      });
    }

    if (
      baseline.nextButton.testId !== candidate.nextButton.testId ||
      baseline.nextButton.visible !== candidate.nextButton.visible
    ) {
      differences.push({
        state: candidate.state,
        area: 'navigation',
        fieldOrGroup: 'Next button',
        alabamaBehavior: `${baseline.nextButton.testId ?? 'none'} visible=${baseline.nextButton.visible}`,
        observedBehavior: `${candidate.nextButton.testId ?? 'none'} visible=${candidate.nextButton.visible}`,
        automationImpact: 'Navigation control differs',
      });
    }

    return differences;
  }

  private static classify(
    differences: PiPage1DiscoveryDifference[],
  ): PiPage1DiscoveryClassification {
    if (differences.length === 0) {
      return 'A';
    }

    const structuralAreas = new Set([
      'fields',
      'required_rules',
      'initial_visibility',
      'reflexive_behavior',
      'navigation',
      'field_order',
      'page_structure',
    ]);
    const hasStructuralDiff = differences.some((diff) =>
      structuralAreas.has(diff.area),
    );

    if (!hasStructuralDiff) {
      return 'B';
    }

    const onlyFieldOrder = differences.every(
      (diff) => diff.area === 'field_order',
    );
    if (onlyFieldOrder) {
      return 'B';
    }

    return 'C';
  }

  private static automationImpact(
    classification: PiPage1DiscoveryClassification,
    differences: PiPage1DiscoveryDifference[],
  ): string {
    if (classification === 'A') {
      return 'Reuse Alabama PI Page 1 automation with state-specific application/test data only';
    }
    if (classification === 'B') {
      return 'Reuse core PI Page 1 automation; review noted data or ordering differences only';
    }
    if (classification === 'C') {
      return differences
        .map((diff) => diff.automationImpact)
        .filter(Boolean)
        .join('; ');
    }
    return 'Blocked — no automation decision until discovery completes';
  }

  private static recommendArchitecture(
    stateResults: PiPage1DiscoveryStateResult[],
  ): string {
    const comparable = stateResults.filter(
      (result) =>
        result.classification !== 'BLOCKED' && result.state !== 'Alabama',
    );
    if (comparable.length === 0) {
      return 'Provisional — complete discovery runs before choosing Option 1, 2, or 3.';
    }

    const allAorB = comparable.every(
      (result) =>
        result.classification === 'A' || result.classification === 'B',
    );
    const anyC = comparable.some((result) => result.classification === 'C');

    if (allAorB && !anyC) {
      return 'Option 1 — one common PI Page 1 automation flow with state-specific data only.';
    }
    if (anyC) {
      return 'Option 2 or 3 — review proven structural differences; prefer Option 2 with small conditionals unless a state requires a genuinely separate flow.';
    }

    return 'Option 2 — one common PI Page 1 flow with targeted conditionals for proven differences.';
  }
}
