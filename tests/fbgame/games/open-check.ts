import type { Page } from 'playwright';
import type { PlaywrightAgent } from '@midscene/web/playwright';

const DEFAULT_LOAD_TIMEOUT_MS = Number(process.env.FBGAME_LOAD_TIMEOUT_MS) || 120_000;
const SLOW_LOAD_TIMEOUT_MS = Number(process.env.FBGAME_SLOW_LOAD_TIMEOUT_MS) || 180_000;
const DEFAULT_POLL_INTERVAL_MS = Number(process.env.FBGAME_LOAD_POLL_INTERVAL_MS) || 5_000;

/** Loading 较慢、容易在进度条阶段被误判的游戏，单独延长等待上限 */
export const SLOW_GAME_IDS = new Set([
  '695236792921542',
  '789422247367413',
  '1234884678503882',
  '815769244556049',
  '1420695239253089',
  '1641622857048797',
]);

export interface OpenCheckOptions {
  loadTimeoutMs?: number;
  pollIntervalMs?: number;
}

function loadTimeoutFor(gameId: string, override?: number): number {
  if (override !== undefined) return override;
  return SLOW_GAME_IDS.has(gameId) ? SLOW_LOAD_TIMEOUT_MS : DEFAULT_LOAD_TIMEOUT_MS;
}

const GAME_ENTERED_ASSERT = (gameId: string) =>
  [
    `Facebook Instant Game (ID ${gameId}) has fully loaded and is playable.`,
    'Requirements:',
    '- Launch page with "Play on Facebook" / "在 Facebook 上玩" is gone',
    '- NOT a full-screen advertisement (e.g. overlay with "Close ad" / "关闭广告")',
    '- NOT only a loading progress bar or spinner without game UI',
    '- Shows actual in-game content: gameplay, in-game menu, title screen, or start/play button inside the game canvas',
    '- NOT blank page, login page, or error page',
  ].join(' ');

async function waitForPageSettle(page: Page): Promise<void> {
  await page.waitForLoadState('load', { timeout: 60_000 }).catch(() => {});
  await page.waitForTimeout(3000);
}

async function dismissOverlays(agent: PlaywrightAgent): Promise<void> {
  await agent.ai(
    [
      'If any overlay blocks the game, dismiss it:',
      '- Full-screen ad: click "Close ad" or "关闭广告"',
      '- Permission/cookie popup: accept or dismiss',
      'If nothing to dismiss, do nothing.',
    ].join(' '),
  );
}

/** 轮询：先关广告 → 再断言；Loading 未完成会继续等，不会提前通过 */
async function pollUntilGameEntered(
  agent: PlaywrightAgent,
  page: Page,
  gameId: string,
  loadTimeoutMs: number,
  pollIntervalMs: number,
): Promise<void> {
  const deadline = Date.now() + loadTimeoutMs;
  let lastError: unknown;

  while (Date.now() < deadline) {
    await dismissOverlays(agent);
    try {
      await agent.aiAssert(GAME_ENTERED_ASSERT(gameId));
      return;
    } catch (err) {
      lastError = err;
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      await page.waitForTimeout(Math.min(pollIntervalMs, remaining));
    }
  }

  throw lastError ?? new Error(`游戏 ${gameId} 在 ${loadTimeoutMs / 1000}s 内未能进入（可能 Loading 未完成或广告未关闭）`);
}

/** 打开 Facebook Instant Game 并检查是否正常进入游戏 */
export async function checkGameOpens(
  agent: PlaywrightAgent,
  page: Page,
  gameId: string,
  gameUrl: string,
  options: OpenCheckOptions = {},
): Promise<void> {
  const loadTimeoutMs = loadTimeoutFor(gameId, options.loadTimeoutMs);
  const pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;

  await page.goto(gameUrl, { waitUntil: 'load', timeout: 60_000 });
  await waitForPageSettle(page);

  await dismissOverlays(agent);

  await agent.ai(
    'If the page shows a game launch screen with a "Play on Facebook" or "在 Facebook 上玩" button, click it to start loading the game. If the game is already loading or in-game, skip.',
  );

  await page.locator('iframe').first().waitFor({ state: 'attached', timeout: 60_000 }).catch(() => {});

  await pollUntilGameEntered(agent, page, gameId, loadTimeoutMs, pollIntervalMs);
}
