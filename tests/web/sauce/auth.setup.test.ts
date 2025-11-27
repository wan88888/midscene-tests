import { describe, it, vi, beforeAll } from 'vitest';
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 240 * 1000,
  hookTimeout: 60 * 1000,
});

const pageUrl = 'https://www.saucedemo.com';
const inventoryUrl = 'https://www.saucedemo.com/inventory.html';
const authFile = path.join(process.cwd(), '.auth', 'sauce-user.json');

describe('Web Sauce Auth Setup', () => {
  beforeAll(async () => {
    // 确保 .auth 目录存在
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
  });

  it('should login and save auth state', async () => {
    const browser = await chromium.launch({
      headless: false,
      args: ['--start-maximized'],
    });

    const context = await browser.newContext({
      viewport: null,
    });
    const page = await context.newPage();

    try {
      // 访问登录页
      await page.goto(pageUrl);
      await page.waitForLoadState('networkidle');
      
      // 执行登录
      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.click('[data-test="login-button"]');
      
      // 等待跳转到商品页面
      await page.waitForURL(inventoryUrl);
      await page.waitForLoadState('networkidle');
      
      // 验证登录成功
      const productsTitle = await page.locator('.title').textContent();
      if (productsTitle !== 'Products') {
        throw new Error(`登录失败: 期望看到 'Products'，实际看到 '${productsTitle}'`);
      }
      
      // 保存登录状态（在 inventory.html 页面保存）
      await context.storageState({ path: authFile });
      console.log(`✓ 登录成功，状态已保存到: ${authFile}`);
    } finally {
      await browser.close();
    }
  });
});