import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 全局设置
    globals: true,
    
    // 测试运行完成后的钩子
    globalSetup: './scripts/global-setup.ts'
  }
});

