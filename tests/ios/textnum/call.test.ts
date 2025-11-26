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
      await agent.ai("点击Call Tab");
      await agent.ai("点击旁边的键盘按钮");
      await agent.ai("输入号码6502234107");
      await agent.ai('点击键盘上的电话按钮');
      await agent.ai('点击结束通话按钮');
      await agent.ai('点击返回按钮');
      await agent.aiAssert('Call界面应该会出现通话记录');
    });
  },
  360 * 1000,
);