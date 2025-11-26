import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 90 * 1000,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe(
  'ios integration',
  async () => {
    await it('TalkNum App for buy number test', async () => {
      const agent = await agentFromWebDriverAgent({
        aiActionContext:
          'If any location, permission, click agree.',
      });
      
      await agent.launch('');          
      await agent.ai("点击Contacts Tab");
      await agent.ai("点击旁边新建按钮");
      await agent.ai('点击头像区域');
      await agent.ai('点击From Album');
      await agent.ai('选择第1张图片');
      await agent.ai('点击Contact Name');
      await agent.ai('在First Name输入框输入Lucy');
      await agent.ai('点击OK');
      await agent.ai('点击Add Number');
      await agent.ai('在Number输入框输入6502234107');
      await agent.ai('点击OK');
      await agent.ai('点击Done按钮');
      await agent.ai('点击关闭按钮');
      await agent.aiAssert('Contacts界面应该会出现联系人记录');
    });
  },
  360 * 1000,
);