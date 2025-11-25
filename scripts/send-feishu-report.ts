import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import 'dotenv/config';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface FeishuMessageCard {
  msg_type: string;
  card: {
    elements: Array<{
      tag: string;
      text?: {
        content: string;
        tag: string;
      };
      actions?: Array<{
        tag: string;
        text: {
          content: string;
          tag: string;
        };
        url: string;
        type: string;
      }>;
    }>;
    header: {
      title: {
        content: string;
        tag: string;
      };
      template: string;
    };
  };
}

// 使用 Surge 托管（推荐 - 免费、简单、快速）
async function uploadToSurge(reportPath: string): Promise<string | null> {
  try {
    const fileName = path.basename(reportPath);
    const timestamp = Date.now();
    
    // 使用环境变量自定义域名，或使用随机生成的域名
    const customDomain = process.env.SURGE_DOMAIN;
    const domain = customDomain || `midscene-report-${timestamp}`;
    
    // 创建临时目录用于 Surge 部署
    const tempDir = path.join(__dirname, '../.surge-temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // 复制报告文件到临时目录并重命名为 index.html
    // 这样访问域名时就直接显示报告
    const destPath = path.join(tempDir, 'index.html');
    fs.copyFileSync(reportPath, destPath);
    
    // 同时保留原文件名的副本，方便直接访问
    const originalNamePath = path.join(tempDir, fileName);
    if (originalNamePath !== destPath) {
      fs.copyFileSync(reportPath, originalNamePath);
    }
    
    console.log('Uploading report to Surge...');
    
    // 执行 surge 命令
    // --project: 指定要上传的目录
    // --domain: 指定域名
    const surgeCmd = `npx surge --project "${tempDir}" --domain "${domain}.surge.sh"`;
    const { stdout, stderr } = await execAsync(surgeCmd, {
      env: {
        ...process.env,
        // Surge 需要这些环境变量来自动登录
        SURGE_LOGIN: process.env.SURGE_EMAIL || '',
        SURGE_TOKEN: process.env.SURGE_TOKEN || '',
      }
    });
    
    // 清理临时目录
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      // 忽略清理错误
    }
    
    const url = `https://${domain}.surge.sh`;
    console.log(`✓ Report uploaded to Surge: ${url}`);
    console.log(`✓ Report is publicly accessible and will remain online`);
    
    return url;
  } catch (error: any) {
    console.error('Failed to upload to Surge:', error?.message || error);
    
    // 如果是因为未登录，给出提示
    if (error?.message?.includes('Not Authorized') || error?.message?.includes('login')) {
      console.log('\n💡 Surge requires login. Run the following commands:');
      console.log('   1. npx surge login');
      console.log('   2. Or set SURGE_EMAIL and SURGE_TOKEN in .env file\n');
    }
    
    return null;
  }
}

async function uploadReportToServer(reportPath: string): Promise<string | null> {
  // 使用 Surge 上传报告
  const surgeUrl = await uploadToSurge(reportPath);
  
  if (!surgeUrl) {
    console.log('⚠ Surge upload failed. Please run "npx surge login" first.');
    console.log('⚠ Report will only show local path in notification.');
  }
  
  return surgeUrl;
}

function getLatestReport(): string | null {
  const reportDir = path.join(__dirname, '../midscene_run/report');
  
  if (!fs.existsSync(reportDir)) {
    console.log('Report directory not found');
    return null;
  }

  const files = fs.readdirSync(reportDir)
    .filter(file => file.endsWith('.html'))
    .map(file => ({
      name: file,
      path: path.join(reportDir, file),
      mtime: fs.statSync(path.join(reportDir, file)).mtime
    }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  return files.length > 0 ? files[0].path : null;
}

function sendFeishuMessage(webhook: string, message: FeishuMessageCard): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = new URL(webhook);
    const protocol = url.protocol === 'https:' ? https : http;
    const postData = JSON.stringify(message);

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = protocol.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✓ Feishu notification sent successfully');
          resolve();
        } else {
          console.error(`✗ Feishu notification failed: ${res.statusCode}`);
          console.error(data);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('✗ Error sending Feishu notification:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  const webhook = process.env.FEISHU_WEBHOOK;

  if (!webhook) {
    console.log('⚠ FEISHU_WEBHOOK not configured, skipping notification');
    return;
  }

  const reportPath = getLatestReport();

  if (!reportPath) {
    console.log('⚠ No test report found');
    return;
  }

  const reportName = path.basename(reportPath);
  const reportUrl = await uploadReportToServer(reportPath);
  
  // 构建飞书消息
  const message: FeishuMessageCard = {
    msg_type: 'interactive',
    card: {
      header: {
        title: {
          content: '🧪 Midscene 测试报告',
          tag: 'plain_text'
        },
        template: reportUrl ? 'green' : 'blue'
      },
      elements: [
        {
          tag: 'div',
          text: {
            content: `**测试时间:** ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n**报告文件:** ${reportName}`,
            tag: 'lark_md'
          }
        }
      ]
    }
  };

  // 如果有报告URL，添加查看按钮
  if (reportUrl) {
    message.card.elements.push({
      tag: 'action',
      actions: [
        {
          tag: 'button',
          text: {
            content: '📊 查看测试报告',
            tag: 'plain_text'
          },
          url: reportUrl,
          type: 'primary'
        }
      ]
    });
  } else {
    // 没有URL时显示本地路径和配置提示
    message.card.elements.push({
      tag: 'div',
      text: {
        content: `**本地路径:** \`${reportPath}\`\n\n💡 配置 Surge 后可生成在线链接`,
        tag: 'lark_md'
      }
    });
  }

  try {
    await sendFeishuMessage(webhook, message);
  } catch (error) {
    console.error('Failed to send Feishu notification:', error);
    process.exit(1);
  }
}

main();

