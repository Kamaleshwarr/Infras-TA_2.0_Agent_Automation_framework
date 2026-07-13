import { Given, Then, When } from '@cucumber/cucumber';
import { TestDataProvider } from '../testdata/providers/TestDataProvider';
import { getAgentCredentials } from '../testdata/providers/agentCredentials';
import { CustomWorld } from '../hooks/world';

interface LoginTestData {
  invalidUser: { username: string; password: string };
  errorMessages: {
    invalidCredentials: string;
    requiredFields: string;
  };
}

const loginData = TestDataProvider.loadJson<LoginTestData>('login.json');

Given('the user is on the login page', async function (this: CustomWorld) {
  await this.loginPage.openLoginPage();
  await this.loginPage.verifyLoginPageDisplayed();
});

When(
  'the user logs in with valid credentials',
  async function (this: CustomWorld) {
    await this.loginPage.login(getAgentCredentials());
  },
);

When(
  'the user logs in with invalid credentials',
  async function (this: CustomWorld) {
    await this.loginPage.login(loginData.invalidUser);
  },
);

When(
  'the user logs in with username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.login({ username, password });
  },
);

Then(
  'the user should be redirected to the dashboard',
  async function (this: CustomWorld) {
    await this.dashboardPage.verifyDashboardLoaded();
  },
);

Then(
  'the user should see a login error message',
  async function (this: CustomWorld) {
    await this.loginPage.verifyLoginError(
      loginData.errorMessages.invalidCredentials,
    );
  },
);

Then(
  'the user should see error message {string}',
  async function (this: CustomWorld, errorMessage: string) {
    await this.loginPage.verifyLoginError(errorMessage);
  },
);
