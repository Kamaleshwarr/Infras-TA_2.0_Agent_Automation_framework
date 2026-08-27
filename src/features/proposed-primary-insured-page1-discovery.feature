@discovery @requires-credentials
Feature: Proposed Primary Insured Page 1 — Representative State Discovery
  Temporary discovery-only scenario. Not part of PI Page 1 regression coverage.
  Compare PI Page 1 structure for representative states against the Alabama baseline.

  Background:
    Given the user is logged in to the agent portal

  Scenario: Capture and compare PI Page 1 structure across representative states
    When the PI Page 1 discovery pass runs for the representative states
    Then the PI Page 1 discovery report should be written
