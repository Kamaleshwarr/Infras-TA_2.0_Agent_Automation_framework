@login @smoke @regression
Feature: User Login
  As a registered agent
  I want to log in to the Transamerica Agent Portal
  So that I can access my dashboard

  Background:
    Given the login page is loaded

  @login @positive @requires-credentials @smoke @regression
  Scenario: Successful login with valid credentials
    When the user logs in with valid credentials
    Then the user should be successfully logged in

  @login @negative @validation @regression
  Scenario Outline: Login validation rejects invalid input
    When the user submits login for validation case "<caseId>"
    Then login validation case "<caseId>" should display expected messages

    Examples:
      | caseId |
      | invalid-email-and-password |
      | empty-email |
      | empty-password |
      | empty-email-and-password |
      | invalid-email-format-with-password |
      | invalid-email-format-with-empty-password |
      | valid-email-with-invalid-password |

  @login @positive @regression
  Scenario: User can open the forgot password dialog
    When the user opens the forgot password dialog
    Then the forgot password dialog should be displayed

  @login @positive @regression
  Scenario: User can close the forgot password dialog using Cancel
    When the user opens the forgot password dialog
    And the user closes the forgot password dialog with Cancel
    Then the login page should be displayed

  @login @positive @regression
  Scenario: User can close the forgot password dialog using Close
    When the user opens the forgot password dialog
    And the user closes the forgot password dialog with Close
    Then the login page should be displayed
