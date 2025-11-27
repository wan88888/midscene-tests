# 设置指南

不同平台上 Midscene 测试的完整设置说明。

---

## 目录

- [通用设置](#通用设置)
- [Android 设置](#android-设置)
- [iOS 设置](#ios-设置)
- [Web 测试设置](#web-测试设置)
- [环境配置](#环境配置)
- [故障排除](#故障排除)

---

## 通用设置

### 1. 安装 Node.js

从 [nodejs.org](https://nodejs.org/) 下载并安装 Node.js 18 或更高版本。

验证安装：
```bash
node --version  # 应显示 v18.x.x 或更高
npm --version   # 应显示 9.x.x 或更高
```

### 2. 安装依赖

```bash
cd midscene-tests
npm install
```

### 3. 配置环境

```bash
# 复制环境模板
cp env.example .env

# 使用你喜欢的编辑器编辑
nano .env
# 或
code .env
```

---

## Android 设置

### 前置要求

1. **Android SDK Platform Tools**
   - 安装 Android Studio，或
   - 从 [developer.android.com](https://developer.android.com/studio/releases/platform-tools) 安装独立平台工具

2. **将 ADB 添加到 PATH**
   
   **macOS/Linux：**
   ```bash
   # 添加到 ~/.bashrc 或 ~/.zshrc
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

   **Windows：**
   - 将 `C:\Users\<你的用户名>\AppData\Local\Android\Sdk\platform-tools` 添加到系统 PATH

3. **验证 ADB 安装**
   ```bash
   adb version
   # 应显示：Android Debug Bridge version x.x.x
   ```

### 设备设置

#### 选项 1：物理设备

1. **启用开发者选项**
   - 进入 设置 → 关于手机
   - 连续点击"版本号" 7 次

2. **启用 USB 调试**
   - 进入 设置 → 开发者选项
   - 启用"USB 调试"

3. **连接设备**
   ```bash
   # 通过 USB 连接
   adb devices
   
   # 应显示：
   # List of devices attached
   # ABC123456789    device
   ```

4. **接受调试提示**
   - 设备上会出现提示
   - 勾选"始终允许来自此计算机"
   - 点击"允许"

#### 选项 2：Android 模拟器

1. **安装 Android Studio**
2. **创建模拟器**
   - 工具 → AVD Manager → Create Virtual Device
   - 选择设备（例如 Pixel 5）
   - 下载系统镜像（Android 11+）
   - 点击"完成"

3. **启动模拟器**
   ```bash
   # 列出可用模拟器
   emulator -list-avds
   
   # 启动模拟器
   emulator -avd <模拟器名称>
   ```

4. **验证连接**
   ```bash
   adb devices
   # 应显示：emulator-5554    device
   ```

### 安装测试应用

安装你想测试的应用：

```bash
# 从 APK 文件安装
adb install path/to/app.apk

# 或在设备上从 Google Play 商店安装
```

### 查找包名

```bash
# 列出所有已安装的包
adb shell pm list packages

# 搜索特定应用
adb shell pm list packages | grep <app-name>

# 获取包详情，包括主 Activity
adb shell dumpsys package <package-name> | grep -A 1 "android.intent.action.MAIN"
```

示例：
```bash
# 查找 Sauce Labs 演示应用
adb shell pm list packages | grep swaglabs
# 输出：package:com.swaglabsmobileapp

# 获取主 Activity
adb shell dumpsys package com.swaglabsmobileapp | grep -A 1 "android.intent.action.MAIN"
# 输出包含：com.swaglabsmobileapp.MainActivity
```

### 配置 Android 包名

添加到 `.env`：
```bash
ANDROID_SAUCE_PACKAGE=com.swaglabsmobileapp/com.swaglabsmobileapp.MainActivity
```

### 测试 Android 设置

```bash
npm test tests/android/sauce/login.test.ts
```

---

## iOS 设置

### 前置要求

⚠️ **需要 macOS** - iOS 测试只能在 macOS 上运行。

1. **Xcode**（最新版本）
   ```bash
   xcode-select --install
   ```

2. **Xcode 命令行工具**
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   ```

3. **iOS 设备或模拟器**

### 安装 WebDriverAgent

iOS 自动化需要 WebDriverAgent。

#### 选项 1：使用 Appium（推荐）

```bash
# 安装 Appium
npm install -g appium

# 安装 XCUITest 驱动（包含 WebDriverAgent）
appium driver install xcuitest

# 验证安装
appium driver list
```

#### 选项 2：手动安装

1. 克隆 WebDriverAgent：
   ```bash
   git clone https://github.com/appium/WebDriverAgent.git
   cd WebDriverAgent
   ```

2. 安装依赖：
   ```bash
   ./Scripts/bootstrap.sh
   ```

3. 在 Xcode 中打开：
   ```bash
   open WebDriverAgent.xcodeproj
   ```

4. 配置签名：
   - 选择 WebDriverAgentRunner target
   - 转到 Signing & Capabilities
   - 选择你的开发团队
   - 更改 bundle identifier（例如 com.yourname.WebDriverAgentRunner）

5. 在设备/模拟器上构建并运行

### 设备设置

#### 选项 1：物理设备

1. **启用开发者模式**（iOS 16+）
   - 设置 → 隐私与安全 → 开发者模式 → 开启
   - 重启设备

2. **信任计算机**
   - 通过 USB 连接设备
   - 会出现信任此计算机的提示
   - 输入设备密码

3. **验证连接**
   ```bash
   # 安装 ideviceinstaller（可选但有用）
   brew install ideviceinstaller
   
   # 列出已连接的设备
   idevice_id -l
   
   # 列出已安装的应用
   ideviceinstaller -l
   ```

#### 选项 2：iOS 模拟器

1. **列出可用模拟器**
   ```bash
   xcrun simctl list devices
   ```

2. **启动模拟器**
   ```bash
   # 启动特定模拟器
   xcrun simctl boot "iPhone 14 Pro"
   
   # 或打开模拟器应用
   open -a Simulator
   ```

### 启动 WebDriverAgent

```bash
# 如果使用 Appium
appium

# 或在 Xcode 中直接运行（在 WebDriverAgentRunner target 上点击运行按钮）
```

验证 WDA 正在运行：
```bash
curl http://localhost:8100/status
# 应返回包含 "ready": true 的 JSON
```

### 查找 Bundle ID

```bash
# 对于模拟器
xcrun simctl listapps booted

# 对于设备（需要 ideviceinstaller）
ideviceinstaller -l

# 或在 Xcode 项目设置中查看
```

### 配置 iOS Bundle ID

添加到 `.env`：
```bash
IOS_MAIL_BUNDLE_ID=com.apple.mobilemail
IOS_EDITOR_BUNDLE_ID=your.app.bundle.id
```

### 测试 iOS 设置

```bash
npm test tests/ios/mail/mail.test.ts
```

---

## Web 测试设置

Web 测试最简单 - 无需设备设置！

### 安装 Playwright 浏览器

```bash
# 安装浏览器
npx playwright install chromium

# 或安装所有浏览器
npx playwright install
```

### 验证设置

```bash
# 检查 Playwright 安装
npx playwright --version
```

### 测试 Web 设置

```bash
npm test tests/web/sauce/login.test.ts
```

---

## 环境配置

### 按平台所需的变量

#### Web 测试
```bash
# 无需特定变量
# 可选：覆盖 URL
SAUCE_DEMO_URL=https://www.saucedemo.com
```

#### Android 测试
```bash
# 至少配置你正在测试的应用
ANDROID_SAUCE_PACKAGE=com.swaglabsmobileapp/com.swaglabsmobileapp.MainActivity
ANDROID_EDITOR_PACKAGE=vidma.video.editor.videomaker/...
```

#### iOS 测试
```bash
# 配置你的应用的 bundle ID
IOS_MAIL_BUNDLE_ID=com.apple.mobilemail
IOS_EDITOR_BUNDLE_ID=your.app.bundle.id
```

### 可选：飞书通知

1. **创建飞书机器人**
   - 打开飞书群组
   - 群设置 → 机器人 → 添加机器人
   - 选择"自定义机器人"
   - 获取 webhook URL

2. **在 .env 中配置**
   ```bash
   FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
   ```

### 可选：Surge 报告托管

1. **登录 Surge**
   ```bash
   npx surge login
   ```

2. **获取令牌**
   ```bash
   npx surge token
   ```

3. **在 .env 中配置**
   ```bash
   SURGE_EMAIL=your@email.com
   SURGE_TOKEN=your-token
   ```

---

## 故障排除

### Android 问题

#### 未找到 ADB
```bash
# 检查 ADB 是否在 PATH 中
which adb

# 如果未找到，添加到 PATH 或使用完整路径
export PATH=$PATH:$HOME/Library/Android/sdk/platform-tools
```

#### 设备未授权
```bash
# 重启 ADB
adb kill-server
adb start-server

# 检查设备授权提示
adb devices
```

#### 应用未安装
```bash
# 检查应用是否已安装
adb shell pm list packages | grep <app-name>

# 如果缺失则安装
adb install <path-to-apk>
```

#### 包名错误
```bash
# 查找正确的包名
adb shell pm list packages

# 获取主 Activity
adb logcat -d | grep "START u0"  # 先启动应用
```

### iOS 问题

#### WebDriverAgent 未运行
```bash
# 检查 WDA 状态
curl http://localhost:8100/status

# 重启 WDA
# 在 Xcode 中重新运行或重启 Appium
```

#### 代码签名错误
- 在 Xcode 中打开 WebDriverAgent
- 选择你的开发团队
- 将 bundle identifier 更改为唯一的

#### 未找到设备
```bash
# 检查 USB 连接
system_profiler SPUSBDataType

# 重启设备
# 重新连接数据线

# 重新信任计算机
```

#### 模拟器无法启动
```bash
# 重置模拟器
xcrun simctl erase all

# 在 Xcode 中删除并重新创建模拟器
```

### Web 问题

#### 未找到浏览器
```bash
# 安装 Playwright 浏览器
npx playwright install chromium
```

#### 端口已被占用
- 检查是否有其他浏览器实例正在运行
- 终止进程或使用不同端口

### 通用问题

#### 测试超时
- 在测试文件中增加超时：
  ```typescript
  vi.setConfig({ testTimeout: 300 * 1000 }); // 5 分钟
  ```

#### 环境变量未加载
- 确保测试文件中导入了 `'dotenv/config'`
- 检查 `.env` 文件是否存在且有正确的值
- `.env` 文件中 `=` 周围不要有空格

#### 飞书通知失败
- 验证 webhook URL 是否正确
- 使用 curl 手动测试 webhook：
  ```bash
  curl -X POST <webhook-url> \
    -H 'Content-Type: application/json' \
    -d '{"msg_type":"text","content":{"text":"test"}}'
  ```

---

## 下一步

设置完成后：

1. ✅ 运行测试以验证一切正常
2. ✅ 阅读 [README.md](../README.md) 了解使用说明
3. ✅ 查看 `tests/` 目录中的示例测试
4. ✅ 编写你自己的测试！

---

## 需要帮助？

- 查看 [README.md](../README.md) 故障排除部分
- 查看 [Midscene.js 文档](https://midscenejs.com/)
- 验证上面你平台的特定要求

---

**设置完成？开始测试吧！🚀**
