import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

describe(
  'Android Downloader Tests',
  async () => {
    await it('should download a video as new user', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid,{
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch(process.env.ANDROID_DOWNLOADER_PACKAGE || '');
      await agent.ai('Click Allow');
      await agent.ai('Click the close button');
      await agent.ai('Click the VIP button at the top');
      await agent.ai('Click Monthly Access');
      await agent.ai('Click 7 Days Free Trial button');
      await agent.ai('Click the purchase button');
      await agent.ai('Enter pornhub.com in the input field');
      await agent.ai('Click Enter button');
      await agent.ai('Click the 1st video');
      await agent.ai('Wait for the floating button to light up');
      await agent.ai('Click the floating download button');
      await agent.ai('Select 720p');
      await agent.ai('Click Download button');
      await agent.ai('Click the close button in the top right corner');
      await agent.ai('Click the Home button at the bottom');
    });
  },
  360 * 1000,
);
