const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const viewports = [390, 768, 1024, 1280, 1440, 1920];

  for (const width of viewports) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    const result = await page.evaluate(() => {
      const inner = document.querySelector('.bottom-nav__inner');
      const container = document.querySelector('.container');
      const navItems = document.querySelectorAll('.nav-item');
      const firstItem = navItems[0];
      const lastItem = navItems[navItems.length - 1];

      const innerRect = inner.getBoundingClientRect();
      const containerRect = container ? container.getBoundingClientRect() : null;
      const firstRect = firstItem.getBoundingClientRect();
      const lastRect = lastItem.getBoundingClientRect();

      return {
        viewportWidth: window.innerWidth,
        innerLeft: Math.round(innerRect.left),
        innerRight: Math.round(innerRect.right),
        innerWidth: Math.round(innerRect.width),
        containerLeft: containerRect ? Math.round(containerRect.left) : null,
        containerRight: containerRect ? Math.round(containerRect.right) : null,
        containerWidth: containerRect ? Math.round(containerRect.width) : null,
        firstItemLeft: Math.round(firstRect.left),
        lastItemRight: Math.round(lastRect.right),
        aligned: containerRect
          ? Math.abs(innerRect.left - containerRect.left) < 1 &&
            Math.abs(innerRect.right - containerRect.right) < 1
          : null,
      };
    });

    console.log(`\nViewport ${width}px:`);
    console.log(`  Container: left=${result.containerLeft} right=${result.containerRight} width=${result.containerWidth}`);
    console.log(`  Nav inner: left=${result.innerLeft} right=${result.innerRight} width=${result.innerWidth}`);
    console.log(`  First item left: ${result.firstItemLeft}, Last item right: ${result.lastItemRight}`);
    console.log(`  Aligned: ${result.aligned}`);

    await page.close();
  }

  await browser.close();
})();
