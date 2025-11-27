# 贡献指南

感谢你为 Midscene 测试项目做贡献！本指南将帮助你开始。

---

## 目录

- [开始使用](#开始使用)
- [项目结构](#项目结构)
- [编写测试](#编写测试)
- [代码风格](#代码风格)
- [最佳实践](#最佳实践)
- [提交更改](#提交更改)

---

## 开始使用

### 前置要求

1. 完成[设置指南](SETUP.md)
2. 熟悉 [Midscene.js](https://midscenejs.com/)
3. 了解项目结构（参见 [README.md](../README.md)）

### 开发工作流

```bash
# 1. 创建功能分支（如果使用 git）
git checkout -b feature/my-new-tests

# 2. 进行更改
# 在 tests/ 下的适当目录中添加测试

# 3. 本地运行测试
npm test path/to/your/test.ts

# 4. 提交更改
git add .
git commit -m "添加功能 X 的测试"

# 5. 推送并创建 PR（如适用）
```

---

## 项目结构

### 目录组织

```
tests/
├── android/          # Android 应用测试
│   ├── app-name/     # 按应用分组
│   │   ├── feature1.test.ts
│   │   └── feature2.test.ts
├── ios/              # iOS 应用测试
├── web/              # Web 测试
└── fbgame/           # Facebook 游戏测试

scripts/              # 工具脚本
├── global-setup.ts   # 测试后钩子
└── send-feishu-report.ts

docs/                 # 文档
└── *.md
```

### 添加新测试

#### 对于新应用

在适当的平台下创建新目录：

```bash
# 示例：为名为 "MyApp" 的新 Android 应用添加测试
mkdir -p tests/android/myapp

# 创建测试文件
touch tests/android/myapp/login.test.ts
touch tests/android/myapp/main-flow.test.ts
```

#### 对于现有应用

将测试文件添加到现有目录：

```bash
# 示例：向现有 "sauce" 应用添加测试
touch tests/android/sauce/checkout.test.ts
```

---

## 编写测试

### 测试文件模板

使用此模板创建新测试文件：

```typescript
import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
// 或：import { agentFromWebDriverAgent } from '@midscene/ios';
// 或：import { PlaywrightAgent } from '@midscene/web/playwright';
import { describe, it, vi, beforeAll, afterAll } from 'vitest';
import 'dotenv/config';

vi.setConfig({
  testTimeout: 240 * 1000,  // 根据测试复杂度调整
  hookTimeout: 60 * 1000,
});

describe('功能名称测试', async () => {
  // 设置资源
  beforeAll(async () => {
    // 初始化 agent、浏览器等
  });

  // 清理资源
  afterAll(async () => {
    // 关闭连接、浏览器等
  });

  it('应该成功执行操作', async () => {
    // 测试实现
    await agent.ai('执行操作');
    await agent.aiAssert('预期结果');
  });

  it('应该处理错误情况', async () => {
    // 测试实现
  });
}, 360 * 1000);  // 套件超时（可选）
```

### 测试命名规范

使用描述性的测试名称来解释正在测试的内容：

✅ **好的：**
```typescript
it('应该使用有效凭据成功登录', async () => {
it('应该为无效邮箱显示错误消息', async () => {
it('应该将商品添加到购物车并更新购物车计数', async () => {
```

❌ **不好的：**
```typescript
it('测试 1', async () => {
it('登录', async () => {
it('可以工作', async () => {
```

### 使用环境变量

**始终使用环境变量**进行应用特定配置：

```typescript
// ✅ 好的
await agent.launch(process.env.ANDROID_MYAPP_PACKAGE || '');

// ❌ 不好 - 硬编码包名
await agent.launch('com.example.myapp/com.example.myapp.MainActivity');
```

添加新应用时，更新 `env.example`：

```bash
# 添加到 env.example
ANDROID_MYAPP_PACKAGE=com.example.myapp/com.example.myapp.MainActivity
```

---

## 代码风格

### 导入顺序

1. 第三方导入（Midscene、Vitest 等）
2. 内置 Node 模块
3. 本地导入
4. Dotenv 配置（始终最后）

```typescript
// ✅ 好的
import { agentFromAdbDevice, getConnectedDevices } from '@midscene/android';
import { describe, it, vi } from 'vitest';
import path from 'path';
import { myHelper } from '../helpers/myHelper';
import 'dotenv/config';
```

### Async/Await

始终使用 async/await，不要使用回调或原始 promise：

```typescript
// ✅ 好的
await agent.ai('点击按钮');
const devices = await getConnectedDevices();

// ❌ 不好
agent.ai('点击按钮').then(() => { ... });
```

### 错误处理

对关键操作添加 try-catch：

```typescript
it('应该优雅地处理错误', async () => {
  try {
    await agent.launch(process.env.APP_PACKAGE || '');
    await agent.ai('执行操作');
  } catch (error) {
    console.error('测试失败，错误：', error);
    // 截图或其他诊断操作
    throw error; // 重新抛出以使测试失败
  }
});
```

### 超时

根据测试复杂度设置合适的超时：

- **简单测试**（1-3 个操作）：90 秒
- **中等测试**（4-10 个操作）：180 秒
- **复杂测试**（10+ 个操作）：240-360 秒

```typescript
// 简单测试
vi.setConfig({ testTimeout: 90 * 1000 });

// 复杂测试
vi.setConfig({ testTimeout: 360 * 1000 });
```

### 注释

为以下情况添加注释：
- 复杂逻辑
- 变通方法
- AI 上下文推理
- 不明显的等待

```typescript
// 好的注释示例
// 等待动画完成后再点击
await sleep(2000);

// AI 需要关于权限弹窗的上下文
const agent = await agentFromAdbDevice(devices[0].udid, {
  aiActionContext: '如果出现权限弹窗，点击允许',
});
```

---

## 最佳实践

### 1. 资源管理

始终清理资源：

```typescript
// ✅ 好的 - Web 测试
let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch({ ... });
});

afterAll(async () => {
  await browser?.close();
});

// ✅ 好的 - 移动测试（如果清理 API 存在）
let agent: any;

beforeAll(async () => {
  agent = await agentFromAdbDevice(...);
});

afterAll(async () => {
  await agent?.dispose?.();
});
```

### 2. 认证状态

尽可能复用认证：

```typescript
// 创建一次设置测试
// tests/web/myapp/auth.setup.test.ts
await context.storageState({ path: authFile });

// 在其他测试中复用
// tests/web/myapp/feature.test.ts
const context = await browser.newContext({
  storageState: authFile,
});
```

### 3. AI 上下文

为 AI 操作提供清晰的上下文：

```typescript
const agent = await agentFromAdbDevice(devices[0].udid, {
  aiActionContext: `
    - 如果出现位置权限弹窗，点击允许
    - 如果出现用户协议弹窗，点击同意
    - 如果出现登录屏幕，关闭它
  `.trim(),
});
```

### 4. 断言

始终验证预期结果：

```typescript
// ✅ 好的 - 明确断言
await agent.ai('点击登录按钮');
await agent.aiAssert('应该看到带有欢迎消息的主页');

// ⚠️ 可以 - 隐式（如果元素未找到，操作可能失败）
await agent.ai('点击登录按钮');
await agent.ai('点击个人资料图标');

// ❌ 不好 - 没有验证
await agent.ai('点击登录按钮');
// 测试结束但没有验证任何东西
```

### 5. 避免硬等待

尽可能优先使用 AI 操作而不是固定延迟：

```typescript
// ✅ 更好 - AI 等待元素
await agent.ai('等待加载动画消失');

// ⚠️ 可以 - 必要时使用
await sleep(2000); // 等待动画

// ❌ 避免 - 不可靠
await sleep(5000); // 希望页面此时已加载
```

### 6. 测试独立性

每个测试应该是独立的：

```typescript
// ✅ 好的 - 每个测试重新开始
it('测试 1', async () => {
  await agent.launch(APP_PACKAGE);
  // 测试逻辑
});

it('测试 2', async () => {
  await agent.launch(APP_PACKAGE);
  // 测试逻辑
});

// ❌ 不好 - 测试相互依赖
it('测试 1', async () => {
  await agent.launch(APP_PACKAGE);
  await agent.ai('设置状态');
});

it('测试 2', async () => {
  // 假设测试 1 的状态
  await agent.ai('继续之前的状态');
});
```

### 7. 描述性变量

使用有意义的变量名：

```typescript
// ✅ 好的
const loginButton = await page.locator('[data-test="login-button"]');
const welcomeMessage = await page.textContent('.welcome');

// ❌ 不好
const btn = await page.locator('[data-test="login-button"]');
const msg = await page.textContent('.welcome');
```

---

## 常见模式

### 模式 1：多步骤流程

```typescript
it('应该完成结账流程', async () => {
  await agent.launch(process.env.APP_PACKAGE || '');
  
  // 步骤 1：选择产品
  await agent.ai('点击第一个产品');
  await agent.ai('点击添加到购物车按钮');
  
  // 步骤 2：进入购物车
  await agent.ai('点击购物车图标');
  await agent.aiAssert('购物车应显示 1 件商品');
  
  // 步骤 3：结账
  await agent.ai('点击结账按钮');
  await agent.aiAssert('应该看到结账表单');
});
```

### 模式 2：滚动

```typescript
// 使用 aiScroll 进行受控滚动
await agent.aiScroll({
  direction: 'down',
  distance: 200,
  scrollType: 'once',
});

// 或使用 AI 滚动到特定元素
await agent.ai('向下滚动找到设置选项');
```

### 模式 3：条件操作

```typescript
// 让 AI 处理条件逻辑
const agent = await agentFromAdbDevice(devices[0].udid, {
  aiActionContext: '如果出现弹窗，通过点击 X 或关闭来关闭它',
});

await agent.ai('导航到个人资料');
// AI 会自动处理任何弹窗
```

---

## 测试你的更改

### 提交前

1. **本地运行你的测试：**
   ```bash
   npm test path/to/your/test.ts
   ```

2. **运行相关测试：**
   ```bash
   npm test tests/android/myapp/
   ```

3. **检查问题：**
   - 测试一致通过
   - 没有硬编码值
   - 资源已清理
   - 超时合适

4. **验证文档：**
   - 如果添加新变量，更新 `env.example`
   - 如果添加新功能，更新 README
   - 为复杂逻辑添加注释

---

## 提交更改

### 检查清单

- [ ] 测试在本地成功运行
- [ ] 代码遵循风格指南
- [ ] 使用环境变量进行配置
- [ ] 资源已正确清理
- [ ] 测试名称具有描述性
- [ ] 文档已更新（如需要）
- [ ] 提交中没有敏感数据

### 提交消息

使用清晰、描述性的提交消息：

```bash
# ✅ 好的
git commit -m "添加 Android Sauce 应用的结账流程测试"
git commit -m "修复 iOS 编辑器测试中的超时问题"
git commit -m "更新 README 中的 iOS 设置说明"

# ❌ 不好
git commit -m "更新"
git commit -m "修复"
git commit -m "进行中"
```

---

## 获取帮助

如果需要帮助：

1. 查看现有测试作为示例
2. 查看 [Midscene.js 文档](https://midscenejs.com/)
3. 查看[设置指南](SETUP.md)了解平台特定问题
4. 询问团队成员或维护者

---

## 代码审查指南

在审查他人代码时，检查：

- [ ] 测试独立，可以按任何顺序运行
- [ ] 使用环境变量（没有硬编码值）
- [ ] 设置了合适的超时
- [ ] 在 afterAll 钩子中清理资源
- [ ] 清晰和描述性的测试名称
- [ ] 需要时提供 AI 上下文
- [ ] 关键操作的错误处理
- [ ] 如需要，文档已更新

---

## 感谢你！

你的贡献使这个项目更好！🎉

如果你对改进本指南有建议，请提交！

---

**祝测试愉快！🚀**
