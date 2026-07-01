import { chromium, type Browser, type Page } from 'playwright';
import { PlaywrightAgent } from '@midscene/web/playwright';

/** 连接已手动打开并登录的 AdsPower 浏览器。前置：本地 API 已开启，窗口已最大化。 */
const API = process.env.ADSPOWER_API_URL?.replace(/\/$/, '') || 'http://local.adspower.net:50325';

export interface AdsPowerOptions {
  userId?: string;
  pageUrl: string;
  aiActionContext?: string;
  /** 设为 true 时测试结束关闭浏览器（默认保留窗口供下次复用） */
  stopOnCleanup?: boolean;
}

export interface AdsPowerSession {
  page: Page;
  agent: PlaywrightAgent;
  cleanup: () => Promise<void>;
}

async function adsApi(path: string, userId: string) {
  const key = process.env.ADSPOWER_API_KEY;
  const res = await fetch(`${API}${path}?user_id=${encodeURIComponent(userId)}`, {
    headers: key ? { Authorization: `Bearer ${key}` } : undefined,
  });
  if (!res.ok) throw new Error(`AdsPower HTTP ${res.status}`);
  const body = (await res.json()) as { code: number; msg: string; data: { ws?: { puppeteer?: string } } };
  if (body.code !== 0) throw new Error(`AdsPower: ${body.msg}`);
  return body.data;
}

async function connectCdp(endpoint: string): Promise<Browser> {
  for (let i = 0; i < 3; i++) {
    try {
      return await chromium.connectOverCDP(endpoint);
    } catch (err) {
      if (i === 2) throw err;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw new Error('connectOverCDP failed');
}

/** Chromium 148+ 下 browser.close() 会杀进程；只断开 WebSocket 则保留窗口。 */
async function disconnect(browser: Browser): Promise<void> {
  try {
    (browser as unknown as { _shouldCloseConnectionOnClose: boolean })._shouldCloseConnectionOnClose = true;
  } catch { /* ignore */ }
  await Promise.race([browser.close().catch(() => {}), new Promise((r) => setTimeout(r, 2000))]);
}

export async function launchAdsPower(options: AdsPowerOptions): Promise<AdsPowerSession> {
  const userId = options.userId || process.env.ADSPOWER_USER_ID || '';
  if (!userId) throw new Error('缺少 AdsPower userId（传参或 ADSPOWER_USER_ID）');

  const endpoint = (await adsApi('/api/v1/browser/start', userId)).ws?.puppeteer;
  if (!endpoint) throw new Error('AdsPower 未返回 ws.puppeteer');

  const browser = await connectCdp(endpoint);
  const context = browser.contexts()[0] ?? (await browser.newContext());
  const page = context.pages()[0] ?? (await context.newPage());
  await page.bringToFront().catch(() => {});
  await page.goto(options.pageUrl, { waitUntil: 'load', timeout: 60_000 });

  const agent = new PlaywrightAgent(
    page,
    options.aiActionContext ? { aiActionContext: options.aiActionContext } : undefined,
  );

  const cleanup = async () => {
    if (options.stopOnCleanup) {
      await browser.close().catch(() => {});
      await fetch(`${API}/api/v1/browser/stop?user_id=${encodeURIComponent(userId)}`).catch(() => {});
    } else {
      await disconnect(browser);
    }
  };

  return { page, agent, cleanup };
}
