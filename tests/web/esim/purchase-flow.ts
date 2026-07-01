import type { Page } from 'playwright';
import type { PlaywrightAgent } from '@midscene/web/playwright';

/** full：测试环境走完全流程；checkout-only：正式环境只验证到结账页（避免真实扣款） */
export type PurchaseFlowMode = 'full' | 'checkout-only';

export interface PurchaseFlowConfig {
  destination?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardZip?: string;
  mode?: PurchaseFlowMode;
  /** 传入 Playwright page，用于结账页/支付组件加载等待（避免 aiAssert 截到空白页） */
  page?: Page;
}

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`缺少环境变量 ${name}`);
  return value;
}

async function waitForCheckoutReady(page: Page): Promise<void> {
  await page.waitForLoadState('load', { timeout: 60_000 }).catch(() => {});
  await page.getByText('Select a payment method').waitFor({ state: 'visible', timeout: 60_000 });
  // Card / Alipay 等在 Stripe iframe 内，主页面 getByText('Card') 永远匹配不到
  await page.locator('iframe').first().waitFor({ state: 'attached', timeout: 60_000 }).catch(() => {});
  await page.waitForTimeout(10_000);
}

/** 支付后订单列表异步刷新，轮询刷新直到目标目的地订单出现在 Paid 列表 */
async function waitForPaidOrder(page: Page, destination: string, timeoutMs = 90_000): Promise<void> {
  await page.getByRole('heading', { name: 'My Orders' }).waitFor({ state: 'visible', timeout: 60_000 });
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const visible = await page
      .getByText(new RegExp(destination, 'i'))
      .first()
      .isVisible()
      .catch(() => false);
    if (visible) return;
    await page.reload({ waitUntil: 'load' });
    await page.getByRole('heading', { name: 'My Orders' }).waitFor({ state: 'visible', timeout: 30_000 });
    await page.getByText('Paid', { exact: true }).click().catch(() => {});
    await page.waitForTimeout(4000);
  }
  throw new Error(`等待 ${timeoutMs / 1000}s 后 Paid 列表仍未出现 ${destination} 订单`);
}

async function runToCheckout(
  agent: PlaywrightAgent,
  destination: string,
  page?: Page,
): Promise<void> {
  await agent.ai('If a cookie consent banner is visible, click Accept all');
  await agent.ai('Click the homepage search bar labeled "Choose your destination"');
  await agent.ai(`Type "${destination}" in the destination search field`);
  await agent.ai(`Click "${destination}" in the search results`);
  await agent.ai('On the destination page, select an available data plan');
  await agent.ai('Click the checkout button to go to the Secure checkout page');
  if (page) await waitForCheckoutReady(page);
  await agent.aiAssert(
    'Secure checkout page shows "Select a payment method" section and "Card" is available as a payment option',
  );
  await agent.aiAssert(`Order summary on checkout page shows a plan for ${destination} with a total price`);
}

async function runPayment(
  agent: PlaywrightAgent,
  config: PurchaseFlowConfig,
  destination: string,
): Promise<void> {
  const cardNumber = requireEnv(
    'ESIM_TEST_CARD_NUMBER',
    config.cardNumber ?? process.env.ESIM_TEST_CARD_NUMBER,
  );
  const cardExpiry = requireEnv(
    'ESIM_TEST_CARD_EXPIRY',
    config.cardExpiry ?? process.env.ESIM_TEST_CARD_EXPIRY,
  );
  const cardCvc = requireEnv('ESIM_TEST_CARD_CVC', config.cardCvc ?? process.env.ESIM_TEST_CARD_CVC);
  const cardZip = config.cardZip ?? process.env.ESIM_TEST_CARD_ZIP ?? '12345';
  const { page } = config;

  await agent.ai(
    'In "Select a payment method", click the "Card" row (card icon + Card label, below Alipay) to expand the card form',
  );
  if (page) await page.waitForTimeout(3000);
  await agent.ai(
    `In the Card information form, fill Card number ${cardNumber}, Expiration date ${cardExpiry}, Security code ${cardCvc}`,
  );
  await agent.ai(
    `Scroll down in the payment form if needed, then fill ZIP code ${cardZip}. Keep Country as United States if the Country field is visible.`,
  );
  await agent.ai('Click the Pay button to complete payment');
  if (page) {
    await page.waitForLoadState('load', { timeout: 60_000 }).catch(() => {});
    await waitForPaidOrder(page, destination);
  }
  await agent.aiAssert(
    `My Orders page is on the Paid tab and the order list includes a paid order for ${destination}`,
  );
}

/**
 * 购买流程：搜索 → 选目的地 → 选套餐 → 结账。
 * - checkout-only（正式环境）：到此为止，不支付
 * - full（测试环境）：继续填卡支付并验证 My Orders
 */
export async function runPurchaseFlow(
  agent: PlaywrightAgent,
  config: PurchaseFlowConfig = {},
): Promise<void> {
  const mode = config.mode ?? 'full';
  const destination = config.destination ?? process.env.ESIM_TEST_DESTINATION ?? 'Brazil';

  await runToCheckout(agent, destination, config.page);

  if (mode === 'checkout-only') return;

  await runPayment(agent, config, destination);
}
