import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 90 * 1000,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe(
  'android integration',
  async () => {
    await it('Saucelabs App Login Test', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid,{
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree.',
      });

      await agent.launch('com.swaglabsmobileapp/com.swaglabsmobileapp.MainActivity');
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