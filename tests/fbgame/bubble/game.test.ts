import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi, afterAll } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

let agent: Awaited<ReturnType<typeof agentFromAdbDevice>> | null = null;

describe(
  'Facebook Bubble Game Tests',
  async () => {
    afterAll(async () => {
      await agent?.destroy();
    });

    await it('should play bubble game', async () => {
      const devices = await getConnectedDevices();
      agent = await agentFromAdbDevice(devices[0].udid, {
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree.',
      });

      await agent.launch(process.env.ANDROID_FACEBOOK_PACKAGE || '');
      await sleep(3000);
      await agent.ai('Click Game Tab');
      await agent.ai('Click Bubble Shooter game');
      await agent.ai('Wait for game to load');
      await agent.ai('Complete current round');
    });
  },
  360 * 1000,
);
