# eSIM 测试用例

## 环境配置

在运行测试之前，需要在项目根目录创建 `.env` 文件并配置以下环境变量：

```bash
# 复制 .env.example 文件
cp .env.example .env
```

然后编辑 `.env` 文件，填入实际的配置：

```env
# OpenAI API Key (必需)
OPENAI_API_KEY=sk-your-actual-openai-key

# Google 账号凭证 (用于 eSIM 登录测试)
GOOGLE_EMAIL=your-email@example.com
GOOGLE_PASSWORD=your-password
```

⚠️ **重要**：`.env` 文件已添加到 `.gitignore`，不会被提交到 Git 仓库。

## 文件说明

- `login.test.ts` - Google 登录并保存登录状态测试

## 使用方法

### 设置登录状态

```bash
npm run setup:esim-auth
```

这个脚本会：
1. 打开浏览器访问 https://esimnum.com/home
2. 使用 AI 点击 "Login" 和 "Continue with Google"
3. 使用配置的 Google 账号自动登录
4. 将登录状态保存到 `.auth/esim-user.json`

### 使用已保存的登录状态

登录状态设置完成后，可以在其他测试中重用：

```typescript
const authFile = path.join(process.cwd(), '.auth', 'esim-user.json');

const context = await browser.newContext({
  storageState: authFile, // 加载已保存的登录状态
});
```

## 安全提示

1. 🔐 **不要硬编码密码** - 始终使用环境变量存储敏感信息
2. 📝 **使用测试专用账号** - 建议创建专门用于测试的 Google 账号
3. 🔄 **定期更新密码** - 如果密码更改，记得更新 `.env` 文件
4. ⚠️ **避免频繁登录** - 频繁的自动化登录可能触发 Google 安全机制

## 故障排查

### 问题：Environment variables not set

```
Error: GOOGLE_EMAIL and GOOGLE_PASSWORD must be set in .env file
```

**解决方案**：
1. 确保项目根目录有 `.env` 文件
2. 确保 `.env` 文件中包含 `GOOGLE_EMAIL` 和 `GOOGLE_PASSWORD`

### 问题：登录失败

**可能原因**：
1. Google 账号密码错误
2. Google 需要额外验证（如两步验证）
3. 网络问题

**解决方案**：
1. 检查 `.env` 文件中的账号密码是否正确
2. 使用没有启用两步验证的账号，或修改测试流程支持两步验证
3. 确保网络连接正常

