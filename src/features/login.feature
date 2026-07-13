@login @smoke @regression @sanity @critical @ui
Feature: User Login
  As a registered agent
  I want to log in to the application
  So that I can access my dashboard

  Background:
    Given the user is on the login page

  @positive
  Scenario: Successful login with valid credentials
    When the user logs in with valid credentials
    Then the user should be redirected to the dashboard

  @negative
  Scenario: Login fails with invalid credentials
    When the user logs in with invalid credentials
    Then the user should see a login error message

  @negative
  Scenario Outline: Login fails with invalid username and password combinations
    When the user logs in with username "<username>" and password "<password>"
    Then the user should see error message "<errorMessage>"

    Examples:
      | username      | password     | errorMessage                  |
      | invalid_user  | agent_pass   | Invalid username or password  |
      |               | agent_pass   | Invalid username or password  |
      | agent_user    |              | Invalid username or password  |
