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

      await agent.launch('');
      await agent.ai('点击第1个录屏的编辑按钮');
      await agent.ai('点击空白位置');
      await agent.ai('点击顶部关闭按钮');
      await agent.ai('点击Crop');
      await agent.ai('点击1:1选项');
      await agent.ai('点击✅');
      await agent.ai('点击Filter');
      await agent.ai('点击F2选项');
      await agent.ai('点击✅');
      await agent.ai('点击Text');
      await agent.ai('点击+按钮');
      await agent.ai('输入hello文本');
      await agent.ai('点击✅');
      await agent.ai('向左滑动1次');
      await agent.ai('点击Sticker');
      await agent.ai('选择第1个表情');
      await agent.ai('点击✅');
      await agent.ai('向左滑动1次');
      await agent.ai('点击Rotate');
      await agent.ai('点击Speed');
      await agent.ai('点击2x');
      await agent.ai('点击✅');
      await agent.ai('点击Save按钮');
      await agent.ai('等待进度100%');
      await agent.ai('点击Done按钮');
      await agent.aiAssert('VIDEO出现New标签的视频');
    });
  },
  360 * 1000,
);
