import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 90 * 1000,
});

describe(
  'android integration',
  async () => {
    await it('Editor App for AILab', async () => {
      const devices = await getConnectedDevices();
      const agent = await agentFromAdbDevice(devices[0].udid,{
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch('vidma.video.editor.videomaker/com.atlasv.android.mvmaker.mveditor.LaunchActivity');
      await agent.ai('Click AILab');
      await agent.ai('Click Text to Video');
      await agent.ai('Enter text in the input field: Do you also want to dance?');
      await agent.ai('Click the generate button at the bottom');
      await agent.ai('Wait for result page to appear');
      await agent.aiAssert('User should see Creation Saved,Enjoy!!! text');
      await agent.ai('Click Generate 1 More button');

      await agent.ai('Click Image to Video');
      await agent.ai('Click Upload images');
      await agent.ai('Select the 1st image');
      await agent.ai('Click Select style');
      await agent.ai('Select the 1st option in the 2nd row');
      await agent.ai('Click ✅');
      await agent.ai('Click the generate button at the bottom');
      await agent.ai('Wait for result page to appear');
      await agent.aiAssert('User should see Creation Saved,Enjoy!!! text');
      await agent.ai('Click Generate 1 More button');

      await agent.ai('Click Text to Image');
      await agent.ai('Enter text in the input field: Do you also want to dance?');
      await agent.ai('Click Select style');
      await agent.ai('Select the 1st option in the 2nd row');
      await agent.ai('Click ✅');
      await agent.ai('Click the generate button at the bottom');
      await agent.ai('Wait for result page to appear');
      await agent.aiAssert('User should see Creation Saved,Enjoy!!! text');
      await agent.ai('Click Generate 1 More button');

      await agent.ai('Click Image to Image');
      await agent.ai('Click Upload images');
      await agent.ai('Select the 1st image');
      await agent.ai('Click Select style');
      await agent.ai('Select the 2nd option in the 1st row');
      await agent.ai('Click ✅');
      await agent.ai('Click the generate button at the bottom');
      await agent.ai('Wait for result page to appear');
      await agent.aiAssert('User should see Creation Saved,Enjoy!!! text');
      await agent.ai('Click Generate 1 More button');

      // await agent.aiScroll({
      //   direction: 'up',
      //   distance: 100,
      //   scrollType: 'once',
      // });
      await agent.ai('Swipe up 1 time');

      await agent.ai('Click AI Kiss');
      await agent.ai('Click the 1st Upload images');
      await agent.ai('Select the 1st image');
      await agent.ai('Click the 2nd Upload images');
      await agent.ai('Select the 2nd image');
      await agent.ai('Click Select style');
      await agent.ai('Select the 4th option in the 1st row');
      await agent.ai('Click ✅');
      await agent.ai('Click the generate button at the bottom');
      await agent.ai('Wait for result page to appear');
      await agent.aiAssert('User should see Creation Saved,Enjoy!!! text');
      await agent.ai('Click Generate 1 More button');

      await agent.ai('Click AI Group');
      await agent.ai('Click the 1st Upload images');
      await agent.ai('Select the 1st image');
      await agent.ai('Click the 2nd Upload images');
      await agent.ai('Select the 2nd image');
      await agent.ai('Click the generate button at the bottom');
      await agent.ai('Wait for result page to appear');
      await agent.aiAssert('User should see Creation Saved,Enjoy!!! text');
      await agent.ai('Click Generate 1 More button');
    });
  },
  360 * 1000,
);