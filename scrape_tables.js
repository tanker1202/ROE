const { chromium } = require('playwright');

const seeds = Array.from({ length: 10 }, (_, i) => 33 + i);
const urls = seeds.map(seed => `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  for (const url of urls) {
    console.log(`Processing ${url}`);
    await page.goto(url);

    // Wait for table(s) to load
    await page.waitForSelector('table');

    // Evaluate all table cell values
    const sum = await page.$$eval('table td', cells => {
      return cells.reduce((acc, td) => {
        const num = parseFloat(td.textContent.trim());
        return acc + (isNaN(num) ? 0 : num);
      }, 0);
    });

    console.log(`Sum for ${url}: ${sum}`);
    grandTotal += sum;
  }

  console.log(`✅ Total sum across all tables: ${grandTotal}`);
  await browser.close();
})();
