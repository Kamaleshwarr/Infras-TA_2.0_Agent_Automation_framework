@create-application @requires-credentials @smoke @regression
Feature: Application Creation
  As a logged-in agent
  I want to create a new application from the dashboard
  So that I can begin the application form workflow

  Background:
    Given the user is logged in to the agent portal

  @create-application @smoke @positive
  Scenario: Create New Application dialog can be opened
    When the user opens the Create New Application dialog
    Then the Create New Application dialog should be displayed
    And the Create New Application button should be visible and enabled

  @create-application @validation
  Scenario: Product is disabled before state selection
    When the user opens the Create New Application dialog
    Then the Product field should be disabled before state selection

  @create-application @validation
  Scenario: Template is hidden before product selection
    When the user opens the Create New Application dialog
    Then the Template field should be hidden before product selection

  @create-application @validation
  Scenario: Start Application is disabled before required selections
    When the user opens the Create New Application dialog
    Then the Start Application button should be disabled before required selections

  @create-application @validation
  Scenario: State selection enables Product
    When the user opens the Create New Application dialog
    And the user selects Alabama on the application creation dialog
    Then Alabama should be selected on the application creation dialog
    And the Product field should be enabled after state selection

  @create-application @validation
  Scenario: Term Life selection populates Template
    When the user opens the Create New Application dialog
    And the user selects Alabama and Term Life on the application creation dialog
    Then the Template field should be visible after product selection
    And the Template field should be enabled after product selection
    And the Template value should be Life

  @create-application @positive
  Scenario: Alabama Term Life application can be created
    When the user opens the Create New Application dialog
    And the user selects the verified application creation combination
    And the user starts the application
    Then the application creation should complete successfully

  @create-application @positive
  Scenario: Successful application opens the Application Form shell
    When the user opens the Create New Application dialog
    And the user selects the verified application creation combination
    And the user starts the application
    Then the application form shell should be displayed

  @create-application @positive
  Scenario: Create New Application button is available from Applications page
    Then the Applications page should be displayed
    And the Create New Application button should be visible and enabled

  @create-application @negative
  Scenario: Cancel closes Create New Application dialog
    When the user opens the Create New Application dialog
    And the user cancels application creation
    Then the Create New Application dialog should be closed

  @create-application @negative
  Scenario: Close closes Create New Application dialog
    When the user opens the Create New Application dialog
    And the user closes the Create New Application dialog
    Then the Create New Application dialog should be closed

  @create-application @positive
  Scenario: Dashboard application record is created after successful application creation
    When the user records the visible dashboard application identifiers
    And the user opens the Create New Application dialog
    And the user selects the verified application creation combination
    And the user starts the application
    And the user returns to the Applications page
    Then a new verified application record should appear on the dashboard

  @create-application @validation @iul
  Scenario: IUL product is available for a regular supported state
    When the user opens the Create New Application dialog
    And the user selects Alabama on the application creation dialog
    And the user opens the Product dropdown on the application creation dialog
    Then Indexed Universal Life should be available in the Product dropdown
    And Term Life should be available in the Product dropdown

  @create-application @validation @iul
  Scenario: Puerto Rico only offers IUL
    When the user opens the Create New Application dialog
    And the user selects Puerto Rico on the application creation dialog
    And the user opens the Product dropdown on the application creation dialog
    Then Indexed Universal Life should be available in the Product dropdown
    And Term Life should not be available in the Product dropdown

  @create-application @validation @iul
  Scenario: Guam only offers IUL
    When the user opens the Create New Application dialog
    And the user selects Guam on the application creation dialog
    And the user opens the Product dropdown on the application creation dialog
    Then Indexed Universal Life should be available in the Product dropdown
    And Term Life should not be available in the Product dropdown

  @create-application @positive @iul
  Scenario: Puerto Rico Indexed Universal Life application can be created
    When the user opens the Create New Application dialog
    And the user selects the verified Puerto Rico IUL application combination
    Then the Start Application button should be enabled after valid selections
    When the user starts the application
    Then the application form shell should be displayed

  @create-application @positive @iul
  Scenario: Guam Indexed Universal Life application can be created
    When the user opens the Create New Application dialog
    And the user selects the verified Guam IUL application combination
    Then the Start Application button should be enabled after valid selections
    When the user starts the application
    Then the application form shell should be displayed

  @create-application @validation @iul
  Scenario: IUL template is consistent across supported locations
    When the user opens the Create New Application dialog
    And the user selects Alabama and Indexed Universal Life on the application creation dialog
    Then the verified IUL template value should be displayed
    And the user closes the Create New Application dialog
    When the user opens the Create New Application dialog
    And the user selects Puerto Rico and Indexed Universal Life on the application creation dialog
    Then the verified IUL template value should be displayed
    And the user closes the Create New Application dialog
    When the user opens the Create New Application dialog
    And the user selects Guam and Indexed Universal Life on the application creation dialog
    Then the verified IUL template value should be displayed

  @create-application @validation @iul @negative
  Scenario: New York is not available in State dropdown
    When the user opens the Create New Application dialog
    And the user opens the State dropdown on the application creation dialog
    Then New York should not be available in the State dropdown

  @create-application @validation @iul @negative
  Scenario: U.S. Virgin Islands is not available in State dropdown
    When the user opens the Create New Application dialog
    And the user opens the State dropdown on the application creation dialog
    Then U.S. Virgin Islands should not be available in the State dropdown

  @create-application @validation @regression
  Scenario: State dropdown displays the expected number of available locations
    When the user opens the Create New Application dialog
    And the user opens the State dropdown on the application creation dialog
    Then the State dropdown should display the expected number of available locations

  @create-application @validation @regression
  Scenario: State dropdown contains all expected available locations
    When the user opens the Create New Application dialog
    And the user opens the State dropdown on the application creation dialog
    And the user captures the available State dropdown options on the application creation dialog
    Then the State dropdown should contain all expected available locations
