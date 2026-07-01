import { describe, it, vi, beforeAll, afterAll } from 'vitest';
import { PlaywrightAgent } from '@midscene/web/playwright';
import { launchAdsPower, type AdsPowerSession } from '@lib/adspower';
import { checkGameOpens } from './open-check';
import { GAME_URLS, gamePlayUrl } from './urls';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 180 * 1000,
  hookTimeout: 60 * 1000,
});

describe('Facebook Instant Games Open Check', () => {
  let session: AdsPowerSession;
  let agent: PlaywrightAgent;

  beforeAll(async () => {
    session = await launchAdsPower({
      userId: process.env.ADSPOWER_FBGAME_USER_ID,
      aiActionContext:
        'If any location, permission, cookie, or notification popup appears, click accept or dismiss it.',
    });
    agent = session.agent;
  });

  afterAll(async () => {
    await session?.cleanup();
  });

  it.each(GAME_URLS)('game %s should open normally', async (gameId) => {
    await checkGameOpens(agent, session.page, gameId, gamePlayUrl(gameId));
  }, 360_000);
});
