import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

describe(
  'iOS TextNum Tests',
  async () => {
    await it('should buy a phone number', async () => {
      const agent = await agentFromWebDriverAgent({
        aiActionContext:
          'If any location, permission, click agree.',
      });
      
      await agent.launch(process.env.IOS_TEXTNUM_BUNDLE_ID || '');          
      await agent.ai('Click Settings Tab');
      await agent.ai('Click New Number area');
      await agent.ai('Click Browse by State');
      await agent.ai('Click United States');
      await agent.ai('Enter 213 in Search input field');
      await agent.ai('Click the search result that appears');
      await agent.ai('Click Done button');
      await agent.ai('Select the 1st number');
      await agent.ai('Click Get This Number button');
      await agent.ai('Click Monthly');
      await agent.ai('Wait for purchase popup to appear');
      await agent.ai('Click Subscribe button');
      await agent.ai('Enter Text0402 in Password input field');
      await agent.ai('Click OK button');
      await agent.ai('Wait for rating popup to appear');
      await agent.ai('Click Not Now');
      await agent.ai('Click Done');
      await agent.aiAssert('User should see the purchased number');
    });
  },
  360 * 1000,
);