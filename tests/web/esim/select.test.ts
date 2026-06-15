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
  });

  afterAll(async () => {
    await session?.cleanup();
  });

  it('should select destination and buy', async () => {
    await agent.aiScroll({
      direction: 'up',
      distance: 100,
      scrollType: 'once',
    });
    await agent.ai('Click See all destination');
    await agent.ai('Click Australia');
    await agent.ai('Click the Buy button on the page');
  });
});
