/**
 * Recommended Cucumber tags for suite filtering.
 */
export enum TagType {
  SMOKE = '@smoke',
  REGRESSION = '@regression',
  SANITY = '@sanity',
  CRITICAL = '@critical',
  UI = '@ui',
  API = '@api',
  WIP = '@wip',
}

export const TEST_TAGS = TagType;
