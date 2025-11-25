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
      await agent.ai('点击Allow all');
      await agent.ai('点击视频列表第1个视频');
      await agent.ai('点击Skip');
      await agent.ai('点击空白位置');
      await agent.ai('点击下一个视频');
      await agent.ai('点击返回按钮');
      await agent.ai('关闭评星弹窗');
    });
  },
  360 * 1000,
);
