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
      await agent.ai('点击Get a Number Now');
      await agent.ai('点击左上角关闭按钮');
      await agent.ai('点击No,Thanks');
      await agent.ai('点击Get Number');
      await agent.ai('点击Monthly');
      await agent.ai('点击CONTINUE');
      await agent.ai('点击Subscribe');
      await agent.ai('点击Browse by State');
      await agent.ai('点击United States');
      await agent.ai('在搜索输入框输入213');
      await agent.ai('点击搜索结果第1个');
      await agent.ai('点击Done按钮');
      await agent.ai('点击第1个号码');
      await agent.ai('点击Get This Number');
      await agent.ai('点击Done按钮');
      await agent.ai('点击Accept按钮');
      await agent.ai('点击左上角关闭按钮');
      await agent.ai('点击While using the app');
      await agent.ai('点击Allow按钮');
      await agent.ai('点击Allow按钮');
    });
  },
  360 * 1000,
);
