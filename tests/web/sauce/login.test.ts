import { describe, it, vi, beforeAll } from "vitest";
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
      viewport: null,
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
    await agent.ai("Type standard_user in the Username field");
    await agent.ai("Type secret_sauce in the Password field");
    await agent.ai("Click the Login button");
    await agent.aiAssert("Page should contain Products text");
  });
});