import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 90 * 1000,
});

describe(
  'android integration',
  async () => {
    await it('Editor App for Create', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid,{
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch('vidma.video.editor.videomaker/com.atlasv.android.mvmaker.mveditor.LaunchActivity');
      await agent.ai('点击New Project');
      await agent.ai('点击Allow all');
      await agent.ai('选择第1个视频');
      await agent.ai('点击Next按钮');
      await agent.ai('点击NEXT');
      await agent.ai('点击OK');
      await agent.ai('点击Effect');
      await agent.ai('选择Strobe特效');
      await agent.ai('点击✅');
      await agent.ai('点击✅');
      await agent.ai('点击Text');
      await agent.ai('点击Add Text');
      await agent.ai('选择Ripples');
      await agent.ai('点击Aa');
      await agent.ai('选择第2个选项');
      await agent.ai('点击✅');
      await agent.ai('点击空白位置');
      await agent.aiScroll(
        { direction: 'left', distance: 100, scrollType: 'once' },
        '轨道区域',
      );
      await agent.ai('点击Filter');
      await agent.ai('选择PO3滤镜');
      await agent.ai('点击✅');
      await agent.ai('点击Export按钮');
      await agent.ai('点击EXPORT');
      await agent.ai('点击广告页面关闭按钮');
      await agent.ai('关闭评星弹窗');
      await agent.ai('点击右上角Home按钮');
      await agent.aiAssert('用户应该回到Mine页面即页面存在Creation文案');
    });
  },
  360 * 1000,
);
