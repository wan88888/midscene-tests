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
      await agent.ai('点击Contact Tab');
      await agent.ai('点击右上角新建按钮');
      await agent.ai('点击头像区域');
      await agent.ai('选择第1张图片');
      await agent.ai('点击Contact Name');
      await agent.ai('在First Name输入框输入Lucy');
      await agent.ai('点击OK');
      await agent.ai('点击Add Number');
      await agent.ai('在Phone Number输入框输入6502234107');
      await agent.ai('点击OK');
      await agent.ai('点击Done按钮');
      await agent.aiAssert('From App Tab应该会出现联系人记录');
    });
  },
  360 * 1000,
);
