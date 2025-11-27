import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 90 * 1000,
});

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

describe(
  'ios integration',
  async () => {
    await it('Saucelabs App Login Test', async () => {
      const agent = await agentFromWebDriverAgent({
        aiActionContext:
          'If any location, permission, click agree.',
      });
      
      await agent.launch(process.env.IOS_EDITOR_BUNDLE_ID || '');          
      await agent.ai('Click New Project');
      await agent.ai('Click Allow Access to All Photos');
      await agent.ai('Select the 1st video');
      await agent.ai('Click Next button');
      await agent.ai('Click the close button');
      await agent.ai('Click Next button');
      await agent.ai('Click Got it！');
      await agent.ai('Click Effects');
      await agent.ai('Select Strobe effect');
      await agent.ai('Click ✅');
      await agent.ai('Click blank area');
      await agent.ai('Click Text');
      await agent.ai('Click Add');
      await agent.ai('Select Ripples');
      await agent.ai('Click Aa');
      await agent.ai('Select the 2nd option');
      await agent.ai('Click ✅');
      await agent.ai('Click blank area');
      await agent.ai('Swipe the bottom toolbar');
      await agent.ai('Click Filter');
      await agent.ai('Select PO3 filter');
      await agent.ai('Click ✅');
      await agent.ai('Click Export button');
      await agent.ai('Click Export button');
      await agent.ai('Wait for progress bar to reach 100%');
      await agent.ai('Wait for rating popup to appear');
      await agent.ai('Click Not Now');
      await agent.ai('Click the close button');
      await agent.ai('Click the Home button in the top right corner');
    });
  },
  360 * 1000,
);