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
      await agent.ai("点击旁边的新建按钮");
      await agent.ai('在号码输入框输入6502234107');
      await agent.ai('在聊天输入框输入hey');
      await agent.ai('点击Send按钮');
      await agent.ai('点击左下角附件按钮');
      await agent.ai('点击Photo');
      await agent.ai('选择第1张图片');
      await agent.ai('点击左下角表情按钮');
      await agent.ai('选择第1个表情');
      await agent.ai('点击返回按钮');
      await agent.aiAssert('Message界面应该会出现聊天记录');
    });
  },
  360 * 1000,
);