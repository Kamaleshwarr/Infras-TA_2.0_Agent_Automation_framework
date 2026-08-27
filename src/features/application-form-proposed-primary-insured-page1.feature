@application-form @term-life @proposed-primary-insured-page1 @requires-credentials @regression

Feature: Term Life Proposed Primary Insured Page 1

  As an agent

  I want Proposed Primary Insured Page 1 validated for the selected application state

  So that the Term Life application captures valid insured information



  Background:

    Given the user is logged in to the agent portal



  Scenario: Validate Proposed Primary Insured Page 1 for Alabama

    Given the user starts a Term Life application for Proposed Primary Insured Page 1 for "California"

    When the user completes Licensing and opens Proposed Primary Insured Page 1

    Then Proposed Primary Insured Page 1 coverage should pass

