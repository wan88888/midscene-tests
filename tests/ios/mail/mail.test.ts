import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

describe(
  'iOS Mail Tests',
  async () => {
    await it('should add a mail account', async () => {
      const agent = await agentFromWebDriverAgent({
        aiActionContext:
          'If any location, permission, click agree.',
      });
      
      await agent.launch(process.env.IOS_MAIL_BUNDLE_ID || '');          
      await agent.ai('Click Other');
      await agent.ai('Type test in the Name field');
      await agent.ai('Type test in the Description field');
    });
  },
  360 * 1000,
);