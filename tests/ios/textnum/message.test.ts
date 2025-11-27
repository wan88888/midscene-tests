import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

describe(
  'iOS TextNum Tests',
  async () => {
    await it('should send a message', async () => {
      const agent = await agentFromWebDriverAgent({
        aiActionContext:
          'If any location, permission, click agree.',
      });
      
      await agent.launch(process.env.IOS_TEXTNUM_BUNDLE_ID || '');          
      await agent.ai('Click the new button next to it');
      await agent.ai('Enter 6502234107 in the number input field');
      await agent.ai('Enter hey in the chat input field');
      await agent.ai('Click Send button');
      await agent.ai('Click the attachment button at the bottom left');
      await agent.ai('Click Photo');
      await agent.ai('Select the 1st image');
      await agent.ai('Click the emoji button at the bottom left');
      await agent.ai('Select the 1st emoji');
      await agent.ai('Click the back button');
      await agent.aiAssert('Chat record should appear in Message interface');
    });
  },
  360 * 1000,
);