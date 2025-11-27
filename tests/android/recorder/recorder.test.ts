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

      await agent.launch(process.env.ANDROID_RECORDER_PACKAGE || '');
      await agent.ai('Click Audio');
      await agent.ai('Click Internal Audio and Microphone');
      await agent.ai('Click the back button');
      await agent.ai('Click Video');
      await agent.ai('Click Resolution');
      await agent.ai('Click 1080P option');
      await agent.ai('Click Quality');
      await agent.ai('Click Excellent Quality');
      await agent.ai('Click FPS');
      await agent.ai('Click 120FPS option');
      await agent.ai('Click the back button');
      await agent.ai('Click the middle record button');
      await agent.ai('Click Start now');
      await agent.ai('Pull down notification bar');
      await agent.launch(process.env.ANDROID_YOUTUBE_PACKAGE || '');
      await agent.launch(process.env.ANDROID_RECORDER_PACKAGE || '');
      await agent.ai('Click the 1st video');
      await agent.launch(process.env.ANDROID_RECORDER_PACKAGE || '');
      await agent.ai('Click the end recording button');
      await agent.ai('Click the close button on result page');
    });
  },
  360 * 1000,
);
