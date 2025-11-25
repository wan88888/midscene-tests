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
      await agent.ai('点击中间键盘按钮');
      await agent.ai('输入号码6502234107');
      await agent.ai('点击键盘上的电话按钮');
      await agent.ai('点击结束通话按钮');
      await agent.ai('点击返回按钮');
      await agent.aiAssert('Call界面应该会出现通话记录');
    });
  },
  360 * 1000,
);
