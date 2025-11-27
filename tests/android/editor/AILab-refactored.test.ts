import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi, afterAll } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

let agent: Awaited<ReturnType<typeof agentFromAdbDevice>> | null = null;

// ============================================
// Helper Functions
// ============================================

/** 生成并验证结果 */
async function generateAndVerify() {
  await agent!.ai('Click the generate button at the bottom');
  await agent!.ai('Wait for result page to appear');
  await agent!.aiAssert('User should see Creation Saved,Enjoy!!! text');
  await agent!.ai('Click Generate 1 More button');
}

/** 选择样式 */
async function selectStyle(option: string) {
  await agent!.ai('Click Select style');
  await agent!.ai(`Select the ${option}`);
  await agent!.ai('Click ✅');
}

/** 上传单张图片 */
async function uploadSingleImage() {
  await agent!.ai('Click Upload images');
  await agent!.ai('Select the 1st image');
}

/** 上传两张图片 */
async function uploadTwoImages() {
  await agent!.ai('Click the 1st Upload images');
  await agent!.ai('Select the 1st image');
  await agent!.ai('Click the 2nd Upload images');
  await agent!.ai('Select the 2nd image');
}

// ============================================
// Tests
// ============================================

describe(
  'Android Editor Tests (Refactored)',
  async () => {
    afterAll(async () => {
      await agent?.destroy();
    });

    await it('should use AILab features', async () => {
      const devices = await getConnectedDevices();
      agent = await agentFromAdbDevice(devices[0].udid, {
        aiActionContext:
          'If any location, permission, user agreement, etc. popup, click agree. If login page pops up, close it.',
      });

      await agent.launch(process.env.ANDROID_EDITOR_PACKAGE || '');
      await agent.ai('Click AILab');

      // Text to Video
      await agent.ai('Click Text to Video');
      await agent.ai('Enter text in the input field: Do you also want to dance?');
      await generateAndVerify();

      // Image to Video
      await agent.ai('Click Image to Video');
      await uploadSingleImage();
      await selectStyle('1st option in the 2nd row');
      await generateAndVerify();

      // Text to Image
      await agent.ai('Click Text to Image');
      await agent.ai('Enter text in the input field: Do you also want to dance?');
      await selectStyle('1st option in the 2nd row');
      await generateAndVerify();

      // Image to Image
      await agent.ai('Click Image to Image');
      await uploadSingleImage();
      await selectStyle('2nd option in the 1st row');
      await generateAndVerify();

      // Scroll to see more options
      await agent.ai('Swipe up 1 time');

      // AI Kiss
      await agent.ai('Click AI Kiss');
      await uploadTwoImages();
      await selectStyle('4th option in the 1st row');
      await generateAndVerify();

      // AI Group
      await agent.ai('Click AI Group');
      await uploadTwoImages();
      await generateAndVerify();
    });
  },
  360 * 1000,
);

