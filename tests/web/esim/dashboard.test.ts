import { describe, it, vi, beforeAll, afterAll } from "vitest";
import { chromium, Browser } from "playwright";
import { PlaywrightAgent } from "@midscene/web/playwright";
import path from "path";
import fs from "fs";
import "dotenv/config";

vi.setConfig({
  testTimeout: 240 * 1000,
  hookTimeout: 60 * 1000,
});

const dashboardUrl = "https://esimnum.com/home";
const authFile = path.join(process.cwd(), '.auth', 'esim-user.json');

describe("Test eSIM Dashboard", () => {
  let browser: Browser;
  let agent: PlaywrightAgent;

  beforeAll(async () => {
    // Check if auth state file exists
    if (!fs.existsSync(authFile)) {
      throw new Error(
        `Auth state file not found: ${authFile}\n` +
        `Please run: npm run setup:esim-auth`
      );
    }

    browser = await chromium.launch({
      headless: false,
      args: ["--start-maximized"],
    });
    
    // Use saved auth state
    const context = await browser.newContext({
      viewport: null,
      storageState: authFile, // Load saved auth state
    });
    
    const page = await context.newPage();
    // Access dashboard directly with logged-in state
    await page.goto(dashboardUrl);
    await page.waitForLoadState('networkidle');
    agent = new PlaywrightAgent(page);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should already be logged in", async () => {
    // Verify logged in state - ensure auth state saving works
    await agent.ai("在输入框输入Brazil");
  });

  // it("should display user information", async () => {
  //   // Verify user info is displayed
  //   await agent.aiAssert("Page should contain user email wanyuan@atlasv.com");
  // });
});

