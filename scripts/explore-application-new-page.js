const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { chromium } = require('playwright');

dotenv.config({ path: path.join(process.cwd(), '.env.qa') });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await (
    await browser.newContext({ viewport: { width: 1440, height: 900 } })
  ).newPage();
  const base = process.env.BASE_URL;

  await page.goto(base, { waitUntil: 'load' });
  const ignore = page.getByRole('button', { name: /ignore/i });
  if (await ignore.isVisible().catch(() => false)) await ignore.click();
  await page.locator('#field-email').fill(process.env.AGENT_USERNAME);
  await page.locator('#field-password').fill(process.env.AGENT_PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page
    .getByTestId('agp-dashboard-button-create')
    .waitFor({ state: 'visible' });
  await page.getByTestId('agp-dashboard-button-create').click();
  await page
    .getByTestId('agp-dashboard-dialog-create-field-state-option-al')
    .click({
      timeout: 10000,
    })
    .catch(async () => {
      await page
        .getByTestId('agp-dashboard-dialog-create-field-state-trigger')
        .click();
      await page
        .getByTestId('agp-dashboard-dialog-create-field-state-option-al')
        .click();
    });
  await page
    .getByTestId('agp-dashboard-dialog-create-field-product-trigger')
    .click();
  await page
    .getByTestId('agp-dashboard-dialog-create-field-product-option-term-life')
    .click();
  await page
    .getByTestId('agp-dashboard-dialog-create-field-template-trigger')
    .click();
  await page
    .getByTestId('agp-dashboard-dialog-create-field-template-option-3107')
    .click();
  await page.getByTestId('agp-dashboard-dialog-create-button-submit').click();
  await page.waitForURL('**/application/new**', { timeout: 60000 });
  await page.waitForTimeout(4000);

  const data = await page.evaluate(() => {
    function getSel(el) {
      if (!el) return null;
      if (el.id) return `#${el.id}`;
      const testId = el.getAttribute('data-testid');
      if (testId) return `[data-testid="${testId}"]`;
      return null;
    }

    const headings = Array.from(
      document.querySelectorAll('h1,h2,h3,h4,h5,h6'),
    ).map((h) => ({
      tag: h.tagName,
      text: h.innerText.trim(),
      id: h.id || null,
      testId: h.getAttribute('data-testid'),
    }));

    const controls = Array.from(
      document.querySelectorAll(
        'input,select,textarea,button,[role="button"],[role="combobox"],a',
      ),
    )
      .filter((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      })
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        testId: el.getAttribute('data-testid'),
        label:
          (
            el.labels?.[0] || document.querySelector(`label[for="${el.id}"]`)
          )?.innerText?.trim() || null,
        name: el.getAttribute('name'),
        placeholder: el.placeholder || null,
        text: (el.innerText || el.textContent || '').trim().slice(0, 160),
        disabled: el.disabled,
        href: el.getAttribute('href'),
        selector: getSel(el),
      }));

    const navSections = Array.from(
      document.querySelectorAll(
        '[data-testid*="section"], nav li, [role="tab"], [role="menuitem"]',
      ),
    ).map((el) => ({
      testId: el.getAttribute('data-testid'),
      role: el.getAttribute('role'),
      text: (el.innerText || '').trim().slice(0, 200),
      selector: getSel(el),
    }));

    return {
      url: location.href,
      title: document.title,
      headings,
      controls,
      navSections,
      visibleText: (document.body.innerText || '').trim().slice(0, 8000),
    };
  });

  const out = path.join(
    process.cwd(),
    'src/reports/application-new-page-exploration.json',
  );
  fs.writeFileSync(out, JSON.stringify(data, null, 2));
  await page.screenshot({
    path: path.join(process.cwd(), 'src/reports/application-new-page.png'),
    fullPage: true,
  });
  console.log('written', out);
  await browser.close();
}

main();
