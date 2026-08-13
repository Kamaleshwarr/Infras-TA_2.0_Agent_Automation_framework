# ============================================================
# LICENSING STATE FLOW MAPPING
# ============================================================
#
# The Licensing regression is organized into four representative state
# flows based on the distinct combinations of state-specific Licensing
# requirements defined in src/testdata/licensing.json (flows +
# stateFlowMapping).
#
# Instead of executing the complete Licensing workflow separately for
# every state, states sharing the same requirement profile are grouped
# under one representative flow scenario.
#
# Requirement profiles (agentAddressPresent / licenseNumberPresent):
#
# FLOW A — No Agent Address + No License Number
# Representative: Alabama
# States: Alabama, Alaska, Arizona, Arkansas, Colorado, Connecticut,
#         District of Columbia, Hawaii, Idaho, Illinois, Iowa, Kansas,
#         Kentucky, Louisiana, Maine, Maryland, Massachusetts,
#         Mississippi, Montana, Nebraska, Nevada, New Hampshire,
#         New Jersey, New Mexico, North Carolina, North Dakota, Ohio,
#         Oregon, Rhode Island, South Carolina, South Dakota, Tennessee,
#         Texas, Utah, Vermont, Virginia, West Virginia, Wisconsin
#
# FLOW B — Agent Address + License Number
# Representative: California
# States: California, Florida, Georgia, Indiana, Wyoming
#
# FLOW C — Agent Address + No License Number
# Representative: Delaware
# States: Delaware, Michigan, Minnesota, Pennsylvania, Washington
#
# FLOW D — No Agent Address + License Number
# Representative: Missouri
# States: Missouri, Oklahoma
#
# Coverage rationale:
# These four representative flows cover the four distinct Licensing
# requirement combinations currently modeled by the automation. Running
# one end-to-end scenario per combination validates the different
# Licensing UI, field validations, persistence, split-agent and percentage
# behavior, navigation, and Return to Applications behavior without
# duplicating the same full regression for every state that shares an
# identical profile.
#
# Note: State membership above is taken from licensing.json stateFlowMapping.
# Term Life is unavailable for Guam and Puerto Rico (see
# termLifeUnavailableStates); those territories are not included in the
# state-to-flow mapping.
#
# Execution:
# ONE login + ONE application + ONE Licensing session per flow.
# All validations run sequentially within that session.
#
# ============================================================

@application-form @term-life @licensing @requires-credentials @regression
Feature: Term Life Application Form - Licensing Module
  As a logged-in agent
  I want the Licensing module to reflect my application state requirements
  So that state-specific licensing rules are applied correctly

  Background:
    Given the user is logged in to the agent portal

  @application-form @term-life @licensing @flow-a
  Scenario: Term Life Licensing - Flow A - Complete Coverage
    Given the user creates a Term Life application for state "New Mexico"
    When the user navigates to the Licensing module
    Then the complete Flow A Licensing coverage should pass

  @application-form @term-life @licensing @flow-b
  Scenario: Term Life Licensing - Flow B - Complete Coverage
    Given the user creates a Term Life application for state "California"
    When the user navigates to the Licensing module
    Then the complete Flow B Licensing coverage should pass

  @application-form @term-life @licensing @flow-c
  Scenario: Term Life Licensing - Flow C - Complete Coverage
    Given the user creates a Term Life application for state "Delaware"
    When the user navigates to the Licensing module
    Then the complete Flow C Licensing coverage should pass

  @application-form @term-life @licensing @flow-d
  Scenario: Term Life Licensing - Flow D - Complete Coverage
    Given the user creates a Term Life application for state "Missouri"
    When the user navigates to the Licensing module
    Then the complete Flow D Licensing coverage should pass
