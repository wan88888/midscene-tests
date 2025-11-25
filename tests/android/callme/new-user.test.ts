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
      await agent.ai('点击Become a Member Now');
      await agent.ai('点击Gold');
      await agent.ai('点击Monthly Plan');
      await agent.ai('点击Subscribe按钮');
      await agent.aiAssert('用户应该看到号码管理页即页面出现Dear Gold Member文案');
      await agent.ai('点击Number1下方的+按钮');
      await agent.ai('点击Search输入框');
      await agent.ai('点击United States');
      await agent.ai('在Search输入框输入215');
      await agent.ai('点击搜索结果第1个');
      await agent.ai('点击搜索结果第1个');
      await agent.ai('点击第1个号码');
      await agent.ai('点击Get This Number');
      await agent.ai('点击Continue按钮');
    });
  },
  360 * 1000,
);
