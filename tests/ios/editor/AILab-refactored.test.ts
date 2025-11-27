import { agentFromWebDriverAgent } from '@midscene/ios';
import { describe, it, vi, afterAll } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 360 * 1000,
});

let agent: Awaited<ReturnType<typeof agentFromWebDriverAgent>> | null = null;

// ============================================
// Helper Functions
// ============================================

/** 生成、验证结果并返回 */
async function generateVerifyAndGoBack() {
  await agent!.ai('Click the generate button at the bottom');
  await agent!.ai('Wait for result page to appear');
  await agent!.aiAssert('User should see Creation Saved,Enjoy!!! text');
  await agent!.ai('Click Generate 1 More button');
  await agent!.ai('Click the back button');
}

/** 选择样式 */
async function selectStyle(option: string) {
  await agent!.ai('Click Select style');
  await agent!.ai(`Select the ${option}`);
  await agent!.ai('Click ✅');
}

/** 上传单张图片（从相册） */
async function uploadSingleImage() {
  await agent!.ai('Click Upload images');
  await agent!.ai('Click Photo Library');
  await agent!.ai('Select the 1st image');
  await agent!.ai('Click ✅');
}

/** 上传两张图片（从相册） */
async function uploadTwoImages() {
  await agent!.ai('Click the 1st Upload images');
  await agent!.ai('Click Photo Library');
  await agent!.ai('Select the 1st image');
  await agent!.ai('Click ✅');
  await agent!.ai('Click the 2nd Upload images');
  await agent!.ai('Click Photo Library');
  await agent!.ai('Select the 2nd image');
  await agent!.ai('Click ✅');
}

// ============================================
// Tests
// ============================================

describe(
  'iOS Editor Tests (Refactored)',
  async () => {
    afterAll(async () => {
      await agent?.destroy();
    });

    await it('should use AILab features', async () => {
      agent = await agentFromWebDriverAgent({
        aiActionContext:
          'If any location, permission, click agree.',
      });
      
      await agent.launch(process.env.IOS_EDITOR_BUNDLE_ID || '');
      await agent.ai('Click AI Lab');

      // Text to Video
      await agent.ai('Click Text to Video');
      await agent.ai('Enter text in the input field: Do you also want to dance?');
      await generateVerifyAndGoBack();

      // Image to Video
      await agent.ai('Click Image to Video');
      await uploadSingleImage();
      await selectStyle('1st option in the 2nd row');
      await generateVerifyAndGoBack();

      // Text to Image
      await agent.ai('Click Text to Image');
      await agent.ai('Enter text in the input field: Do you also want to dance?');
      await selectStyle('1st option in the 2nd row');
      await generateVerifyAndGoBack();

      // Image to Image
      await agent.ai('Click Image to Image');
      await uploadSingleImage();
      await selectStyle('2nd option in the 1st row');
      await generateVerifyAndGoBack();

      // Scroll to see more options
      await agent.ai('Swipe up 1 time');

      // AI Kiss
      await agent.ai('Click AI Kiss');
      await uploadTwoImages();
      await selectStyle('4th option in the 1st row');
      await generateVerifyAndGoBack();

      // AI Group
      await agent.ai('Click AI Group');
      await uploadTwoImages();
      await generateVerifyAndGoBack();
    });
  },
  360 * 1000,
);

