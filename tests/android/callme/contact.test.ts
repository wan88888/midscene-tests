import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

describe(
  'Android CallMe Tests',
  async () => {
    await it('should add a new contact', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid,{
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch(process.env.ANDROID_CALLME_PACKAGE || '');
      await agent.ai('Click Contact Tab');
      await agent.ai('Click the new contact button');
      await agent.ai('Click the avatar area');
      await agent.ai('Click Add From Photos');
      await agent.ai('Select the 1st image');
      await agent.ai('Enter Lucy in First Name input field');
      await agent.ai('Enter 6502234107 in Phone Number input field');
      await agent.ai('Click the save button in the top right corner');
      await agent.aiAssert('Contact record should appear in From App Tab');
    });
  },
  360 * 1000,
);
