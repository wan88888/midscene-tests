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
      await agent.ai('点击游戏icon');
      await sleep(3000);
      await agent.ai('Click Newford City');
      await sleep(20000);
      await agent.ai('点击Play按钮');
      await agent.ai('找到两幅图所有不同的地方');
    });
  },
  360 * 1000,
);
