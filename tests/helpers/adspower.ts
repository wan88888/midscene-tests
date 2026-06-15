import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { PlaywrightAgent } from '@midscene/web/playwright';

/**
 * 连接 AdsPower 浏览器进行自动化测试的公共封装。
 *
 * 背景：esim / fbgame 用 Playwright 直接启动浏览器需要登录 Google / Facebook，
 * 容易被风控，且每次都是未登录状态。改为连接「已手动登录」的 AdsPower 浏览器后，
 * 复用 AdsPower 持久化的 cookie/会话，每次打开都是已登录状态，编写用例时只需传入
 * pageUrl（和对应的 AdsPower 配置 ID）即可。
 *
 * 前置条件：
 * 1. 在 AdsPower 客户端里手动登录好对应账号（esim 用 Google，fbgame 用 Facebook）。
 * 2. AdsPower 设置 → 本地 API（Local API）已开启（默认端口 50325）。
 * 3. 在 .env 中配置好对应配置文件的 user_id。
 *
 * 注意（并发）：同一个 AdsPower 配置文件同一时刻只能打开一个实例。若多个测试文件
 * 复用同一个 user_id，请让它们串行执行（见仓库 vitest 配置 / README 说明），
 * 否则会互相抢占同一个浏览器实例导致不稳定。
 */

const ADSPOWER_API_BASE =
  process.env.ADSPOWER_API_URL?.replace(/\/$/, '') || 'http://local.adspower.net:50325';

const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
const DEFAULT_CONNECT_RETRIES = 3;
const DEFAULT_NAV_TIMEOUT_MS = 60_000;

export interface AdsPowerOptions {
  /** AdsPower 配置文件 ID（user_id）。不传则回退到 .env 的 ADSPOWER_USER_ID。 */
  userId?: string;
  /** AdsPower 配置文件序号（serial_number），与 userId 二选一。 */
  serialNumber?: string;
  /** 连接后要打开的页面地址。 */
  pageUrl?: string;
  /**
   * 是否复用浏览器中已存在的标签页（默认 true，复用 AdsPower 自带的第一个标签，
   * 避免多开一个标签）。设为 false 时强制新建标签页。
   */
  reuseTab?: boolean;
  /**
   * 跳转完成的判定条件（默认 'load'）。
   * 'networkidle' 在有长连接（websocket/轮询）的页面上可能永远不触发，需要时再用。
   */
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  /** 单次页面跳转的超时时间（毫秒），默认 60000。 */
  navigationTimeoutMs?: number;
  /** 传给 Midscene agent 的全局动作上下文，例如「遇到任何弹窗/权限请求就点同意」。 */
  aiActionContext?: string;
  /** 调用 AdsPower 本地 API 的超时时间（毫秒），默认 30000，避免接口卡死拖垮整个用例。 */
  requestTimeoutMs?: number;
  /** connectOverCDP 失败时的重试次数（默认 3），应对 start 后端点尚未就绪的瞬时失败。 */
  connectRetries?: number;
  /** 测试结束时是否调用 AdsPower 停止接口关闭浏览器（默认 true，释放内存）。 */
  stopOnCleanup?: boolean;
  /** 连接后是否最大化浏览器窗口（默认 true），保证桌面端布局一致。 */
  maximize?: boolean;
}

export interface AdsPowerSession {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  agent: PlaywrightAgent;
  /** 在 afterAll 中调用：断开 Playwright 连接，并按需停止 AdsPower 浏览器。 */
  cleanup: () => Promise<void>;
}

interface AdsPowerStartData {
  ws?: { selenium?: string; puppeteer?: string };
  debug_port?: string;
  webdriver?: string;
}

interface AdsPowerResponse<T> {
  code: number;
  data: T;
  msg: string;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function buildQuery(userId: string, serialNumber: string): URLSearchParams {
  const params = new URLSearchParams();
  if (userId) params.set('user_id', userId);
  if (serialNumber) params.set('serial_number', serialNumber);
  return params;
}

async function callAdsPower<T>(
  path: string,
  params: URLSearchParams,
  timeoutMs: number,
): Promise<AdsPowerResponse<T>> {
  const apiKey = process.env.ADSPOWER_API_KEY;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${ADSPOWER_API_BASE}${path}?${params.toString()}`, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`AdsPower 接口请求失败 (${path}): HTTP ${res.status}`);
    }
    return (await res.json()) as AdsPowerResponse<T>;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(
        `AdsPower 接口超时 (${path})：${timeoutMs}ms 内无响应，请确认 AdsPower 客户端已启动且本地 API 已开启。`,
      );
    }
    throw new Error(
      `AdsPower 接口请求失败 (${path}): ${err instanceof Error ? err.message : String(err)}（请确认 AdsPower 客户端正在运行）`,
    );
  } finally {
    clearTimeout(timer);
  }
}

async function connectWithRetry(wsEndpoint: string, retries: number): Promise<Browser> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await chromium.connectOverCDP(wsEndpoint);
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await sleep(500 * attempt);
      }
    }
  }
  throw new Error(
    `连接 AdsPower 浏览器失败（已重试 ${retries} 次）：${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
  );
}

/**
 * 启动（或连接到已运行的）AdsPower 浏览器，返回可直接用于 Midscene 的 agent。
 *
 * 用法示例：
 * ```ts
 * const session = await launchAdsPower({
 *   pageUrl: 'https://esimnum.com/home',
 *   userId: process.env.ADSPOWER_ESIM_USER_ID,
 * });
 * await session.agent.ai('Click Login button');
 * // afterAll:
 * await session.cleanup();
 * ```
 */
export async function launchAdsPower(options: AdsPowerOptions = {}): Promise<AdsPowerSession> {
  const userId = options.userId || process.env.ADSPOWER_USER_ID || '';
  const serialNumber = options.serialNumber || process.env.ADSPOWER_SERIAL_NUMBER || '';
  const requestTimeoutMs = options.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
  const connectRetries = options.connectRetries ?? DEFAULT_CONNECT_RETRIES;

  if (!userId && !serialNumber) {
    throw new Error(
      '缺少 AdsPower 配置文件标识：请传入 userId/serialNumber，或在 .env 中设置 ADSPOWER_USER_ID。',
    );
  }

  const query = buildQuery(userId, serialNumber);
  const startRes = await callAdsPower<AdsPowerStartData>(
    '/api/v1/browser/start',
    query,
    requestTimeoutMs,
  );
  if (startRes.code !== 0) {
    throw new Error(
      `AdsPower 启动浏览器失败：${startRes.msg}（请确认 AdsPower 已开启本地 API，且配置文件 ID 正确）`,
    );
  }

  const wsEndpoint = startRes.data?.ws?.puppeteer;
  if (!wsEndpoint) {
    throw new Error('AdsPower 未返回可用的调试端点（ws.puppeteer），请升级 AdsPower 或检查配置文件状态。');
  }

  const browser = await connectWithRetry(wsEndpoint, connectRetries);
  const context = browser.contexts()[0] ?? (await browser.newContext());

  // 默认复用 AdsPower 打开时自带的标签页，避免每次都多开一个新标签。
  const existingPages = context.pages();
  const page =
    options.reuseTab === false || existingPages.length === 0
      ? await context.newPage()
      : existingPages[0]!;

  await page.bringToFront().catch(() => {});

  // 最大化窗口，保证桌面端布局一致（避免窄窗口触发移动端/汉堡菜单导致断言不稳定）。
  // 注意：CDP 里 windowState:'maximized' 在部分内核上会静默失效，这里改用「读取屏幕
  // 工作区尺寸 + 显式设置 bounds」的方式，最稳妥。
  if (options.maximize !== false) {
    try {
      const cdp = await context.newCDPSession(page);
      const { windowId } = await cdp.send('Browser.getWindowForTarget');
      const screen = await page.evaluate(() => {
        const s = window.screen as Screen & { availLeft?: number; availTop?: number };
        return {
          left: s.availLeft ?? 0,
          top: s.availTop ?? 0,
          width: s.availWidth,
          height: s.availHeight,
        };
      });
      // 先切到 normal，避免窗口处于 minimized/maximized 时设置 bounds 被拒绝
      await cdp.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'normal' } });
      await cdp.send('Browser.setWindowBounds', {
        windowId,
        bounds: {
          left: screen.left,
          top: screen.top,
          width: screen.width,
          height: screen.height,
          windowState: 'normal',
        },
      });
      await cdp.detach().catch(() => {});
    } catch {
      // 某些环境不支持窗口控制，忽略即可
    }
  }

  if (options.pageUrl) {
    const navTimeout = options.navigationTimeoutMs ?? DEFAULT_NAV_TIMEOUT_MS;
    await page.goto(options.pageUrl, {
      waitUntil: options.waitUntil ?? 'load',
      timeout: navTimeout,
    });
  }

  const agent = new PlaywrightAgent(
    page,
    options.aiActionContext ? { aiActionContext: options.aiActionContext } : undefined,
  );

  const cleanup = async (): Promise<void> => {
    try {
      await browser.close();
    } catch {
      // 忽略断开连接时的异常
    }
    if (options.stopOnCleanup !== false) {
      try {
        await callAdsPower('/api/v1/browser/stop', buildQuery(userId, serialNumber), requestTimeoutMs);
      } catch {
        // 忽略停止接口异常（不影响测试结果）
      }
    }
  };

  return { browser, context, page, agent, cleanup };
}
