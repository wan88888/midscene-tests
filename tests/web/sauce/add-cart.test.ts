import { describe, it, vi, beforeAll, afterAll } from 'vitest';
import { chromium, Browser } from 'playwright';
import { PlaywrightAgent } from '@midscene/web/playwright';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 240 * 1000,
  hookTimeout: 60 * 1000,
});

const inventoryUrl = 'https://www.saucedemo.com/inventory.html';
const authFile = path.join(process.cwd(), '.auth', 'sauce-user.json');

describe('Web Sauce Demo Tests', () => {
  let browser: Browser;
  let agent: PlaywrightAgent;

  beforeAll(async () => {
    // 检查登录状态文件是否存在
    if (!fs.existsSync(authFile)) {
      throw new Error(
        `登录状态文件不存在: ${authFile}\n` +
        `请先运行: npm run setup:sauce-auth`
      );
    }

    browser = await chromium.launch({
      headless: false,
      args: ['--start-maximized'],
    });
    
    // 使用保存的登录状态
    const context = await browser.newContext({
      viewport: null,
      storageState: authFile, // 加载保存的登录状态
    });
    
    const page = await context.newPage();
    // 直接访问商品页面（已登录状态）
    await page.goto(inventoryUrl);
    await page.waitForLoadState('networkidle');
    agent = new PlaywrightAgent(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should already be logged in', async () => {
    // Verify logged in state - ensure auth state saving works
    await agent.aiAssert('Page should contain Products text');
  });

  it('should add item to cart successfully', async () => {
    // Add item to cart - core shopping cart functionality
    await agent.ai('Click the Add to cart button for Sauce Labs Backpack');
    
    // Verify cart icon shows item count
    await agent.aiAssert('Shopping cart icon should display number 1');
  });
});

