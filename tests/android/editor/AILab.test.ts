import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 90 * 1000,
});

describe(
  'android integration',
  async () => {
    await it('Editor App for AILab', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid,{
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch('vidma.video.editor.videomaker/com.atlasv.android.mvmaker.mveditor.LaunchActivity');
      await agent.ai('点击AILab');
      await agent.ai('点击Text to Video');
      await agent.ai('在输入框输入文本：你也想翩翩起舞吗？');
      await agent.ai('点击底部生成按钮');
      await agent.ai('等待结果页出现');
      await agent.aiAssert('用户应该看到Creation Saved,Enjoy!!!文案');
      await agent.ai('点击Generate 1 More按钮');

      await agent.ai('点击Image to Video');
      await agent.ai('点击Upload images');
      await agent.ai('选择第1个图片');
      await agent.ai('点击Select style');
      await agent.ai('选择第2排第1个选项');
      await agent.ai('点击✅');
      await agent.ai('点击底部生成按钮');
      await agent.ai('等待结果页出现');
      await agent.aiAssert('用户应该看到Creation Saved,Enjoy!!!文案');
      await agent.ai('点击Generate 1 More按钮');

      await agent.ai('点击Text to Image');
      await agent.ai('在输入框输入文本：你也想翩翩起舞吗？');
      await agent.ai('点击Select style');
      await agent.ai('选择第2排第1个选项');
      await agent.ai('点击✅');
      await agent.ai('点击底部生成按钮');
      await agent.ai('等待结果页出现');
      await agent.aiAssert('用户应该看到Creation Saved,Enjoy!!!文案');
      await agent.ai('点击Generate 1 More按钮');

      await agent.ai('点击Image to Image');
      await agent.ai('点击Upload images');
      await agent.ai('选择第1个图片');
      await agent.ai('点击Select style');
      await agent.ai('选择第1排第2个选项');
      await agent.ai('点击✅');
      await agent.ai('点击底部生成按钮');
      await agent.ai('等待结果页出现');
      await agent.aiAssert('用户应该看到Creation Saved,Enjoy!!!文案');
      await agent.ai('点击Generate 1 More按钮');

      // await agent.aiScroll({
      //   direction: 'up',
      //   distance: 100,
      //   scrollType: 'once',
      // });
      await agent.ai('向上滑动1次');

      await agent.ai('点击AI Kiss');
      await agent.ai('点击第1个Upload images');
      await agent.ai('选择第1个图片');
      await agent.ai('点击第2个Upload images');
      await agent.ai('选择第2个图片');
      await agent.ai('点击Select style');
      await agent.ai('选择第1排第4个选项');
      await agent.ai('点击✅');
      await agent.ai('点击底部生成按钮');
      await agent.ai('等待结果页出现');
      await agent.aiAssert('用户应该看到Creation Saved,Enjoy!!!文案');
      await agent.ai('点击Generate 1 More按钮');

      await agent.ai('点击AI Group');
      await agent.ai('点击第1个Upload images');
      await agent.ai('选择第1个图片');
      await agent.ai('点击第2个Upload images');
      await agent.ai('选择第2个图片');
      await agent.ai('点击底部生成按钮');
      await agent.ai('等待结果页出现');
      await agent.aiAssert('用户应该看到Creation Saved,Enjoy!!!文案');
      await agent.ai('点击Generate 1 More按钮');
    });
  },
  360 * 1000,
);