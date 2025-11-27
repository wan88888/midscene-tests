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

      await agent.launch('com.facebook.katana/com.facebook.katana.LoginActivity');
      await sleep(3000);
      await agent.ai('Click Game Tab');
      await agent.ai('Click Solitaire game');
      await agent.ai('Wait for game to load');
      await agent.ai('Complete current round');
    });
  },
  360 * 1000,
);