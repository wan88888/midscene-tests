import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi, afterAll } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

let agent: Awaited<ReturnType<typeof agentFromAdbDevice>> | null = null;

describe(
  'Android CallMe Tests',
  async () => {
    afterAll(async () => {
      await agent?.destroy();
    });

    await it('should send a message', async () => {
      const devices = await getConnectedDevices();
      agent = await agentFromAdbDevice(devices[0].udid, {
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch(process.env.ANDROID_CALLME_PACKAGE || '');
      await agent.ai('Click Message Tab');
      await agent.ai('Click the new chat button');
      await agent.ai('Enter 6502234107 in the number input field');
      await agent.ai('Enter hello in the chat input field');
      await agent.ai('Click Send button');
      await agent.ai('Click the + button at the bottom left');
      await agent.ai('Click Add From Photos');
      await agent.ai('Select the 1st image');
      await agent.ai('Click the back button at the top left');
      await agent.aiAssert('Chat record should appear in Message interface');
    });
  },
  360 * 1000,
);
