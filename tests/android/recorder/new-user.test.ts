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
      await agent.ai('点击CONTINUE按钮');
      await agent.ai('点击Submit按钮');
      await agent.ai('点击ALLOW');
      await agent.ai('点击Vidma Recorder右侧的开关');
      await agent.ai('点击左上角返回按钮');
      await agent.ai('点击month选项');
      await agent.ai('点击CONTINUE按钮');
      await agent.ai('点击Subscribe按钮');
      await agent.aiAssert('页面出现PURCHASED文案');
      await agent.ai('点击左上角关闭按钮');
      await agent.ai('点击空白位置');
      await agent.ai('点击ALLOW按钮');
      await agent.ai('点击Allow all');
      await agent.ai('点击ALLOW按钮');
      await agent.ai('点击Allow按钮');
      await agent.ai('点击空白位置');
      await agent.ai('点击空白位置');
      await agent.ai('点击Got it');
      await agent.ai('点击中间录制按钮');
      await agent.ai('点击While using the app');
      await agent.ai('点击Start now');
      await agent.ai('下拉通知栏');
      await agent.ai('点击Stop按钮');
      await agent.ai('关闭评星弹窗');
      await agent.ai('点击结果页播放按钮');
      await agent.ai('点击返回按钮');
    });
  },
  360 * 1000,
);
