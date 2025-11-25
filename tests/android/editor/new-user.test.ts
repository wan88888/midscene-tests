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
      await agent.ai('点击NEXT');
      await agent.ai('点击NEXT');
      await agent.ai('点击NEXT');
      await agent.aiAssert('用户应该可以看到开屏导购页即页面存在Vidma Club Elite文案');
      await agent.ai('点击关闭按钮');
      await agent.aiAssert('用户应该可以看到挽回导购页即页面存在TODAY文案');
      await agent.ai('点击关闭按钮');
      await agent.aiAssert('用户应该看到首页即页面存在New Project按钮');
    });
  },
  360 * 1000,
);
