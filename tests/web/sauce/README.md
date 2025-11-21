# Sauce Demo 测试用例

## 文件说明

- `login.test.ts` - 登录功能测试示例（原始示例，保持不变）
- `auth.setup.test.ts` - 登录状态设置测试（使用 vitest 框架，保存登录状态到本地）
- `add-cart.test.ts` - 添加商品到购物车测试用例（使用保存的登录状态）

## ⏰ 登录状态有效期

**重要**: Sauce Demo 的登录状态有效期约为 **10 分钟**。建议每次测试前重新生成登录状态。

## 使用方法

### 方式 1：一键运行（推荐）

自动设置登录状态并运行测试：

```bash
npm run test:sauce-cart
```

### 方式 2：分步运行

#### 1. 设置登录状态

```bash
npm run setup:sauce-auth
```

或者直接运行：

```bash
npx vitest run tests/web/sauce/auth.setup.test.ts
```

这个脚本会：
- 使用 vitest 框架运行测试
- 自动打开浏览器
- 访问 Sauce Demo 网站 (https://www.saucedemo.com)
- 使用 Playwright 原生方法执行登录操作
- 等待跳转到商品页面 (https://www.saucedemo.com/inventory.html)
- 将登录状态保存到 `.auth/sauce-user.json` 文件

#### 2. 运行测试用例

⚠️ **注意**: 请在 10 分钟内运行测试，否则登录状态会过期。

```bash
# 运行添加商品测试
npx vitest run tests/web/sauce/add-cart.test.ts

# 或者运行所有 web 测试
npm run test:web
```

**说明**: 测试会直接访问 `https://www.saucedemo.com/inventory.html`（商品页），并自动应用保存的登录状态。

### 3. 测试用例说明

#### `auth.setup.test.ts`
- 使用 vitest 测试框架（和 login.test.ts 一致）
- 使用 Playwright 原生方法执行登录（更稳定）
- 在 inventory.html 页面保存登录状态

#### `add-cart.test.ts`
使用登录状态测试核心购物车功能：
- ✅ 验证已登录状态（确保登录状态保存功能正常）
- ✅ 添加商品到购物车（核心购物车功能）

## 注意事项

1. ⏰ **登录状态有效期仅约 10 分钟** - 建议使用 `npm run test:sauce-cart` 一键运行
2. 🔒 `.auth/` 目录已添加到 `.gitignore`，不会提交到版本控制
3. 🔄 如果测试失败提示未登录，重新运行 `npm run setup:sauce-auth` 即可
4. 🖥️ 每个新的环境（新机器、新容器等）都需要运行一次登录设置
5. 🔗 多个测试文件可以共享同一个登录状态文件（10 分钟内有效）

## 优势

使用登录状态保存的优势：
- 🚀 **提高测试速度**：避免每个测试都重复登录
- 🔄 **跨测试复用**：多个测试文件可以共享登录状态
- 💰 **节省 API 调用**：减少不必要的 AI 登录操作
- 🎯 **测试关注点分离**：登录和业务逻辑测试分开
- 🔧 **使用原生方法**：登录使用 Playwright 原生方法，更稳定可靠
- 📝 **vitest 框架**：统一使用 vitest 测试框架，保持一致性