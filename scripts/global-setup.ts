import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const execAsync = promisify(exec);

// 使用文件锁防止重复发送
const lockFile = path.join(process.cwd(), '.report-send-lock');
let hasRun = false;

export default async function globalSetup() {
  // 清理旧的锁文件
  if (fs.existsSync(lockFile)) {
    fs.unlinkSync(lockFile);
  }
  
  // Return a teardown function that will run after all tests
  return async () => {
    // 检查是否禁用通知（用于调试）
    if (process.env.DISABLE_FEISHU_NOTIFY === 'true') {
      console.log('📤 Feishu notification disabled (DISABLE_FEISHU_NOTIFY=true)');
      return;
    }
    // 检查是否已经运行过
    if (hasRun || fs.existsSync(lockFile)) {
      console.log('📤 Feishu notification already sent, skipping...');
      return;
    }
    
    // 标记为已运行
    hasRun = true;
    fs.writeFileSync(lockFile, Date.now().toString());
    
    // 等待一下确保报告已生成
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 发送飞书通知
    try {
      console.log('\n📤 Sending test report to Feishu...');
      await execAsync('npx tsx scripts/send-feishu-report.ts');
    } catch (error) {
      console.error('Failed to send Feishu notification:', error);
      // 不让发送失败影响测试结果
    } finally {
      // 延迟清理锁文件，给足够的时间让其他可能的调用看到锁
      setTimeout(() => {
        if (fs.existsSync(lockFile)) {
          fs.unlinkSync(lockFile);
        }
      }, 5000);
    }
  };
}

