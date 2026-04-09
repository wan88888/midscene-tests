import { describe, it, vi, beforeAll, afterAll } from 'vitest';
import { chromium, Browser } from 'playwright';
import { PlaywrightAgent } from '@midscene/web/playwright';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 600 * 1000,
  hookTimeout: 60 * 1000,
});

const pageUrl = 'http://192.168.10.76:7456';
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function playLevel(agent: PlaywrightAgent, maxRounds = 5) {
  for (let round = 0; round < maxRounds; round++) {
    try {
      await agent.ai(
        '观察顶部盒子的颜色，逐个点击游戏面板中所有与盒子同色的十字螺丝，一种颜色点完再点下一种',
      );
      await sleep(1500);
    } catch {
      break;
    }
  }

  await agent.aiWaitFor('出现EXCELLENT弹窗', { timeoutMs: 15000 });
  await sleep(1000);
  await agent.ai('点击EXCELLENT弹窗底部的蓝色按钮进入下一关');
  await sleep(2000);
}

describe('Screw Game Tests', () => {
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

  const levels = ['Level guide', ...Array.from({ length: 3 }, (_, i) => `Level ${i + 1}`)];

  it.each(levels)('should complete %s', async () => {
    await playLevel(agent);
  });
});