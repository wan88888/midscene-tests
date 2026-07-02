import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import 'dotenv/config';

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

function getSpacesClient(): S3Client | null {
  const accessKeyId = process.env.DO_SPACES_KEY;
  const secretAccessKey = process.env.DO_SPACES_SECRET;
  const region = process.env.DO_SPACES_REGION;

  if (!accessKeyId || !secretAccessKey || !region) {
    console.log('⚠ DigitalOcean Spaces not configured. Set DO_SPACES_KEY, DO_SPACES_SECRET, and DO_SPACES_REGION in .env');
    return null;
  }

  return new S3Client({
    endpoint: `https://${region}.digitaloceanspaces.com`,
    region: 'us-east-1',
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: false,
  });
}

function getPublicObjectUrl(bucket: string, region: string, objectKey: string): string {
  const cdnEnabled = process.env.DO_SPACES_CDN === 'true';
  const host = cdnEnabled
    ? `${bucket}.${region}.cdn.digitaloceanspaces.com`
    : `${bucket}.${region}.digitaloceanspaces.com`;
  return `https://${host}/${objectKey}`;
}

async function uploadToDigitalOceanSpaces(reportPath: string): Promise<string | null> {
  const client = getSpacesClient();
  if (!client) {
    return null;
  }

  const bucket = process.env.DO_SPACES_BUCKET;
  if (!bucket) {
    console.log('⚠ DO_SPACES_BUCKET not configured in .env');
    return null;
  }

  const region = process.env.DO_SPACES_REGION!;
  const prefix = (process.env.DO_SPACES_PREFIX || 'reports/').replace(/\/?$/, '/');
  const fileName = path.basename(reportPath);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const objectKey = `${prefix}${timestamp}-${fileName}`;

  try {
    const body = fs.readFileSync(reportPath);

    console.log(`Uploading report to DigitalOcean Spaces (${bucket})...`);

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: body,
        ContentType: 'text/html; charset=utf-8',
        ACL: 'public-read',
      }),
    );

    const publicUrl = getPublicObjectUrl(bucket, region, objectKey);
    console.log(`✓ Report uploaded to DigitalOcean Spaces: ${publicUrl}`);
    return publicUrl;
  } catch (error: any) {
    const aclNotSupported =
      error?.name === 'AccessControlListNotSupported' ||
      error?.Code === 'AccessControlListNotSupported' ||
      error?.message?.includes('AccessControlListNotSupported');

    if (!aclNotSupported) {
      console.error('Failed to upload to DigitalOcean Spaces:', error?.message || error);
      return null;
    }

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: objectKey,
          Body: fs.readFileSync(reportPath),
          ContentType: 'text/html; charset=utf-8',
        }),
      );

      const expiresIn = Number(process.env.DO_SPACES_URL_EXPIRES_IN || 7 * 24 * 60 * 60);
      const signedUrl = await getSignedUrl(
        client,
        new GetObjectCommand({ Bucket: bucket, Key: objectKey }),
        { expiresIn },
      );

      console.log(`✓ Report uploaded to DigitalOcean Spaces (signed URL, ${expiresIn}s): ${signedUrl}`);
      return signedUrl;
    } catch (retryError: any) {
      console.error('Failed to upload to DigitalOcean Spaces:', retryError?.message || retryError);
      return null;
    }
  }
}

async function uploadReportToServer(reportPath: string): Promise<string | null> {
  const reportUrl = await uploadToDigitalOceanSpaces(reportPath);

  if (!reportUrl) {
    console.log('⚠ DigitalOcean Spaces upload failed. Report will only show local path in notification.');
  }

  return reportUrl;
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
    message.card.elements.push({
      tag: 'div',
      text: {
        content: `**本地路径:** \`${reportPath}\`\n\n💡 配置 DigitalOcean Spaces 后可生成在线链接`,
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
