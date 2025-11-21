import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 90 * 1000,
  hookTimeout: 60 * 1000,
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
      
      await agent.launch('com.apple.mobilemail');          
      await agent.ai("Click Other");
      await agent.ai("Type test in the Name field");
      await agent.ai("Type test in the Description field");
    });
  },
  360 * 1000,
);