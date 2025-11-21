import { describe, it, expect, vi, beforeAll } from "vitest";
import { chromium } from "playwright";
import { PlaywrightAgent } from "@midscene/web/playwright";
import "dotenv/config";

vi.setConfig({
  testTimeout: 240 * 1000,
  hookTimeout: 60 * 1000,
});

const pageUrl = "https://www.saucedemo.com";
describe("Test Sauce Login", () => {
  let agent: PlaywrightAgent;

  beforeAll(async () => {
    const browser = await chromium.launch({
      headless: false,
      args: ["--start-maximized"],
    });
    const context = await browser.newContext({
      viewport: null, // 禁用默认视口，使用完整窗口大小
    });
    const page = await context.newPage();
    await page.goto(pageUrl);
    await page.waitForLoadState('networkidle');
    agent = new PlaywrightAgent(page);

    return () => {
      browser.close();
    };
  });

  it("ai sauce login", async () => {
    await agent.aiAction("Type standard_user in the username field");
    await agent.aiAction("Type secret_sauce in the password field");
    await agent.aiAction("Click the Login button");
    await agent.aiAssert("Page should contain Products text");
  });
});