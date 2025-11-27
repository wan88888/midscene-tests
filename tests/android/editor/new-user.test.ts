import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

describe(
  'Android Editor Tests',
  async () => {
    await it('should complete first launch onboarding', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid,{
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch(process.env.ANDROID_EDITOR_PACKAGE || '');
      await agent.ai('Click NEXT');
      await agent.ai('Click NEXT');
      await agent.ai('Click NEXT');
      await agent.aiAssert('User should see the onboarding purchase page with Vidma Club Elite text');
      await agent.ai('Click the close button');
      await agent.aiAssert('User should see the retention purchase page with TODAY text');
      await agent.ai('Click the close button');
      await agent.aiAssert('User should see the home page with New Project button');
    });
  },
  360 * 1000,
);
