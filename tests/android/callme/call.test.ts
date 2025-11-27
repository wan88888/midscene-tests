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

    await it('should make a phone call', async () => {
      const devices = await getConnectedDevices();
      agent = await agentFromAdbDevice(devices[0].udid, {
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch(process.env.ANDROID_CALLME_PACKAGE || '');
      await agent.ai('Click the middle keyboard button');
      await agent.ai('Enter phone number 6502234107');
      await agent.ai('Click the phone button on the keyboard');
      await agent.ai('Click the end call button');
      await agent.ai('Click the back button');
      await agent.aiAssert('Call history should appear in Call interface');
    });
  },
  360 * 1000,
);
