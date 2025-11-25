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
      await agent.ai('点击Message Tab');
      await agent.ai('点击新建聊天按钮');
      await agent.ai('在号码输入框输入6502234107');
      await agent.ai('在聊天输入框输入hello');
      await agent.ai('点击Send按钮');
      await agent.ai('点击左下角+按钮');
      await agent.ai('点击Add From Photos');
      await agent.ai('选择第1张图片');
      await agent.ai('点击左上角返回按钮');
      await agent.aiAssert('Message界面应该会出现聊天记录');
    });
  },
  360 * 1000,
);
