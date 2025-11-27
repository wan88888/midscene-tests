import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 90 * 1000,
});

describe(
  'android integration',
  async () => {
    await it('Android settings page demo for scroll', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid,{
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch('');
      await agent.ai('Click Become a Member Now');
      await agent.ai('Click Gold');
      await agent.ai('Click Monthly Plan');
      await agent.ai('Click Subscribe button');
      await agent.aiAssert('User should see number management page with Dear Gold Member text');
      await agent.ai('Click the + button below Number1');
      await agent.ai('Click Search input field');
      await agent.ai('Click United States');
      await agent.ai('Enter 215 in Search input field');
      await agent.ai('Click the 1st search result');
      await agent.ai('Click the 1st search result');
      await agent.ai('Click the 1st number');
      await agent.ai('Click Get This Number');
      await agent.ai('Click Continue button');
    });
  },
  360 * 1000,
);
