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
      await agent.ai('Click Message Tab');
      await agent.ai('Enter 6502234107 in the number input field');
      await agent.ai('Enter hey in the chat input field');
      await agent.ai('Click Send button');
      await agent.ai('Click the photo button at the bottom left');
      await agent.ai('Click Photos');
      await agent.ai('Select the 1st image');
      await agent.ai('Click rating popup close button');
      await agent.ai('Click the back button at the top left');
      await agent.ai('Click History Tab');
      await agent.ai('Click Message Tab');
      await agent.aiAssert('Chat record should appear in Message Tab');
    });
  },
  360 * 1000,
);
