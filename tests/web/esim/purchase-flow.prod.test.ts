import { describe, it, vi, beforeAll, afterAll } from 'vitest';
import { PlaywrightAgent } from '@midscene/web/playwright';
import { launchAdsPower, type AdsPowerSession } from '@lib/adspower';
import { runPurchaseFlow } from './purchase-flow';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
  hookTimeout: 60 * 1000,
});

const pageUrl = 'https://esimnum.com';

describe('eSIM Purchase Flow (Production)', () => {
  let session: AdsPowerSession;
  let agent: PlaywrightAgent;

  beforeAll(async () => {
    session = await launchAdsPower({
      pageUrl,
      userId: process.env.ADSPOWER_ESIM_USER_ID,
      aiActionContext: 'If any cookie, location, or permission popup appears, click accept or dismiss it.',
    });
    agent = session.agent;
    await session.page.waitForTimeout(2500);
  });

  afterAll(async () => {
    await session?.cleanup();
  });

  it('should reach checkout page on production', async () => {
    await runPurchaseFlow(agent, { page: session.page, mode: 'checkout-only' });
  });
});
