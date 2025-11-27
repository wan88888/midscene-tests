import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi, afterAll } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

let agent: Awaited<ReturnType<typeof agentFromAdbDevice>> | null = null;

describe(
  'Android Player Tests',
  async () => {
    afterAll(async () => {
      await agent?.destroy();
    });

    await it('should play video as new user', async () => {
      const devices = await getConnectedDevices();
      agent = await agentFromAdbDevice(devices[0].udid, {
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch(process.env.ANDROID_PLAYER_PACKAGE || '');
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
