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
      await agent.ai('Click Call Tab');
      await agent.ai('Enter phone number 6502234107');
      await agent.ai('Click the phone button on the keyboard');
      await agent.ai('Click the end call button');
      await agent.ai('Click History Tab');
      await agent.aiAssert('Call history should appear in Call Tab');
    });
  },
  360 * 1000,
);
