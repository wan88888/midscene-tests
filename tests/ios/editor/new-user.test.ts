import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi, afterAll } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

let agent: Awaited<ReturnType<typeof agentFromWebDriverAgent>> | null = null;

describe(
  'iOS Editor Tests',
  async () => {
    afterAll(async () => {
      await agent?.destroy();
    });

    await it('should complete first launch onboarding', async () => {
      agent = await agentFromWebDriverAgent({
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
