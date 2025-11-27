import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

describe(
  'Android Recorder Tests',
  async () => {
    await it('should edit a recording', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid,{
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch(process.env.ANDROID_RECORDER_PACKAGE || '');
      await agent.ai('Click the edit button of the 1st recording');
      await agent.ai('Click blank area');
      await agent.ai('Click the close button at the top');
      await agent.ai('Click Crop');
      await agent.ai('Click 1:1 option');
      await agent.ai('Click ✅');
      await agent.ai('Click Filter');
      await agent.ai('Click F2 option');
      await agent.ai('Click ✅');
      await agent.ai('Click Text');
      await agent.ai('Click + button');
      await agent.ai('Enter hello text');
      await agent.ai('Click ✅');
      await agent.ai('Swipe left 1 time');
      await agent.ai('Click Sticker');
      await agent.ai('Select the 1st emoji');
      await agent.ai('Click ✅');
      await agent.ai('Swipe left 1 time');
      await agent.ai('Click Rotate');
      await agent.ai('Click Speed');
      await agent.ai('Click 2x');
      await agent.ai('Click ✅');
      await agent.ai('Click Save button');
      await agent.ai('Wait for progress to reach 100%');
      await agent.ai('Click Done button');
      await agent.aiAssert('VIDEO should show video with New tag');
    });
  },
  360 * 1000,
);
