import { describe, it, vi, beforeAll, afterAll } from 'vitest';
import { PlaywrightAgent } from '@midscene/web/playwright';
import { launchAdsPower, type AdsPowerSession } from '../../helpers/adspower';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 240 * 1000,
  hookTimeout: 60 * 1000,
});

const pageUrl = 'https://esimnum.com/home';

describe('Web eSIM Tests', () => {
  let session: AdsPowerSession;
  let agent: PlaywrightAgent;

  beforeAll(async () => {
    session = await launchAdsPower({
      pageUrl,
      userId: process.env.ADSPOWER_ESIM_USER_ID,
    });
    agent = session.agent;
    // 登录态的账号信息是登录校验完成后异步渲染的，稍等渲染稳定再断言
    await session.page.waitForTimeout(2500);
  });

  afterAll(async () => {
    await session?.cleanup();
  });

  it('should already be logged in', async () => {
    await agent.aiAssert(
      '当前用户已处于登录状态：页面能看到已登录的账号信息（账号邮箱或账号头像/菜单），而不是 Login / Sign in 登录入口',
    );
  });
});
