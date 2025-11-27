import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi, afterAll } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

let agent: Awaited<ReturnType<typeof agentFromAdbDevice>> | null = null;

describe(
  'Android Recorder Tests',
  async () => {
    afterAll(async () => {
      await agent?.destroy();
    });

    await it('should complete new user onboarding', async () => {
      const devices = await getConnectedDevices();
      agent = await agentFromAdbDevice(devices[0].udid, {
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch(process.env.ANDROID_RECORDER_PACKAGE || '');
      await agent.ai('Click CONTINUE button');
      await agent.ai('Click Submit button');
      await agent.ai('Click ALLOW');
      await agent.ai('Click the switch on the right side of Vidma Recorder');
      await agent.ai('Click the back button in the top left corner');
      await agent.ai('Click month option');
      await agent.ai('Click CONTINUE button');
      await agent.ai('Click Subscribe button');
      await agent.aiAssert('PURCHASED text should appear on the page');
      await agent.ai('Click the close button in the top left corner');
      await agent.ai('Click blank area');
      await agent.ai('Click ALLOW button');
      await agent.ai('Click Allow all');
      await agent.ai('Click ALLOW button');
      await agent.ai('Click Allow button');
      await agent.ai('Click blank area');
      await agent.ai('Click blank area');
      await agent.ai('Click Got it');
      await agent.ai('Click the middle record button');
      await agent.ai('Click While using the app');
      await agent.ai('Click Start now');
      await agent.ai('Pull down notification bar');
      await agent.ai('Click Stop button');
      await agent.ai('Close rating popup');
      await agent.ai('Click the play button on result page');
      await agent.ai('Click the back button');
    });
  },
  360 * 1000,
);
