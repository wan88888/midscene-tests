import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 90 * 1000,
});

describe(
  'android integration',
  async () => {
    await it('Editor App for first launch test', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid,{
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch('vidma.video.editor.videomaker/com.atlasv.android.mvmaker.mveditor.LaunchActivity');
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
