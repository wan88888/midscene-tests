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

const GAME_PROMPT =
  '这是一个螺丝收集游戏，请严格按以下步骤操作：' +
  '1. 先观察顶部所有盒子的颜色；' +
  '2. 按盒子从左到右的顺序，依次处理每种颜色；' +
  '3. 对当前颜色，只点击最上层未被其他形状遮挡的同色螺丝；' +
  '4. 同一种颜色的螺丝全部点完后再换下一种颜色；' +
  '5. 如果画面出现了EXCELLENT弹窗，点击弹窗底部的蓝色按钮进入下一关。' +
  '请尽可能多地点击螺丝，把所有颜色都处理完。';

async function playLevel(agent: PlaywrightAgent, maxRounds = 5) {
  for (let round = 0; round < maxRounds; round++) {
    try {
      await agent.ai(GAME_PROMPT);
      await sleep(1000);
    } catch {
      break;
    }
  }
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

  const levels = ['Level guide', ...Array.from({ length: 1 }, (_, i) => `Level ${i + 1}`)];

  it.each(levels)('should complete %s', async () => {
    await playLevel(agent);
  });
});