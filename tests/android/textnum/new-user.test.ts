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

      await agent.launch(process.env.ANDROID_TEXTNUM_PACKAGE || '');
      await agent.ai('Click Get a Number Now');
      await agent.ai('Click the close button in the top left corner');
      await agent.ai('Click No,Thanks');
      await agent.ai('Click Get Number');
      await agent.ai('Click Monthly');
      await agent.ai('Click CONTINUE');
      await agent.ai('Click Subscribe');
      await agent.ai('Click Browse by State');
      await agent.ai('Click United States');
      await agent.ai('Enter 213 in the search input field');
      await agent.ai('Click the 1st search result');
      await agent.ai('Click Done button');
      await agent.ai('Click the 1st number');
      await agent.ai('Click Get This Number');
      await agent.ai('Click Done button');
      await agent.ai('Click Accept button');
      await agent.ai('Click the close button in the top left corner');
      await agent.ai('Click While using the app');
      await agent.ai('Click Allow button');
      await agent.ai('Click Allow button');
    });
  },
  360 * 1000,
);
