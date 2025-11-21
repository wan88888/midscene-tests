import { describe, it, vi, beforeAll } from "vitest";
import { chromium, Page } from "playwright";
import { PlaywrightAgent } from "@midscene/web/playwright";
import path from "path";
import fs from "fs";
import "dotenv/config";

vi.setConfig({
  testTimeout: 240 * 1000,
  hookTimeout: 60 * 1000,
});

const pageUrl = "https://esimnum.com/home";
const authFile = path.join(process.cwd(), '.auth', 'esim-user.json');

describe("Setup eSIM Auth", () => {
  beforeAll(async () => {
    // Ensure .auth directory exists
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
  });

  it("should login with google and save auth state", async () => {
    const browser = await chromium.launch({
      headless: false,
      args: ["--start-maximized"],
    });

    const context = await browser.newContext({
      viewport: null,
    });
    const page = await context.newPage();
    const agent = new PlaywrightAgent(page);

    try {
      await page.goto(pageUrl);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      await agent.ai("Click Login button");
      await agent.ai("Click Continue with Google");
      await page.waitForTimeout(3000);
      
      // Google login - read credentials from environment variables
      const googleEmail = process.env.GOOGLE_EMAIL;
      const googlePassword = process.env.GOOGLE_PASSWORD;
      
      if (!googleEmail || !googlePassword) {
        throw new Error('GOOGLE_EMAIL and GOOGLE_PASSWORD must be set in .env file');
      }
      
      await page.fill('input[type="email"]', googleEmail);
      await page.waitForTimeout(500);
      await page.click('button:has-text("下一步"), button:has-text("Next")');
      await page.waitForTimeout(3000);
      await page.fill('input[type="password"]', googlePassword);
      await page.waitForTimeout(500);
      await page.click('button:has-text("下一步"), button:has-text("Next")');
      await page.waitForTimeout(30000);
      
      await context.storageState({ path: authFile });
      console.log(`✓ Auth state saved to: ${authFile}`);
    } finally {
      await browser.close();
    }
  });
});