# Midscene 测试项目

<div align="center">

🧪 **Midscene.js 自动化测试套件**

使用 AI 驱动的测试工具，对 Web、Android、iOS 和游戏应用进行全面的自动化测试

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1.8-brightgreen.svg)](https://vitest.dev/)
[![Midscene](https://img.shields.io/badge/Midscene-latest-blue.svg)](https://midscenejs.com/)

</div>

---

## 📋 目录

- [特性](#-特性)
- [项目结构](#-项目结构)
- [环境要求](#-环境要求)
- [快速开始](#-快速开始)
- [运行测试](#-运行测试)
- [配置说明](#-配置说明)
- [测试报告](#-测试报告)
- [编写测试](#-编写测试)
- [故障排除](#-故障排除)

---

## ✨ 特性

- 🤖 **AI 驱动测试** - 使用 Midscene.js 实现智能测试自动化
- 🌐 **多平台支持** - Web、Android、iOS 和 Facebook 游戏
- 📊 **自动化报告** - HTML 报告自动上传到 Surge
- 💬 **飞书集成** - 自动发送测试结果通知
- 🔐 **认证状态管理** - 可复用的认证状态，加快测试执行
- ⚡ **并行执行** - 使用 Vitest 快速执行测试
- 🎯 **清晰的组织结构** - 按平台和应用分类的测试

---

## 📁 项目结构

```
midscene-tests/
├── tests/
│   ├── android/           # Android 应用测试
│   │   ├── callme/        # CallMe 应用测试
│   │   ├── editor/        # 视频编辑器测试
│   │   ├── textnum/       # TextNum 应用测试
│   │   ├── sauce/         # Sauce Labs 演示应用
│   │   └── ...
│   ├── ios/               # iOS 应用测试
│   │   ├── editor/        # 视频编辑器测试
│   │   ├── mail/          # 邮件应用测试
│   │   └── textnum/       # TextNum 应用测试
│   ├── web/               # Web 应用测试
│   │   ├── esim/          # eSIM 门户测试
│   │   └── sauce/         # Sauce Labs 演示网站
│   └── fbgame/            # Facebook 游戏测试
│       ├── bubble/        # 泡泡射击游戏
│       └── solitaire/     # 纸牌游戏
├── scripts/
│   ├── global-setup.ts           # 测试后钩子
│   └── send-feishu-report.ts     # 报告通知
├── midscene_run/          # 测试输出（自动生成）
│   ├── dump/              # 测试产物
│   ├── log/               # 测试日志
│   └── report/            # HTML 报告
├── .env                   # 环境配置（不在 git 中）
├── env.example           # 环境变量模板
├── package.json          # 依赖和脚本
└── vitest.config.ts      # 测试配置
```

---

## 🔧 环境要求

### 通用要求
- **Node.js** 18 或更高版本
- **npm** 或 **yarn**

### 平台特定要求

#### Web 测试
- 无需额外要求

#### Android 测试
- 安装 **ADB**（Android Debug Bridge）并添加到 PATH
- Android 设备/模拟器已连接并可通过 `adb devices` 访问
- 设备已启用 USB 调试

#### iOS 测试
- 需要 **macOS** 系统
- 安装 **Xcode**
- 配置并运行 **WebDriverAgent**
- iOS 设备已连接或模拟器正在运行

#### Facebook 游戏测试
- 安装 Facebook 应用的 Android 设备
- 已配置 ADB

---

## 🚀 快速开始

### 1. 克隆并安装

```bash
# 克隆仓库（或导航到项目目录）
cd midscene-tests

# 安装依赖
npm install
```

### 2. 配置环境

```bash
# 复制环境变量模板文件
cp env.example .env

# 编辑 .env 填入你的配置
nano .env  # 或使用你喜欢的编辑器
```

### 3. 运行你的第一个测试

```bash
# 运行 Web 测试（最容易开始）
npm run test:web

# 或运行特定测试
npm test tests/web/sauce/login.test.ts
```

---

## 🧪 运行测试

### 运行所有测试

```bash
npm run test:all
```

### 按平台运行

```bash
# 仅 Web 测试
npm run test:web

# 仅 Android 测试
npm run test:android

# 仅 iOS 测试
npm run test:ios

# Facebook 游戏测试
npm run test:fbgame
```

### 运行特定测试文件

```bash
# 运行单个测试文件
npm test tests/web/sauce/login.test.ts

# 运行目录下所有测试
npm test tests/android/editor/
```

### 使用 UI 运行

```bash
# 交互式测试 UI
npm run test:ui
```

### 使用缓存运行

```bash
# 使用缓存结果以加快执行
npm run test:cache
```

---

## ⚙️ 配置说明

### 环境变量

所有配置通过 `.env` 文件完成。查看 [env.example](env.example) 了解所有可用选项。

#### 关键配置选项

```bash
# Android 应用包名
ANDROID_SAUCE_PACKAGE=com.swaglabsmobileapp/com.swaglabsmobileapp.MainActivity

# iOS Bundle ID
IOS_MAIL_BUNDLE_ID=com.apple.mobilemail

# 飞书 Webhook（可选）
FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/your-webhook-url
DISABLE_FEISHU_NOTIFY=false

# Surge 配置（可选 - 用于报告托管）
SURGE_EMAIL=your.email@example.com
SURGE_TOKEN=your-surge-token
SURGE_DOMAIN=your-custom-domain
```

### 飞书通知

要启用自动测试结果通知到飞书：

1. 创建飞书机器人并获取 webhook URL
2. 将 webhook URL 添加到 `.env`：
   ```bash
   FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
   ```

要禁用通知（在开发时很有用）：
```bash
DISABLE_FEISHU_NOTIFY=true npm run test:all
```

### Surge 报告托管

要在线托管测试报告：

1. 登录 Surge：
   ```bash
   npx surge login
   ```

2. 或在 `.env` 中配置凭据：
   ```bash
   SURGE_EMAIL=your@email.com
   SURGE_TOKEN=your-token
   ```

报告将自动上传，URL 将包含在飞书通知中。

---

## 📊 测试报告

测试报告在每次测试运行后自动生成。

### 本地报告

报告保存在：
```
midscene_run/report/
```

在浏览器中打开 HTML 文件即可查看详细报告。

### 在线报告

如果配置了 Surge，报告会自动上传，URL 将：
- 显示在控制台输出中
- 包含在飞书通知中
- 公开访问（无需认证）

### 报告功能

- ✅ 测试执行摘要
- 📸 每个步骤的截图
- 🕒 执行时间线
- ❌ 错误详情和堆栈跟踪
- 📈 性能指标

---

## 🔐 认证管理

一些 Web 测试需要认证。我们使用一次设置的方式：

### 对于 Sauce Labs 演示

```bash
# 运行认证设置（只需要一次或会话过期时）
npm test tests/web/sauce/auth.setup.test.ts
```

这将：
1. 打开浏览器窗口
2. 登录应用
3. 将认证状态保存到 `.auth/sauce-user.json`

### 使用保存的认证

其他测试会自动使用保存的认证：

```typescript
// 在你的测试文件中
const context = await browser.newContext({
  storageState: authFile, // 复用保存的认证
});
```

优势：
- ⚡ 更快的测试执行
- 🔄  无需每次测试都登录
- 💾 认证状态在多次运行间持久保存

---

## ✍️ 编写测试

### 基本测试结构

```typescript
import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 90 * 1000,
});

describe('我的测试套件', async () => {
  it('应该完成某个操作', async () => {
    const devices = await getConnectedDevices();
    const agent = await agentFromAdbDevice(devices[0].udid, {
      aiActionContext: 'AI 操作的上下文',
    });

    await agent.launch(process.env.ANDROID_APP_PACKAGE || '');
    await agent.ai('点击按钮');
    await agent.aiAssert('应该出现预期结果');
  });
}, 360 * 1000);
```

### 最佳实践

1. **使用环境变量**管理应用包名和 bundle ID
   ```typescript
   await agent.launch(process.env.ANDROID_SAUCE_PACKAGE || '');
   ```

2. **根据测试复杂度设置合适的超时**
   ```typescript
   vi.setConfig({ testTimeout: 240 * 1000 }); // 4 分钟
   ```

3. **在 afterAll 钩子中清理资源**
   ```typescript
   afterAll(async () => {
     await browser.close();
   });
   ```

4. **使用描述性的测试名称**
   ```typescript
   it('应该成功将商品添加到购物车', async () => {
   ```

5. **为 AI 操作提供上下文**，以获得更好的执行效果
   ```typescript
   const agent = await agentFromAdbDevice(devices[0].udid, {
     aiActionContext: '如果出现弹窗，点击同意',
   });
   ```

---

## 🐛 故障排除

### 常见问题

#### Web 测试

**问题**：浏览器启动失败
```
解决方案：确保已安装 Playwright 浏览器
npm exec playwright install chromium
```

#### Android 测试

**问题**：未找到设备
```bash
# 检查已连接的设备
adb devices

# 如需要重启 ADB 服务
adb kill-server
adb start-server
```

**问题**：未找到应用包
```
解决方案：验证 .env 文件中的包名是否正确
使用：adb shell pm list packages | grep <app-name>
```

#### iOS 测试

**问题**：WebDriverAgent 连接失败
```
解决方案：
1. 确保 WebDriverAgent 已正确配置
2. 检查设备连接
3. 验证设备已解锁
```

#### 通用问题

**问题**：测试超时
```
解决方案：在 vi.setConfig() 或 describe() 参数中增加超时时间
```

**问题**：飞书通知不工作
```
解决方案：
1. 验证 FEISHU_WEBHOOK 是否正确设置
2. 检查 webhook URL 是否可访问
3. 尝试：DISABLE_FEISHU_NOTIFY=true 跳过通知
```

**问题**：Surge 上传失败
```
解决方案：
1. 登录 Surge：npx surge login
2. 或在 .env 中设置 SURGE_EMAIL 和 SURGE_TOKEN
```

---

## 📚 更多资源

- [Midscene.js 文档](https://midscenejs.com/)
- [Vitest 文档](https://vitest.dev/)
- [Playwright 文档](https://playwright.dev/)
- [详细设置指南](docs/SETUP.md)
- [贡献指南](docs/CONTRIBUTING.md)
- [快速参考](docs/QUICK_REFERENCE.md)

---

## 🤝 贡献

欢迎贡献！请遵循以下指南：

1. 遵循现有项目结构
2. 编写清晰的测试描述
3. 使用环境变量进行配置
4. 添加合适的超时
5. 正确清理资源
6. 添加新功能时更新文档

详情请查看 [贡献指南](docs/CONTRIBUTING.md)。

---

## 📝 许可证

MIT

---

## 👥 支持

如有问题：
1. 查看[故障排除](#-故障排除)部分
2. 查看 `tests/` 目录中的现有测试示例
3. 查阅 [Midscene.js 文档](https://midscenejs.com/)
4. 阅读 [docs/](docs/) 目录中的详细指南

---

<div align="center">

**祝测试愉快！🚀**

使用 ❤️ 和 [Midscene.js](https://midscenejs.com/) 制作

</div>