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
    await it('Saucelabs App Login Test', async () => {
      const agent = await agentFromWebDriverAgent({
        aiActionContext:
          'If any location, permission, click agree.',
      });
      
      await agent.launch('');          
      await agent.ai('点击New Project');
      await agent.ai("点击Allow Access to All Photos");
      await agent.ai('选择第1个视频');
      await agent.ai('点击Next按钮');
      await agent.ai('点击关闭按钮');
      await agent.ai('点击Next按钮');
      await agent.ai('点击Got it！');
      await agent.ai('点击Effects');
      await agent.ai('选择Strobe特效');
      await agent.ai('点击✅');
      await agent.ai('点击空白位置');
      await agent.ai('点击Text');
      await agent.ai('点击Add');
      await agent.ai('选择Ripples');
      await agent.ai('点击Aa');
      await agent.ai('选择第2个选项');
      await agent.ai('点击✅');
      await agent.ai('点击空白位置');
      await agent.ai('滑动底部工具栏');
      await agent.ai('点击Filter');
      await agent.ai('选择PO3滤镜');
      await agent.ai('点击✅');
      await agent.ai('点击Export按钮');
      await agent.ai('点击Export按钮');
      await agent.ai('等待进度条到100%');
      await agent.ai('等待评星弹窗出现');
      await agent.ai('点击Not Now');
      await agent.ai('点击关闭按钮');
      await agent.ai('点击右上角Home按钮');
    });
  },
  360 * 1000,
);