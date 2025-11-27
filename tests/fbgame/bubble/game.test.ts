import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

describe(
  'Facebook Bubble Game Tests',
  async () => {
    await it('should play bubble game', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid,{
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree.',
      });

      await agent.launch(process.env.IOS_EDITOR_BUNDLE_ID || '');
      await sleep(3000);
      await agent.ai('Type standard_user in the Username field');
      await agent.ai('Type secret_sauce in the Password field');
      await agent.ai('Click the LOGIN button');
      await sleep(2000);
      await agent.aiAssert('Page should contain PRODUCTS text');
    });
  },
  360 * 1000,
);