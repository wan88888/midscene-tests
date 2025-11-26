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
      await agent.ai("点击Settings Tab");
      await agent.ai("点击New Number区域");
      await agent.ai("点击Browse by State");
      await agent.ai("点击United States");
      await agent.ai("在Search输入框输入213");
      await agent.ai("点击出现的搜索结果");
      await agent.ai("点击Done按钮");
      await agent.ai("选择第1个号码");
      await agent.ai("点击Get This Number按钮");
      await agent.ai("点击Monthly");
      await agent.ai("等待购买弹窗弹出");
      await agent.ai("点击Subscribe按钮");
      await agent.ai("在Password输入框输入Text0402");
      await agent.ai("点击OK按钮");
      await agent.ai("等待评星弹窗出现");
      await agent.ai("点击Not Now");
      await agent.ai("点击Done");
      await agent.aiAssert("那么用户应该看到购买的号码");
    });
  },
  360 * 1000,
);