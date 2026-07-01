import { describe, it, vi, beforeAll, afterAll } from 'vitest';
import { PlaywrightAgent } from '@midscene/web/playwright';
import { launchAdsPower, type AdsPowerSession } from '@lib/adspower';
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

  it('should search and buy eSIM', async () => {
    await agent.ai('Type Brazil in the search bar');
    await agent.ai('Click on the search result that appears');
    await agent.ai('Click the Buy button on the page');
  });
});
