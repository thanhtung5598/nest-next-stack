const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const url = 'https://www.minhngoc.net.vn/';
  await page.goto(url);

  const lotteryData = await page.evaluate(() => {
    const data = [];
    const tables = document.querySelectorAll('.box_kqxs');

    tables.forEach((resultsBox) => {
      const dateElement = resultsBox.querySelector('.title a:last-child');
      const firstAnchorText = resultsBox.querySelector('.title a:first-child')?.innerText.trim();
      const isMienBac = firstAnchorText === 'KẾT QUẢ XỔ SỐ MIỀN BẮC';

      const date = dateElement ? dateElement.innerText : 'N/A';
      const lotteryResults = { date: `${firstAnchorText} ${date}`, provinces: [] };
      const provinceTables = resultsBox.querySelectorAll('table.rightcl');

      if (isMienBac) {
        const provinceData = { province: 'Miền Bắc', results: {} };

        const resultsTable = resultsBox.querySelector('table.bkqtinhmienbac');

        resultsTable.querySelectorAll('tr').forEach((row) => {
          const prizeClassElement = row.querySelector('td[class^="giai"]');
          const prizeNumberElements = row.querySelectorAll('.giaiSo');

          if (prizeClassElement && prizeNumberElements.length) {
            const prizeLevel = prizeClassElement.className.split('l')[0]; // e.g., "giai8", "giai7", etc.
            const prizeNumbers = [...prizeNumberElements].map((el) => el.getAttribute('data'));

            provinceData.results[prizeLevel] = prizeNumbers;
          }
        });

        lotteryResults.provinces.push(provinceData);
      } else {
        provinceTables.forEach((table) => {
          const provinceName = table.querySelector('.tinh').innerText.trim();
          const provinceData = { province: provinceName, results: {} };

          table.querySelectorAll('tr').forEach((row) => {
            const prizeClassElement = row.querySelector('td[class^="giai"]');

            if (prizeClassElement) {
              const prizeLevel = prizeClassElement.className.split(' ')[0]; // e.g., "giai8", "giai7", etc.
              const prizeNumbers = [...prizeClassElement.querySelectorAll('.giaiSo')].map((el) =>
                el.getAttribute('data'),
              );

              provinceData.results[prizeLevel] = prizeNumbers;
            }
          });

          lotteryResults.provinces.push(provinceData);
        });
      }

      data.push(lotteryResults);
    });

    return data;
  });

  const outputPath = './src/libs/lotteryResults.json';

  // Write the results to a JSON file
  fs.writeFileSync(outputPath, JSON.stringify(lotteryData, null, 2), 'utf-8');

  await browser.close();
})();
