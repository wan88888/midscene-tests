import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

describe(
  'iOS TextNum Tests',
  async () => {
    await it('should make a phone call', async () => {
      const agent = await agentFromWebDriverAgent({
        aiActionContext:
          'If any location, permission, click agree.',
      });
      
      await agent.launch(process.env.IOS_TEXTNUM_BUNDLE_ID || '');          
      await agent.ai('Click Call Tab');
      await agent.ai('Click the keyboard button next to it');
      await agent.ai('Enter phone number 6502234107');
      await agent.ai('Click the phone button on the keyboard');
      await agent.ai('Click the end call button');
      await agent.ai('Click the back button');
      await agent.aiAssert('Call history should appear in Call interface');
    });
  },
  360 * 1000,
);