import { describe, it, vi, beforeAll, afterAll } from 'vitest';
import { chromium, Browser } from 'playwright';
import { PlaywrightAgent } from '@midscene/web/playwright';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 240 * 1000,
  hookTimeout: 60 * 1000,
});

const pageUrl = 'https://esimnum.com/home';

describe('Web eSIM Tests', () => {
  let browser: Browser;
  let agent: PlaywrightAgent;

  beforeAll(async () => {
    browser = await chromium.launch({
      headless: false,
      args: ['--start-maximized'],
    });
    const context = await browser.newContext({
      viewport: null,
    });
    const page = await context.newPage();
    await page.goto(pageUrl);
    await page.waitForLoadState('networkidle');
    agent = new PlaywrightAgent(page);
  });

  afterAll(async () => {
    await browser?.close();
  });

  it('should login with Google', async () => {
    await agent.ai('Click Login button');
    await agent.ai('Click Continue with Google');
  });
});
