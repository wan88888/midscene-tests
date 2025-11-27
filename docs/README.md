# 文档索引

欢迎查看 Midscene 测试文档！本目录包含使用和贡献此项目的全面指南。

---

## 📚 可用文档

### [📖 主 README](../README.md)
**从这里开始！** 项目概述、功能和基本用法。

**内容：**
- 项目概览和功能
- 快速开始指南
- 按平台运行测试
- 基本配置
- 测试报告和通知
- 基础故障排除

---

### [🔧 设置指南](SETUP.md)
**所有平台的完整设置说明。**

**内容：**
- 通用设置（Node.js、依赖）
- Android 设置（ADB、设备、模拟器）
- iOS 设置（Xcode、WebDriverAgent、模拟器）
- Web 测试设置（Playwright 浏览器）
- 环境配置
- 平台特定故障排除

**何时使用：** 首次设置项目或在新机器上安装时。

---

### [🤝 贡献指南](CONTRIBUTING.md)
**编写测试和贡献项目的指南。**

**内容：**
- 开始开发
- 项目结构详解
- 编写测试（模板、最佳实践）
- 代码风格指南
- 常见模式和示例
- 测试和提交变更
- 代码审查检查清单

**何时使用：** 在编写新测试或修改现有测试之前。

---

### [⚡ 快速参考](QUICK_REFERENCE.md)
**常见任务和命令的快速参考。**

**内容：**
- 常用命令速查表
- Midscene API 快速参考
- 环境变量列表
- 平台特定命令
- 故障快速修复
- 实用代码片段
- 常见测试模式

**何时使用：** 在编写或运行测试时快速查找。

---

## 🗂️ 按任务分类的文档

### 我想...

#### 开始使用
1. 阅读[主 README](../README.md) - 概览
2. 遵循[设置指南](SETUP.md) - 安装
3. 运行你的第一个测试（参见 README）

#### 编写测试
1. 查看[贡献指南](CONTRIBUTING.md) - 最佳实践
2. 使用[快速参考](QUICK_REFERENCE.md) - 常见模式
3. 查看 `tests/` 目录中的示例

#### 排查问题
1. 查看[设置指南](SETUP.md) - 平台特定问题
2. 查看[快速参考](QUICK_REFERENCE.md) - 快速修复
3. 查看[主 README](../README.md) - 一般故障排除

#### 设置环境
1. 遵循[设置指南](SETUP.md) - 完整说明
2. 复制 `env.example` 到 `.env`
3. 配置变量（参见设置指南）

#### 配置通知
1. 参见[主 README](../README.md) - 飞书/Surge 配置
2. 参见[设置指南](SETUP.md) - 详细设置
3. 查看 `env.example` 了解所需变量

---

## 📋 快速链接

### 配置文件
- [`env.example`](../env.example) - 环境变量模板
- [`package.json`](../package.json) - 依赖和脚本
- [`vitest.config.ts`](../vitest.config.ts) - 测试配置

### 测试示例
- [Web 测试](../tests/web/) - Web 应用测试
- [Android 测试](../tests/android/) - Android 应用测试
- [iOS 测试](../tests/ios/) - iOS 应用测试
- [游戏测试](../tests/fbgame/) - Facebook 游戏测试

### 脚本
- [全局设置](../scripts/global-setup.ts) - 测试后钩子
- [飞书报告器](../scripts/send-feishu-report.ts) - 报告通知

---

## 🎯 按平台分类的文档

### Web 测试
- **设置：** [设置指南 - Web 部分](SETUP.md#web-测试设置)
- **示例：** `tests/web/`
- **关键 API：** Playwright、PlaywrightAgent

### Android 测试
- **设置：** [设置指南 - Android 部分](SETUP.md#android-设置)
- **示例：** `tests/android/`
- **关键 API：** agentFromAdbDevice、getConnectedDevices
- **快速提示：** [快速参考 - Android](QUICK_REFERENCE.md#android)

### iOS 测试
- **设置：** [设置指南 - iOS 部分](SETUP.md#ios-设置)
- **示例：** `tests/ios/`
- **关键 API：** agentFromWebDriverAgent
- **快速提示：** [快速参考 - iOS](QUICK_REFERENCE.md#ios)

---

## 🔍 常见主题

### 环境变量
- **模板：** [`env.example`](../env.example)
- **文档：** [设置指南 - 环境配置](SETUP.md#环境配置)
- **快速参考：** [环境变量参考](QUICK_REFERENCE.md#环境变量参考)

### 测试报告
- **概览：** [主 README - 测试报告](../README.md#-测试报告)
- **配置：** [设置指南 - Surge 配置](SETUP.md#可选-surge-报告托管)
- **位置：** `midscene_run/report/`

### 认证
- **Web 认证：** [主 README - 认证管理](../README.md#-认证管理)
- **示例：** `tests/web/sauce/auth.setup.test.ts`

### 通知
- **飞书设置：** [主 README - 飞书通知](../README.md#飞书通知)
- **配置：** [设置指南 - 飞书配置](SETUP.md#可选-飞书通知)

---

## 📦 项目结构

```
midscene-tests/
├── README.md                  # 主文档（从这里开始）
├── env.example               # 环境变量模板
├── package.json              # 项目配置
├── vitest.config.ts         # 测试框架配置
│
├── docs/                    # 📚 本目录
│   ├── README.md           # 本文件（文档索引）
│   ├── SETUP.md            # 完整设置指南
│   ├── CONTRIBUTING.md     # 贡献指南
│   └── QUICK_REFERENCE.md  # 快速参考/速查表
│
├── tests/                   # 测试文件
│   ├── android/            # Android 测试
│   ├── ios/                # iOS 测试
│   ├── web/                # Web 测试
│   └── fbgame/             # 游戏测试
│
├── scripts/                 # 工具脚本
│   ├── global-setup.ts     # 测试后钩子
│   └── send-feishu-report.ts
│
└── midscene_run/           # 测试输出（自动生成）
    ├── dump/               # 测试产物
    ├── log/                # 日志
    └── report/             # HTML 报告
```

---

## 🆘 需要帮助？

### 循序渐进的方法

1. **查看文档**
   - 在此索引中搜索你的主题
   - 阅读相关部分

2. **查看示例**
   - 检查 `tests/` 目录
   - 找到类似的测试用例

3. **尝试快速修复**
   - [快速参考 - 故障排除](QUICK_REFERENCE.md#故障快速修复)
   - [设置指南 - 故障排除](SETUP.md#故障排除)

4. **查阅外部资源**
   - [Midscene.js 文档](https://midscenejs.com/)
   - [Vitest 文档](https://vitest.dev/)
   - [Playwright 文档](https://playwright.dev/)

---

## 🔄 保持文档更新

在对项目进行更改时：

- ✅ 更新相关文档
- ✅ 为新功能添加示例
- ✅ 更新环境变量模板
- ✅ 保持故障排除部分最新
- ✅ 如添加新文档，更新此索引

---

## 📝 文档标准

所有文档应该：

- 清晰简洁
- 包含实际示例
- 解释"为什么"而不仅仅是"如何"
- 随代码变更保持更新
- 使用一致的格式和风格

---

## 🌟 快速开始路径

### 新用户
1. [主 README](../README.md) → 概览
2. [设置指南](SETUP.md) → 设置你的平台
3. 运行测试 → 验证设置
4. [贡献指南](CONTRIBUTING.md) → 编写测试

### 现有用户
1. [快速参考](QUICK_REFERENCE.md) → 找到你需要的
2. 编写/运行测试
3. 如需要，查看故障排除

### 贡献者
1. [贡献指南](CONTRIBUTING.md) → 指南
2. [快速参考](QUICK_REFERENCE.md) → 模式
3. 提交你的更改

---

<div align="center">

**文档索引完成！📚**

[返回主 README](../README.md)

</div>
