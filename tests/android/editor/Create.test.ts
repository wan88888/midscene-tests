import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

describe(
  'Android Editor Tests',
  async () => {
    await it('should create a new project', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid,{
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch(process.env.ANDROID_EDITOR_PACKAGE || '');
      await agent.ai('Click New Project');
      await agent.ai('Click Allow all');
      await agent.ai('Select the 1st video');
      await agent.ai('Click Next button');
      await agent.ai('Click NEXT');
      await agent.ai('Click OK');
      await agent.ai('Click Effect');
      await agent.ai('Select Strobe effect');
      await agent.ai('Click ✅');
      await agent.ai('Click ✅');
      await agent.ai('Click Text');
      await agent.ai('Click Add Text');
      await agent.ai('Select Ripples');
      await agent.ai('Click Aa');
      await agent.ai('Select the 2nd option');
      await agent.ai('Click ✅');
      await agent.ai('Click blank area');
      await agent.aiScroll(
        { direction: 'left', distance: 100, scrollType: 'once' },
        'Track area',
      );
      await agent.ai('Click Filter');
      await agent.ai('Select PO3 filter');
      await agent.ai('Click ✅');
      await agent.ai('Click Export button');
      await agent.ai('Click EXPORT');
      await agent.ai('Click ad page close button');
      await agent.ai('Close rating popup');
      await agent.ai('Click the Home button in the top right corner');
      await agent.aiAssert('User should return to Mine page with Creation text');
    });
  },
  360 * 1000,
);
