/**
 * Enhanced QA exploration — custom combobox dialog flow.
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { chromium } = require('playwright');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'src', 'reports');
const REPORT_JSON = path.join(
  REPORT_DIR,
  'application-creation-ui-exploration-v2.json',
);

function loadEnv() {
  const envName = (process.env.ENV || 'QA').toLowerCase();
  const envFile = path.join(ROOT, `.env.${envName}`);
  if (fs.existsSync(envFile)) dotenv.config({ path: envFile });
  const defaultEnv = path.join(ROOT, '.env');
  if (fs.existsSync(defaultEnv))
    dotenv.config({ path: defaultEnv, override: true });
}

async function dismissBrowserNotice(page) {
  const dismiss = page.getByRole('button', { name: /ignore/i });
  if (await dismiss.isVisible().catch(() => false)) await dismiss.click();
}

async function login(page, baseUrl, email, password) {
  await page.goto(baseUrl, { waitUntil: 'load' });
  await dismissBrowserNotice(page);
  await page.locator('#field-email').fill(email);
  await page.locator('#field-password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page
    .getByTestId('agp-dashboard-button-create')
    .waitFor({ state: 'visible', timeout: 60000 });
}

async function openCreateDialog(page) {
  await page.getByTestId('agp-dashboard-button-create').click();
  await page
    .getByRole('heading', { name: /^Create New Application$/i })
    .waitFor({
      state: 'visible',
    });
}

async function snapshot(page) {
  return page.evaluate(() => {
    const dialog = document.querySelector(
      '[role="dialog"], [data-testid*="dialog"]',
    );
    const dialogText = dialog
      ? (dialog.innerText || '').trim().slice(0, 3000)
      : null;

    const alerts = Array.from(
      document.querySelectorAll(
        '[role="alert"], [data-testid*="error"], .text-destructive, [class*="error"]',
      ),
    )
      .map((el) => ({
        text: (el.innerText || el.textContent || '').trim(),
        testId: el.getAttribute('data-testid'),
        id: el.id || null,
      }))
      .filter((a) => a.text);

    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4')).map(
      (h) => ({ tag: h.tagName, text: h.innerText.trim(), id: h.id || null }),
    );

    return {
      url: location.href,
      title: document.title,
      headings,
      dialogText,
      alerts,
    };
  });
}

async function getFieldMeta(page, triggerTestId) {
  const trigger = page.getByTestId(triggerTestId);
  const count = await trigger.count();
  if (count === 0) return { found: false, testId: triggerTestId };

  const meta = await trigger.evaluate((node) => {
    const id = node.id;
    const placeholder = node.getAttribute('placeholder');
    const required =
      node.required || node.getAttribute('aria-required') === 'true';
    const disabled = node.disabled;
    const value = node.value;
    const ariaExpanded = node.getAttribute('aria-expanded');
    const ariaControls = node.getAttribute('aria-controls');
    let labelText = null;
    const label =
      node.labels?.[0] || document.querySelector(`label[for="${id}"]`);
    if (label) labelText = label.innerText.trim();
    return {
      id,
      placeholder,
      required,
      disabled,
      value,
      ariaExpanded,
      ariaControls,
      labelText,
    };
  });

  return { found: true, testId: triggerTestId, ...meta };
}

async function openDropdownAndCaptureOptions(page, triggerTestId) {
  const trigger = page.getByTestId(triggerTestId);
  if ((await trigger.count()) === 0) return { found: false, options: [] };

  await trigger.click();
  await page.waitForTimeout(800);

  const options = await page.evaluate(() => {
    const candidates = Array.from(
      document.querySelectorAll(
        '[role="option"], [role="menuitem"], [data-radix-collection-item], li[data-value]',
      ),
    );
    return candidates
      .filter((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .map((el) => ({
        text: (el.innerText || el.textContent || '').trim(),
        value:
          el.getAttribute('data-value') || el.getAttribute('value') || null,
        role: el.getAttribute('role'),
        testId: el.getAttribute('data-testid'),
      }))
      .filter((o) => o.text);
  });

  // Close dropdown with Escape if still open
  await page.keyboard.press('Escape').catch(() => undefined);
  await page.waitForTimeout(300);

  return { found: true, options };
}

async function selectOptionByText(page, triggerTestId, optionText) {
  const trigger = page.getByTestId(triggerTestId);
  await trigger.click();
  await page.waitForTimeout(500);

  const option = page
    .locator('[role="option"], [role="menuitem"], [data-radix-collection-item]')
    .filter({
      hasText: new RegExp(
        `^${optionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
        'i',
      ),
    });

  if ((await option.count()) === 0) {
    await page
      .locator(
        '[role="option"], [role="menuitem"], [data-radix-collection-item]',
      )
      .filter({
        hasText: new RegExp(
          optionText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i',
        ),
      })
      .first()
      .click();
  } else {
    await option.first().click();
  }
  await page.waitForTimeout(800);
}

async function describeStartButton(page) {
  const btn = page.getByTestId('agp-dashboard-dialog-create-button-submit');
  return {
    found: (await btn.count()) > 0,
    visible: await btn.isVisible().catch(() => false),
    enabled: await btn.isEnabled().catch(() => false),
    text: await btn.innerText().catch(() => null),
    ariaLabel: await btn.getAttribute('aria-label'),
    testId: 'agp-dashboard-dialog-create-button-submit',
  };
}

async function main() {
  loadEnv();
  const baseUrl =
    process.env.BASE_URL?.trim() || 'https://agent-portal-qa-20.ilifeta.com/';
  const email = process.env.AGENT_USERNAME?.trim();
  const password = process.env.AGENT_PASSWORD?.trim();
  if (!email || !password) throw new Error('Missing AGENT credentials');

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await (
    await browser.newContext({ viewport: { width: 1440, height: 900 } })
  ).newPage();

  const report = {
    exploredAt: new Date().toISOString(),
    baseUrl,
    criticalFinding:
      'Application Creation is a dashboard modal dialog; URL does not change.',
  };

  try {
    await login(page, baseUrl, email, password);
    report.dashboard = await snapshot(page);
    await page.screenshot({
      path: path.join(REPORT_DIR, 'application-creation-v2-dashboard.png'),
      fullPage: true,
    });

    await openCreateDialog(page);
    report.dialogInitial = {
      ...(await snapshot(page)),
      fields: {
        state: await getFieldMeta(
          page,
          'agp-dashboard-dialog-create-field-state-trigger',
        ),
        product: await getFieldMeta(
          page,
          'agp-dashboard-dialog-create-field-product-trigger',
        ),
        template: await getFieldMeta(
          page,
          'agp-dashboard-dialog-create-field-template-trigger',
        ),
      },
      startApplication: await describeStartButton(page),
      cancelButton: {
        testId: 'agp-dashboard-dialog-create-button-cancel',
        visible: await page
          .getByTestId('agp-dashboard-dialog-create-button-cancel')
          .isVisible()
          .catch(() => false),
      },
      dialogHeading: {
        role: 'heading',
        name: 'Create New Application',
        selector: 'role=heading[name=/^Create New Application$/i]',
      },
      helperText:
        'After creating an application, you will be directed to the application form.',
    };

    await page.screenshot({
      path: path.join(REPORT_DIR, 'application-creation-v2-dialog-initial.png'),
      fullPage: true,
    });

    // Dropdown options
    report.dropdowns = {
      state: await openDropdownAndCaptureOptions(
        page,
        'agp-dashboard-dialog-create-field-state-trigger',
      ),
    };

    // Validation: no selections
    report.validation = {};
    report.validation.noSelections = {
      startApplication: await describeStartButton(page),
      snapshot: await snapshot(page),
    };
    await page.screenshot({
      path: path.join(
        REPORT_DIR,
        'application-creation-v2-validation-none.png',
      ),
      fullPage: true,
    });

    // Select state (Alabama - common in table)
    const stateToSelect =
      report.dropdowns.state.options.find((o) => /^Alabama$/i.test(o.text))
        ?.text ||
      report.dropdowns.state.options.find(
        (o) => o.text && !/select/i.test(o.text),
      )?.text;

    if (stateToSelect) {
      await selectOptionByText(
        page,
        'agp-dashboard-dialog-create-field-state-trigger',
        stateToSelect,
      );
    }

    report.validation.stateOnly = {
      selectedState: stateToSelect,
      fields: {
        state: await getFieldMeta(
          page,
          'agp-dashboard-dialog-create-field-state-trigger',
        ),
        product: await getFieldMeta(
          page,
          'agp-dashboard-dialog-create-field-product-trigger',
        ),
        template: await getFieldMeta(
          page,
          'agp-dashboard-dialog-create-field-template-trigger',
        ),
      },
      startApplication: await describeStartButton(page),
      snapshot: await snapshot(page),
    };
    await page.screenshot({
      path: path.join(
        REPORT_DIR,
        'application-creation-v2-validation-state-only.png',
      ),
      fullPage: true,
    });

    report.dropdowns.product = await openDropdownAndCaptureOptions(
      page,
      'agp-dashboard-dialog-create-field-product-trigger',
    );

    const termLife = report.dropdowns.product.options.find((o) =>
      /^Term Life$/i.test(o.text),
    )?.text;
    if (termLife) {
      await selectOptionByText(
        page,
        'agp-dashboard-dialog-create-field-product-trigger',
        termLife,
      );
    }

    report.validation.stateAndProduct = {
      selectedState: stateToSelect,
      selectedProduct: termLife || null,
      fields: {
        state: await getFieldMeta(
          page,
          'agp-dashboard-dialog-create-field-state-trigger',
        ),
        product: await getFieldMeta(
          page,
          'agp-dashboard-dialog-create-field-product-trigger',
        ),
        template: await getFieldMeta(
          page,
          'agp-dashboard-dialog-create-field-template-trigger',
        ),
      },
      startApplication: await describeStartButton(page),
      snapshot: await snapshot(page),
    };
    await page.screenshot({
      path: path.join(
        REPORT_DIR,
        'application-creation-v2-validation-state-product.png',
      ),
      fullPage: true,
    });

    report.dropdowns.template = await openDropdownAndCaptureOptions(
      page,
      'agp-dashboard-dialog-create-field-template-trigger',
    );

    report.validation.stateProductOnly = {
      selectedState: stateToSelect,
      selectedProduct: termLife || null,
      templateField: await getFieldMeta(
        page,
        'agp-dashboard-dialog-create-field-template-trigger',
      ),
      startApplication: await describeStartButton(page),
      snapshot: await snapshot(page),
    };

    const lifeTemplate = report.dropdowns.template.options.find((o) =>
      /^Life$/i.test(o.text),
    )?.text;

    if (lifeTemplate) {
      await selectOptionByText(
        page,
        'agp-dashboard-dialog-create-field-template-trigger',
        lifeTemplate,
      );
    }

    report.validFlow = {
      selections: {
        state: stateToSelect,
        product: termLife,
        template: lifeTemplate,
      },
      beforeSubmit: {
        fields: {
          state: await getFieldMeta(
            page,
            'agp-dashboard-dialog-create-field-state-trigger',
          ),
          product: await getFieldMeta(
            page,
            'agp-dashboard-dialog-create-field-product-trigger',
          ),
          template: await getFieldMeta(
            page,
            'agp-dashboard-dialog-create-field-template-trigger',
          ),
        },
        startApplication: await describeStartButton(page),
        snapshot: await snapshot(page),
      },
    };

    await page.screenshot({
      path: path.join(REPORT_DIR, 'application-creation-v2-before-submit.png'),
      fullPage: true,
    });

    const start = page.getByTestId('agp-dashboard-dialog-create-button-submit');
    if (await start.isEnabled()) {
      const urlBefore = page.url();
      await start.click();
      await page.waitForLoadState('load').catch(() => undefined);
      await page.waitForTimeout(5000);

      report.validFlow.afterSubmit = {
        urlBefore,
        urlAfter: page.url(),
        snapshot: await snapshot(page),
        newApplicationInTable: await page.evaluate(() => {
          const rows = Array.from(
            document.querySelectorAll('table tbody tr, [role="row"]'),
          );
          return rows
            .slice(0, 3)
            .map((row) => (row.innerText || '').trim().slice(0, 200));
        }),
      };

      await page.screenshot({
        path: path.join(REPORT_DIR, 'application-creation-v2-after-submit.png'),
        fullPage: true,
      });

      // Browser back from post-submit
      await page.goBack({ waitUntil: 'load' }).catch(() => undefined);
      await page.waitForTimeout(2000);
      report.navigation = {
        browserBack: {
          url: page.url(),
          snapshot: await snapshot(page),
        },
      };

      // Re-open dialog and set selections, then refresh
      if (
        await page
          .getByTestId('agp-dashboard-button-create')
          .isVisible()
          .catch(() => false)
      ) {
        await openCreateDialog(page);
        if (stateToSelect)
          await selectOptionByText(
            page,
            'agp-dashboard-dialog-create-field-state-trigger',
            stateToSelect,
          );
        if (termLife)
          await selectOptionByText(
            page,
            'agp-dashboard-dialog-create-field-product-trigger',
            termLife,
          );
        if (lifeTemplate)
          await selectOptionByText(
            page,
            'agp-dashboard-dialog-create-field-template-trigger',
            lifeTemplate,
          );

        report.navigation.selectionsBeforeRefresh = {
          state: await getFieldMeta(
            page,
            'agp-dashboard-dialog-create-field-state-trigger',
          ),
          product: await getFieldMeta(
            page,
            'agp-dashboard-dialog-create-field-product-trigger',
          ),
          template: await getFieldMeta(
            page,
            'agp-dashboard-dialog-create-field-template-trigger',
          ),
        };

        await page.reload({ waitUntil: 'load' });
        await page.waitForTimeout(2000);
        report.navigation.pageRefreshOnDashboard = {
          url: page.url(),
          dialogOpen: await page
            .getByRole('heading', { name: /^Create New Application$/i })
            .isVisible()
            .catch(() => false),
          snapshot: await snapshot(page),
        };
      }
    } else {
      report.validFlow.submitSkipped = 'Start Application remained disabled';
    }
  } catch (error) {
    report.error = String(error.stack || error);
    await page
      .screenshot({
        path: path.join(REPORT_DIR, 'application-creation-v2-error.png'),
        fullPage: true,
      })
      .catch(() => undefined);
  } finally {
    fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2));
    await browser.close();
  }

  console.log(`Report written: ${REPORT_JSON}`);
  if (report.error) {
    console.error(report.error);
    process.exitCode = 1;
  }
}

main();
