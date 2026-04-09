import { describe, it, vi, beforeAll, afterAll } from 'vitest';
import { chromium, Browser } from 'playwright';
import { PlaywrightAgent } from '@midscene/web/playwright';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 600 * 1000,
  hookTimeout: 120 * 1000,
});

const pageUrl = 'https://192.168.10.48:8080';
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const GAME_PROMPT =
  '这是一个三消游戏（Match3），请严格按以下步骤操作：' +
  '1. 观察棋盘上所有彩色元素的分布；' +
  '2. 找到两个相邻的元素，交换后能使三个或更多同色元素连成一行或一列；' +
  '3. 优先选择能产生连锁消除（combo）或完成关卡目标的交换；' +
  '4. 执行交换：先点击第一个元素，再点击它旁边要交换的元素；' +
  '5. 等待消除动画完成后，继续寻找下一个可交换的位置；' +
  '6. 如果出现通关弹窗或胜利提示，点击继续/下一关按钮。' +
  '请尽可能多地执行有效交换，推进关卡目标。';

async function playLevel(agent: PlaywrightAgent, maxRounds = 10) {
  for (let round = 0; round < maxRounds; round++) {
    try {
      await agent.ai(GAME_PROMPT);
      await sleep(1500);
    } catch {
      break;
    }
  }
  await sleep(3000);
}

describe('Match3 Game Tests', () => {
  let browser: Browser;
  let agent: PlaywrightAgent;

  beforeAll(async () => {
    browser = await chromium.launch({
      headless: false,
      args: ['--start-maximized'],
    });
    const context = await browser.newContext({
      viewport: null,
      ignoreHTTPSErrors: true,
    });
    const page = await context.newPage();
    await page.goto(pageUrl);
    await page.waitForLoadState('networkidle');
    agent = new PlaywrightAgent(page);

    await sleep(3000);
    await agent.aiTap('Close');
    await sleep(1000);
    await page.mouse.click(500, 300);
    await sleep(3000);
    await agent.aiTap('红色星星');
    await sleep(3000);
    await agent.aiTap('Play');
    await sleep(3000);
  });

  afterAll(async () => {
    await browser?.close();
  });

  const levels = Array.from({ length: 2 }, (_, i) => `Level ${i + 1}`);

  it.each(levels)('should complete %s', async () => {
    await playLevel(agent);
  });
});
