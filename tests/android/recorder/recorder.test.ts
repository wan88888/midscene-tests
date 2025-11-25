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
      await agent.ai('点击Audio');
      await agent.ai('点击Internal Audio and Microphone');
      await agent.ai('点击返回按钮');
      await agent.ai('点击Video');
      await agent.ai('点击Resolution');
      await agent.ai('点击1080P选项');
      await agent.ai('点击Quality');
      await agent.ai('点击Excellent Quality');
      await agent.ai('点击FPS');
      await agent.ai('点击120FPS选项');
      await agent.ai('点击返回按钮');
      await agent.ai('点击中间录制按钮');
      await agent.ai('点击Start now');
      await agent.ai('下拉通知栏');
      await agent.launch('');
      await agent.launch('');
      await agent.ai('点击第1个视频');
      await agent.launch('');
      await agent.ai('点击结束录制按钮');
      await agent.ai('点击结果页关闭按钮');
    });
  },
  360 * 1000,
);
