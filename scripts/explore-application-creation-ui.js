/**
 * One-off QA UI exploration for Application Creation flow.
 * Does NOT import framework page objects/locators.
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { chromium } = require('playwright');

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'src', 'reports');
const REPORT_JSON = path.join(
  REPORT_DIR,
  'application-creation-ui-exploration.json',
);

function loadEnv() {
  const envName = (process.env.ENV || 'QA').toLowerCase();
  const envFile = path.join(ROOT, `.env.${envName}`);
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  }
  const defaultEnv = path.join(ROOT, '.env');
  if (fs.existsSync(defaultEnv)) {
    dotenv.config({ path: defaultEnv, override: true });
  }
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function dismissBrowserNotice(page) {
  const dismiss = page.getByRole('button', { name: /ignore/i });
  if (await dismiss.isVisible().catch(() => false)) {
    await dismiss.click();
  }
}

async function login(page, baseUrl, email, password) {
  await page.goto(baseUrl, { waitUntil: 'load' });
  await dismissBrowserNotice(page);
  await page.locator('#field-email').waitFor({ state: 'visible' });
  await page.locator('#field-email').fill(email);
  await page.locator('#field-password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page
    .getByRole('button', { name: /create new application/i })
    .waitFor({ state: 'visible', timeout: 60000 });
}

async function capturePageSnapshot(page, label) {
  const screenshotPath = path.join(
    REPORT_DIR,
    `application-creation-${label}.png`,
  );
  await page.screenshot({ path: screenshotPath, fullPage: true });

  return page.evaluate(() => {
    function getSelector(el) {
      if (!el) return null;
      if (el.id) return `#${el.id}`;
      const testId =
        el.getAttribute('data-testid') ||
        el.getAttribute('data-test-id') ||
        el.getAttribute('data-qa');
      if (testId) return `[data-testid="${testId}"]`;
      const name = el.getAttribute('name');
      if (name) return `${el.tagName.toLowerCase()}[name="${name}"]`;
      const aria = el.getAttribute('aria-label');
      if (aria) return `[aria-label="${aria}"]`;
      return null;
    }

    function describeControl(el) {
      const tag = el.tagName.toLowerCase();
      const type = el.getAttribute('type');
      const id = el.id || null;
      const name = el.getAttribute('name');
      const role = el.getAttribute('role');
      const ariaLabel = el.getAttribute('aria-label');
      const placeholder = el.getAttribute('placeholder');
      const required =
        el.required || el.getAttribute('aria-required') === 'true';
      const disabled = el.disabled;
      const value = el.value ?? null;
      const text = (el.innerText || el.textContent || '').trim().slice(0, 500);

      let labelText = null;
      const labelEl =
        el.labels?.[0] || document.querySelector(`label[for="${el.id}"]`);
      if (labelEl) labelText = labelEl.innerText.trim();

      const options =
        tag === 'select'
          ? Array.from(el.options).map((o) => ({
              value: o.value,
              text: o.text.trim(),
              selected: o.selected,
            }))
          : null;

      return {
        tag,
        type,
        id,
        name,
        role,
        ariaLabel,
        placeholder,
        labelText,
        required,
        disabled,
        value,
        text: text || null,
        selector: getSelector(el),
        options,
      };
    }

    const headings = Array.from(
      document.querySelectorAll('h1,h2,h3,h4,h5,h6'),
    ).map((h) => ({
      level: h.tagName,
      text: h.innerText.trim(),
      id: h.id || null,
    }));

    const controls = Array.from(
      document.querySelectorAll(
        'input, select, textarea, button, [role="button"], [role="combobox"], [role="listbox"]',
      ),
    )
      .filter((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .map(describeControl);

    const alerts = Array.from(
      document.querySelectorAll(
        '[role="alert"], .error, .invalid-feedback, [class*="error"], [class*="Error"]',
      ),
    )
      .map((el) => ({
        text: (el.innerText || el.textContent || '').trim(),
        id: el.id || null,
        role: el.getAttribute('role'),
        selector: getSelector(el),
      }))
      .filter((a) => a.text);

    const visibleText = (document.body?.innerText || '').trim().slice(0, 4000);

    return {
      url: location.href,
      title: document.title,
      headings,
      controls,
      alerts,
      visibleText,
    };
  });
}

async function findStartApplicationButton(page) {
  const candidates = [
    page.getByRole('button', { name: /^start application$/i }),
    page.getByRole('button', { name: /start application/i }),
    page.locator('button').filter({ hasText: /start application/i }),
  ];
  for (const locator of candidates) {
    const count = await locator.count();
    if (count > 0) {
      return locator.first();
    }
  }
  return null;
}

async function findSelectByLabel(page, labelPattern) {
  const byLabel = page.getByLabel(labelPattern);
  if ((await byLabel.count()) > 0) {
    return byLabel.first();
  }
  return null;
}

async function describeLocator(page, locator, name) {
  if (!locator) {
    return { name, found: false };
  }

  const count = await locator.count();
  if (count === 0) {
    return { name, found: false };
  }

  const el = locator.first();
  const visible = await el.isVisible().catch(() => false);
  const enabled = await el.isEnabled().catch(() => false);
  const tagName = await el.evaluate((node) => node.tagName.toLowerCase());
  const meta = await el.evaluate((node) => {
    const id = node.id || null;
    const nameAttr = node.getAttribute('name');
    const aria = node.getAttribute('aria-label');
    const testId =
      node.getAttribute('data-testid') || node.getAttribute('data-test-id');
    let labelText = null;
    const labelEl =
      node.labels?.[0] || document.querySelector(`label[for="${node.id}"]`);
    if (labelEl) labelText = labelEl.innerText.trim();

    let options = null;
    if (node.tagName.toLowerCase() === 'select') {
      options = Array.from(node.options).map((o) => ({
        value: o.value,
        text: o.text.trim(),
        selected: o.selected,
      }));
    }

    return { id, nameAttr, aria, testId, labelText, options };
  });

  return {
    name,
    found: true,
    visible,
    enabled,
    tagName,
    ...meta,
    recommendedSelector: meta.id
      ? `#${meta.id}`
      : meta.testId
        ? `[data-testid="${meta.testId}"]`
        : meta.nameAttr
          ? `${tagName}[name="${meta.nameAttr}"]`
          : null,
  };
}

async function runValidationProbe(page, probeName, setupFn) {
  await page.reload({ waitUntil: 'load' });
  await page.waitForLoadState('networkidle').catch(() => undefined);
  if (setupFn) {
    await setupFn();
  }

  const startBtn = await findStartApplicationButton(page);
  const buttonState = startBtn
    ? {
        found: true,
        visible: await startBtn.isVisible().catch(() => false),
        enabled: await startBtn.isEnabled().catch(() => false),
      }
    : { found: false };

  if (startBtn && buttonState.enabled) {
    await startBtn.click({ timeout: 5000 }).catch((err) => {
      buttonState.clickError = String(err.message || err);
    });
    await page.waitForTimeout(1500);
  }

  const snapshot = await capturePageSnapshot(page, `validation-${probeName}`);
  return { probeName, buttonState, snapshot };
}

async function main() {
  loadEnv();
  const baseUrl =
    process.env.BASE_URL?.trim() || 'https://agent-portal-qa-20.ilifeta.com/';
  const email = requireEnv('AGENT_USERNAME');
  const password = requireEnv('AGENT_PASSWORD');
  const headless = (process.env.HEADLESS ?? 'true').toLowerCase() !== 'false';

  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const report = {
    exploredAt: new Date().toISOString(),
    baseUrl,
    flow: {},
    validationProbes: [],
    navigationProbes: {},
    uncertainties: [],
  };

  try {
    await login(page, baseUrl, email, password);
    report.flow.dashboard = await capturePageSnapshot(page, 'dashboard');
    report.flow.createNewApplicationButton = await describeLocator(
      page,
      page.getByRole('button', { name: /create new application/i }),
      'Create New Application',
    );

    await page.getByRole('button', { name: /create new application/i }).click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);

    report.flow.applicationCreationInitial = await capturePageSnapshot(
      page,
      'initial',
    );

    const stateSelect = await findSelectByLabel(page, /state/i);
    const productSelect = await findSelectByLabel(page, /product/i);
    const templateSelect = await findSelectByLabel(page, /template/i);
    const startBtn = await findStartApplicationButton(page);

    report.flow.fields = {
      state: await describeLocator(page, stateSelect, 'State'),
      product: await describeLocator(page, productSelect, 'Product'),
      template: await describeLocator(page, templateSelect, 'Template'),
      startApplication: await describeLocator(
        page,
        startBtn,
        'Start Application',
      ),
    };

    // Negative probes on fresh page
    report.validationProbes.push(
      await runValidationProbe(page, 'no-selections', null),
    );

    report.validationProbes.push(
      await runValidationProbe(page, 'state-only', async () => {
        const state = await findSelectByLabel(page, /state/i);
        if (state) {
          const options = await state.evaluate((sel) =>
            Array.from(sel.options)
              .map((o) => o.text.trim())
              .filter((t) => t && !/select|choose/i.test(t)),
          );
          if (options.length) await state.selectOption({ label: options[0] });
        }
      }),
    );

    report.validationProbes.push(
      await runValidationProbe(page, 'state-and-product', async () => {
        const state = await findSelectByLabel(page, /state/i);
        const product = await findSelectByLabel(page, /product/i);
        if (state) {
          const stateOptions = await state.evaluate((sel) =>
            Array.from(sel.options)
              .map((o) => o.text.trim())
              .filter((t) => t && !/select|choose/i.test(t)),
          );
          if (stateOptions.length)
            await state.selectOption({ label: stateOptions[0] });
        }
        if (product) {
          const productOptions = await product.evaluate((sel) =>
            Array.from(sel.options)
              .map((o) => o.text.trim())
              .filter((t) => t && !/select|choose/i.test(t)),
          );
          const termLife = productOptions.find((t) => /term life/i.test(t));
          if (termLife) await product.selectOption({ label: termLife });
          else if (productOptions.length)
            await product.selectOption({ label: productOptions[0] });
        }
      }),
    );

    // Valid flow
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(1500);

    const state = await findSelectByLabel(page, /state/i);
    const product = await findSelectByLabel(page, /product/i);
    const template = await findSelectByLabel(page, /template/i);
    const start = await findStartApplicationButton(page);

    let selectedState = null;
    let selectedProduct = null;
    let selectedTemplate = null;

    if (state) {
      const stateOptions = await state.evaluate((sel) =>
        Array.from(sel.options).map((o) => o.text.trim()),
      );
      const validState =
        stateOptions.find(
          (t) => t && !/select|choose|state/i.test(t) && t.length > 1,
        ) || stateOptions[1];
      if (validState) {
        await state.selectOption({ label: validState });
        selectedState = validState;
      }
    }

    if (product) {
      const productOptions = await product.evaluate((sel) =>
        Array.from(sel.options).map((o) => o.text.trim()),
      );
      const termLife = productOptions.find((t) =>
        /^term life$/i.test(t.trim()),
      );
      if (termLife) {
        await product.selectOption({ label: termLife });
        selectedProduct = termLife;
      }
    }

    if (template) {
      await page.waitForTimeout(1000);
      const templateOptions = await template.evaluate((sel) =>
        Array.from(sel.options).map((o) => o.text.trim()),
      );
      const life = templateOptions.find((t) => /^life$/i.test(t.trim()));
      if (life) {
        await template.selectOption({ label: life });
        selectedTemplate = life;
      }
    }

    report.flow.validSelections = {
      state: selectedState,
      product: selectedProduct,
      template: selectedTemplate,
    };

    if (start) {
      report.flow.beforeValidSubmit = {
        buttonEnabled: await start.isEnabled().catch(() => false),
        snapshot: await capturePageSnapshot(page, 'before-valid-submit'),
      };

      await start.click();
      await page.waitForLoadState('load').catch(() => undefined);
      await page.waitForTimeout(3000);

      report.flow.afterValidSubmit = await capturePageSnapshot(
        page,
        'after-valid-submit',
      );
    }

    // Back navigation probe
    const postSubmitUrl = page.url();
    await page.goBack({ waitUntil: 'load' }).catch(() => undefined);
    await page.waitForTimeout(1500);
    report.navigationProbes.browserBack = {
      landedUrl: page.url(),
      snapshot: await capturePageSnapshot(page, 'after-browser-back'),
    };

    // Refresh probe on application creation page
    if (report.navigationProbes.browserBack.landedUrl.includes('login')) {
      await page
        .goto(postSubmitUrl, { waitUntil: 'load' })
        .catch(() => undefined);
      await page.waitForTimeout(1500);
    }
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(1500);
    report.navigationProbes.pageRefresh = {
      url: page.url(),
      snapshot: await capturePageSnapshot(page, 'after-page-refresh'),
    };

    // Re-open from dashboard for refresh on creation page
    await page.goto(baseUrl, { waitUntil: 'load' });
    await dismissBrowserNotice(page);
    const onLogin = await page
      .locator('#field-email')
      .isVisible()
      .catch(() => false);
    if (onLogin) {
      report.navigationProbes.refreshFromDashboard = {
        note: 'Session may have expired after navigation probes; re-login required for dashboard refresh probe',
      };
      await login(page, baseUrl, email, password);
    }
    await page.getByRole('button', { name: /create new application/i }).click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);

    const state2 = await findSelectByLabel(page, /state/i);
    if (state2 && selectedState) {
      await state2.selectOption({ label: selectedState });
    }
    const product2 = await findSelectByLabel(page, /product/i);
    if (product2 && selectedProduct) {
      await product2.selectOption({ label: selectedProduct });
    }
    const template2 = await findSelectByLabel(page, /template/i);
    if (template2 && selectedTemplate) {
      await template2.selectOption({ label: selectedTemplate });
    }

    report.navigationProbes.selectionsBeforeRefresh = {
      state: selectedState,
      product: selectedProduct,
      template: selectedTemplate,
    };

    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(1500);
    report.navigationProbes.creationPageRefreshWithPriorSelections = {
      url: page.url(),
      fields: {
        state: await describeLocator(
          page,
          await findSelectByLabel(page, /state/i),
          'State',
        ),
        product: await describeLocator(
          page,
          await findSelectByLabel(page, /product/i),
          'Product',
        ),
        template: await describeLocator(
          page,
          await findSelectByLabel(page, /template/i),
          'Template',
        ),
      },
      snapshot: await capturePageSnapshot(page, 'creation-page-refresh'),
    };
  } catch (error) {
    report.error = String(error.stack || error);
    await page
      .screenshot({
        path: path.join(REPORT_DIR, 'application-creation-error.png'),
        fullPage: true,
      })
      .catch(() => undefined);
  } finally {
    fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2));
    await context.close();
    await browser.close();
  }

  console.log(`Exploration complete. Report: ${REPORT_JSON}`);
  if (report.error) {
    console.error(report.error);
    process.exitCode = 1;
  }
}

main();
