import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 全局设置
    globals: true,

    // 串行执行测试文件：设备/浏览器（AdsPower、Android、iOS）绑定的 E2E
    // 同一资源同一时刻只能被一个用例占用，并行会互相抢占导致不稳定。
    fileParallelism: false,

    // 测试运行完成后的钩子
    globalSetup: './scripts/global-setup.ts'
  }
});