import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 90 * 1000,
});

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

describe(
  'ios integration',
  async () => {
    await it('TalkNum App for buy number test', async () => {
      const agent = await agentFromWebDriverAgent({
        aiActionContext:
          'If any location, permission, click agree.',
      });
      
      await agent.launch('');          
      await agent.ai('Click Contacts Tab');
      await agent.ai('Click the new button next to it');
      await agent.ai('Click the avatar area');
      await agent.ai('Click From Album');
      await agent.ai('Select the 1st image');
      await agent.ai('Click Contact Name');
      await agent.ai('Enter Lucy in First Name input field');
      await agent.ai('Click OK');
      await agent.ai('Click Add Number');
      await agent.ai('Enter 6502234107 in Number input field');
      await agent.ai('Click OK');
      await agent.ai('Click Done button');
      await agent.ai('Click the close button');
      await agent.aiAssert('Contact record should appear in Contacts interface');
    });
  },
  360 * 1000,
);