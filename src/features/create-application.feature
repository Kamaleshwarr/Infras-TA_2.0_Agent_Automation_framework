@create-application @dashboard @requires-credentials @smoke @regression @sanity @critical @ui
Feature: Create New Application
  As a logged-in agent
  I want to start a new application from the dashboard
  So that I can begin the application wizard workflow

  Background:
    Given the user is logged in to the agent portal

  @createApplication-positive
  Scenario: Agent navigates to Application Wizard page one from dashboard
    When the user clicks Create New Application on the dashboard
    Then the Application Wizard page one should be displayed
    And the wizard should show step indicator "Licensing and Appointment"

  @createApplication-positive
  Scenario: Agent can fill Application Wizard page one fields
    When the user clicks Create New Application on the dashboard
    And the user fills Application Wizard page one with valid data
    Then the Application Wizard page one should be displayed

  @createApplication-positive
  Scenario: Application Wizard page one displays prefilled agent number
    When the user clicks Create New Application on the dashboard
    Then the Application Wizard page one should display prefilled agent details
