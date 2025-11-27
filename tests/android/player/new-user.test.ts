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
      await agent.ai('Click Allow all');
      await agent.ai('Click the 1st video in the video list');
      await agent.ai('Click Skip');
      await agent.ai('Click blank area');
      await agent.ai('Click next video');
      await agent.ai('Click the back button');
      await agent.ai('Close rating popup');
    });
  },
  360 * 1000,
);
