import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

describe(
  'iOS Editor Tests',
  async () => {
    await it('should complete first launch onboarding', async () => {
      const agent = await agentFromWebDriverAgent({
        aiActionContext:
          'If any location, permission, click agree.',
      });
      
      await agent.launch(process.env.IOS_EDITOR_BUNDLE_ID || '');          
      await agent.ai('Click the close button');
      await agent.ai('Click Allow');
      await agent.ai('Click Allow');
      await agent.aiAssert('User should see the home page with New Project button');
    });
  },
  360 * 1000,
);