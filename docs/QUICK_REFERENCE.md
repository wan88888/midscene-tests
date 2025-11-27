# 快速参考指南

常见任务和命令的快速参考。

---

## 常用命令

### 运行测试

```bash
# 所有测试
npm run test:all

# 按平台
npm run test:web
npm run test:android
npm run test:ios
npm run test:fbgame

# 特定测试文件
npm test tests/web/sauce/login.test.ts

# 特定目录
npm test tests/android/editor/

# 使用 UI
npm run test:ui

# 使用缓存
npm run test:cache

# 禁用飞书通知
DISABLE_FEISHU_NOTIFY=true npm run test:all
```

### 设置命令

```bash
# 安装依赖
npm install

# 安装 Playwright 浏览器
npx playwright install chromium

# 设置 Surge 用于报告托管
npx surge login

# 检查已连接的 Android 设备
adb devices

# 列出 iOS 模拟器
xcrun simctl list devices
```

---

## 测试文件结构

### 基本模板

```typescript
import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 240 * 1000,
});

describe('测试套件', async () => {
  it('测试用例', async () => {
    const devices = await getConnectedDevices();
    const agent = await agentFromAdbDevice(devices[0].udid);
    
    await agent.launch(process.env.APP_PACKAGE || '');
    await agent.ai('执行操作');
    await agent.aiAssert('预期结果');
  });
}, 360 * 1000);
```

---

## 常用 Midscene 操作

### 基本操作

```typescript
// 点击元素
await agent.ai('点击登录按钮');

// 输入文本
await agent.ai('在邮箱字段输入 john@example.com');

// 点按（移动端）
await agent.ai('点击设置图标');

// 长按（移动端）
await agent.ai('长按图片');

// 滑动（移动端）
await agent.ai('在卡片上向左滑动');
```

### 滚动

```typescript
// 使用 AI 滚动
await agent.ai('向下滚动找到页脚');

// 受控滚动
await agent.aiScroll({
  direction: 'down',    // 'up', 'down', 'left', 'right'
  distance: 200,        // 像素
  scrollType: 'once',   // 'once' 或 'until'
});

// 在特定区域滚动
await agent.aiScroll(
  { direction: 'left', distance: 100, scrollType: 'once' },
  '在工具栏区域'
);
```

### 断言

```typescript
// 检查文本存在
await agent.aiAssert('页面应包含欢迎消息');

// 检查元素状态
await agent.aiAssert('登录按钮应该是启用的');

// 检查数量
await agent.aiAssert('购物车应显示 3 件商品');

// 检查可见性
await agent.aiAssert('加载动画不应该可见');
```

### 等待

```typescript
// 等待元素
await agent.ai('等待加载动画消失');

// 等待状态
await agent.ai('等待进度达到 100%');

// 固定等待（谨慎使用）
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
await sleep(2000);
```

---

## 环境变量参考

### Android 包名

```bash
ANDROID_SAUCE_PACKAGE=com.swaglabsmobileapp/com.swaglabsmobileapp.MainActivity
ANDROID_EDITOR_PACKAGE=vidma.video.editor.videomaker/...
ANDROID_DOWNLOADER_PACKAGE=free.video.downloader.converter.music/...
ANDROID_FACEBOOK_PACKAGE=com.facebook.katana/com.facebook.katana.LoginActivity
ANDROID_CALLME_PACKAGE=
ANDROID_TEXTNUM_PACKAGE=
ANDROID_RECORDER_PACKAGE=
ANDROID_PLAYER_PACKAGE=
```

### iOS Bundle ID

```bash
IOS_EDITOR_BUNDLE_ID=
IOS_TEXTNUM_BUNDLE_ID=
IOS_MAIL_BUNDLE_ID=com.apple.mobilemail
```

### 通知

```bash
FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
DISABLE_FEISHU_NOTIFY=false
```

### Surge

```bash
SURGE_EMAIL=your@email.com
SURGE_TOKEN=your-token
SURGE_DOMAIN=custom-domain
```

### 其他

```bash
MIDSCENE_CACHE=false
TEST_TIMEOUT=240000
```

---

## 平台特定快速提示

### Android

```bash
# 查找包名
adb shell pm list packages | grep <app-name>

# 获取主 Activity
adb shell dumpsys package <package> | grep -A 1 "MAIN"

# 安装应用
adb install app.apk

# 卸载应用
adb uninstall com.package.name

# 清除应用数据
adb shell pm clear com.package.name

# 截图
adb shell screencap /sdcard/screen.png
adb pull /sdcard/screen.png

# 录屏
adb shell screenrecord /sdcard/demo.mp4
```

### iOS

```bash
# 列出设备
idevice_id -l
xcrun simctl list devices

# 列出设备上的应用
ideviceinstaller -l

# 安装应用
ideviceinstaller -i app.ipa

# 启动模拟器
xcrun simctl boot "iPhone 14 Pro"

# 打开模拟器
open -a Simulator

# 截图（模拟器）
xcrun simctl io booted screenshot screen.png

# 检查 WDA 状态
curl http://localhost:8100/status
```

### Web

```bash
# 安装浏览器
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit

# 更新 Playwright
npm install -D @playwright/test@latest

# 在有头模式运行（查看浏览器）
# 在测试中设置：headless: false
```

---

## 故障快速修复

### 测试超时

```typescript
// 增加超时
vi.setConfig({
  testTimeout: 600 * 1000, // 10 分钟
});
```

### ADB 问题

```bash
# 重启 ADB
adb kill-server
adb start-server

# 检查连接
adb devices
```

### iOS WDA 问题

```bash
# 检查状态
curl http://localhost:8100/status

# 重启 WDA（在 Xcode 中重新运行）
```

### 环境变量未加载

```typescript
// 确保导入了此行
import 'dotenv/config';

// 检查 .env 文件是否存在
ls -la .env

# 测试加载
console.log(process.env.ANDROID_SAUCE_PACKAGE);
```

### 浏览器问题

```bash
# 重新安装浏览器
npx playwright install --force chromium
```

### Surge 上传失败

```bash
# 重新登录
npx surge login

# 获取新令牌
npx surge token
```

---

## 实用代码片段

### 获取已连接的 Android 设备

```typescript
import { getConnectedDevices } from '@midscene/android';

const devices = await getConnectedDevices();
const deviceId = devices[0].udid;
```

### 创建 iOS Agent

```typescript
import { agentFromWebDriverAgent } from '@midscene/ios';

const agent = await agentFromWebDriverAgent({
  aiActionContext: '如果出现权限弹窗，点击允许',
});
```

### 创建 Web Agent

```typescript
import { chromium } from 'playwright';
import { PlaywrightAgent } from '@midscene/web/playwright';

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({ viewport: null });
const page = await context.newPage();
await page.goto('https://example.com');

const agent = new PlaywrightAgent(page);
```

### 复用认证

```typescript
// 保存认证
await context.storageState({ path: './auth.json' });

// 加载认证
const context = await browser.newContext({
  storageState: './auth.json',
});
```

### 添加 AI 上下文

```typescript
const agent = await agentFromAdbDevice(deviceId, {
  aiActionContext: `
    如果出现位置权限，点击允许。
    如果出现用户协议，点击同意。
    如果出现登录提示，关闭它。
  `.trim(),
});
```

---

## 文件位置

### 测试结果

```
midscene_run/
├── dump/       # 测试产物
├── log/        # 测试日志
└── report/     # HTML 报告
```

### 认证状态

```
.auth/
└── sauce-user.json
└── other-auth-states.json
```

### 配置

```
.env            # 你的环境配置（不在 git 中）
env.example     # 模板（应该在 git 中）
vitest.config.ts
package.json
```

---

## 报告链接

### 本地报告

```bash
# 打开最新报告
open midscene_run/report/*.html
```

### Surge 报告

测试运行后，查看控制台输出的 URL：
```
✓ 报告已上传到 Surge: https://your-domain.surge.sh
```

或查看飞书通知中的可点击链接。

---

## 常见测试模式

### 登录流程

```typescript
it('应该成功登录', async () => {
  await agent.launch(process.env.APP_PACKAGE || '');
  await agent.ai('在邮箱字段输入 test@example.com');
  await agent.ai('在密码字段输入 password123');
  await agent.ai('点击登录按钮');
  await agent.aiAssert('应该看到主页');
});
```

### 添加到购物车

```typescript
it('应该将商品添加到购物车', async () => {
  await agent.ai('点击第一个产品');
  await agent.ai('点击添加到购物车按钮');
  await agent.ai('点击购物车图标');
  await agent.aiAssert('购物车应显示 1 件商品');
});
```

### 表单提交

```typescript
it('应该提交表单', async () => {
  await agent.ai('在名字字段输入 John');
  await agent.ai('在姓氏字段输入 Doe');
  await agent.ai('在邮箱字段输入 john@example.com');
  await agent.ai('点击提交按钮');
  await agent.aiAssert('应该显示成功消息');
});
```

### 导航

```typescript
it('应该在应用中导航', async () => {
  await agent.ai('点击设置标签');
  await agent.aiAssert('应该看到设置页面');
  await agent.ai('点击个人资料菜单项');
  await agent.aiAssert('应该看到个人资料页面');
});
```

---

## 技巧与窍门

1. **使用描述性操作文本** - AI 在清晰指令下工作更好
2. **先本地测试** - 比 CI/CD 反馈更快
3. **保持测试独立** - 每个测试应该独立工作
4. **使用环境变量** - 不要硬编码应用特定值
5. **清理资源** - 使用 afterAll 钩子
6. **设置合适的超时** - 基于测试复杂度
7. **添加 AI 上下文** - 帮助 AI 处理弹窗和边缘情况
8. **复用认证状态** - 更快的测试执行
9. **使用 aiAssert** - 验证预期结果
10. **查看报告** - 截图帮助调试失败

---

## 获取帮助

- 📖 [完整文档](../README.md)
- 🔧 [设置指南](SETUP.md)
- 🤝 [贡献指南](CONTRIBUTING.md)
- 🌐 [Midscene.js 文档](https://midscenejs.com/)

---

**快速参考完成！🚀**
