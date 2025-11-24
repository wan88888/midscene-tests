import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi } from 'vitest';
import 'dotenv/config'; // read environment variables from .env file



vi.setConfig({
  testTimeout: 90 * 1000,
});

describe(
  'ios integration',
  async () => {
    await it('iOS settings page demo for scroll', async () => {
      const agent = await agentFromWebDriverAgent({
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree.',
      });

      await agent.launch('com.apple.Preferences');
      await agent.ai('Type VPN in the search bar');
    });
  },
  360 * 1000,
);
