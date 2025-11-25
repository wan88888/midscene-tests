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

      await agent.launch('free.video.downloader.converter.music/free.video.downloader.converter.music.view.activity.StartupActivity');
      await agent.ai('点击Allow');
      await agent.ai('点击关闭按钮');
      await agent.ai('点击顶部VIP按钮');
      await agent.ai('点击Monthly Access');
      await agent.ai('点击7 Days Free Trial按钮');
      await agent.ai('点击购买按钮');
      await agent.ai('点击输入框输入pornhub.com');
      await agent.ai('点击Enter按钮');
      await agent.ai('点击第1个视频');
      await agent.ai('等待悬浮按钮亮起');
      await agent.ai('点击悬浮下载按钮');
      await agent.ai('选择720p');
      await agent.ai('点击Download按钮');
      await agent.ai('点击右上角关闭按钮');
      await agent.ai('点击底部Home按钮');
    });
  },
  360 * 1000,
);
