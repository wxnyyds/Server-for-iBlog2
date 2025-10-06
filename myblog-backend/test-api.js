/**
 * API 测试脚本
 * 使用 node test-api.js 运行
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
let testResults = [];
let articleId = null;
let commentId = null;

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

// HTTP 请求封装
function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// 测试用例记录
function logTest(name, passed, message = '') {
  const status = passed ? `${colors.green}✓ 通过${colors.reset}` : `${colors.red}✗ 失败${colors.reset}`;
  console.log(`  ${status} ${name}${message ? ': ' + message : ''}`);
  testResults.push({ name, passed, message });
}

// 测试分组标题
function logGroup(title) {
  console.log(`\n${colors.blue}【${title}】${colors.reset}`);
}

// 等待服务器启动
async function waitForServer(retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await request('GET', '/api/health');
      if (res.status === 200) {
        console.log(`${colors.green}✓ 服务器连接成功${colors.reset}\n`);
        return true;
      }
    } catch (e) {
      if (i < retries - 1) {
        console.log(`等待服务器启动... (${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  console.log(`${colors.red}✗ 无法连接到服务器${colors.reset}`);
  return false;
}

// 1. 测试健康检查接口
async function testHealthCheck() {
  logGroup('健康检查接口');
  
  try {
    const res = await request('GET', '/api/health');
    logTest('GET /api/health', res.status === 200 && res.body.success === true);
  } catch (error) {
    logTest('GET /api/health', false, error.message);
  }
}

// 2. 测试文章列表接口
async function testGetArticles() {
  logGroup('文章列表接口');
  
  try {
    const res = await request('GET', '/api/articles');
    const passed = res.status === 200 && Array.isArray(res.body);
    logTest('GET /api/articles', passed, passed ? `获取到 ${res.body.length} 篇文章` : '');
    
    if (passed && res.body.length > 0) {
      articleId = res.body[0].id;
      const firstArticle = res.body[0];
      const hasRequiredFields = firstArticle.id && firstArticle.title && firstArticle.date;
      logTest('文章数据结构正确', hasRequiredFields, 
        `包含必需字段: id, title, date`);
    }
  } catch (error) {
    logTest('GET /api/articles', false, error.message);
  }
}

// 3. 测试获取单篇文章
async function testGetArticleById() {
  logGroup('获取单篇文章接口');
  
  if (!articleId) {
    logTest('GET /api/articles/:id', false, '没有可用的文章ID');
    return;
  }

  try {
    const res = await request('GET', `/api/articles/${articleId}`);
    const passed = res.status === 200 && res.body.id && res.body.content;
    logTest(`GET /api/articles/${articleId}`, passed, 
      passed ? `获取文章: ${res.body.title}` : '');
    
    if (passed) {
      const hasRequiredFields = res.body.id && res.body.title && res.body.content && res.body.date;
      logTest('文章详情数据完整', hasRequiredFields, 
        `包含: id, title, content, date`);
    }
  } catch (error) {
    logTest(`GET /api/articles/${articleId}`, false, error.message);
  }

  // 测试不存在的文章
  try {
    const res = await request('GET', '/api/articles/99999');
    logTest('GET /api/articles/99999 (不存在)', res.status === 404, 
      res.status === 404 ? '正确返回404' : `返回了${res.status}`);
  } catch (error) {
    logTest('GET /api/articles/99999', false, error.message);
  }
}

// 4. 测试创建文章
async function testCreateArticle() {
  logGroup('创建文章接口');
  
  const newArticle = {
    title: '测试文章',
    content: '这是一篇测试文章的内容，用于测试API接口。\n\n## 标题\n\n测试内容',
    summary: '这是测试文章的摘要',
    date: '2025-01-10'
  };

  try {
    const res = await request('POST', '/api/articles', newArticle);
    const passed = res.status === 201 && res.body.success === true;
    logTest('POST /api/articles', passed, 
      passed ? `创建成功，文章ID: ${res.body.data.id}` : `状态码: ${res.status}`);
    
    if (passed) {
      articleId = res.body.data.id;
    }
  } catch (error) {
    logTest('POST /api/articles', false, error.message);
  }

  // 测试缺少必填字段
  try {
    const res = await request('POST', '/api/articles', { title: '只有标题' });
    logTest('POST /api/articles (缺少必填字段)', res.status === 400, 
      res.status === 400 ? '正确返回400错误' : `返回了${res.status}`);
  } catch (error) {
    logTest('POST /api/articles (缺少必填字段)', false, error.message);
  }
}

// 5. 测试更新文章
async function testUpdateArticle() {
  logGroup('更新文章接口');
  
  if (!articleId) {
    logTest('PUT /api/articles/:id', false, '没有可用的文章ID');
    return;
  }

  const updateData = {
    title: '更新后的测试文章',
    summary: '这是更新后的摘要'
  };

  try {
    const res = await request('PUT', `/api/articles/${articleId}`, updateData);
    const passed = res.status === 200 && res.body.success === true;
    logTest(`PUT /api/articles/${articleId}`, passed, 
      passed ? '文章更新成功' : `状态码: ${res.status}`);
  } catch (error) {
    logTest(`PUT /api/articles/${articleId}`, false, error.message);
  }

  // 测试更新不存在的文章
  try {
    const res = await request('PUT', '/api/articles/99999', updateData);
    logTest('PUT /api/articles/99999 (不存在)', res.status === 404, 
      res.status === 404 ? '正确返回404' : `返回了${res.status}`);
  } catch (error) {
    logTest('PUT /api/articles/99999', false, error.message);
  }
}

// 6. 测试获取文章评论
async function testGetComments() {
  logGroup('获取文章评论接口');
  
  if (!articleId) {
    logTest('GET /api/comments/articles/:id/comments', false, '没有可用的文章ID');
    return;
  }

  try {
    const res = await request('GET', `/api/comments/articles/${articleId}/comments`);
    const passed = res.status === 200 && Array.isArray(res.body);
    logTest(`GET /api/comments/articles/${articleId}/comments`, passed, 
      passed ? `获取到 ${res.body.length} 条评论` : `状态码: ${res.status}`);
  } catch (error) {
    logTest(`GET /api/comments/articles/${articleId}/comments`, false, error.message);
  }

  // 测试不存在的文章评论
  try {
    const res = await request('GET', '/api/comments/articles/99999/comments');
    logTest('GET /api/comments/articles/99999/comments (不存在)', res.status === 404);
  } catch (error) {
    logTest('GET /api/comments/articles/99999/comments', false, error.message);
  }
}

// 7. 测试创建评论
async function testCreateComment() {
  logGroup('创建评论接口');
  
  if (!articleId) {
    logTest('POST /api/comments/articles/:id/comments', false, '没有可用的文章ID');
    return;
  }

  const newComment = {
    nickname: '测试用户',
    content: '这是一条测试评论，用于验证评论功能是否正常工作。'
  };

  try {
    const res = await request('POST', `/api/comments/articles/${articleId}/comments`, newComment);
    const passed = res.status === 201 && res.body.success === true;
    logTest(`POST /api/comments/articles/${articleId}/comments`, passed, 
      passed ? `评论创建成功，ID: ${res.body.data.id}` : `状态码: ${res.status}`);
    
    if (passed) {
      commentId = res.body.data.id;
      const hasRequiredFields = res.body.data.nickname && res.body.data.content && res.body.data.time;
      logTest('评论数据结构正确', hasRequiredFields, 
        `包含: id, nickname, content, time`);
    }
  } catch (error) {
    logTest(`POST /api/comments/articles/${articleId}/comments`, false, error.message);
  }

  // 测试缺少必填字段
  try {
    const res = await request('POST', `/api/comments/articles/${articleId}/comments`, { nickname: '只有昵称' });
    logTest('POST (缺少必填字段)', res.status === 400, 
      res.status === 400 ? '正确返回400错误' : `返回了${res.status}`);
  } catch (error) {
    logTest('POST (缺少必填字段)', false, error.message);
  }
}

// 8. 测试文件上传接口 (仅测试接口存在性)
async function testUploadEndpoint() {
  logGroup('文件上传接口');
  
  try {
    const res = await request('POST', '/api/upload');
    // 没有文件应该返回400
    const passed = res.status === 400;
    logTest('POST /api/upload (无文件)', passed, 
      passed ? '正确处理无文件上传' : `状态码: ${res.status}`);
  } catch (error) {
    logTest('POST /api/upload', false, error.message);
  }

  try {
    const res = await request('GET', '/api/upload');
    const passed = res.status === 200;
    logTest('GET /api/upload', passed, 
      passed ? '文件列表接口正常' : `状态码: ${res.status}`);
  } catch (error) {
    logTest('GET /api/upload', false, error.message);
  }
}

// 9. 测试删除评论
async function testDeleteComment() {
  logGroup('删除评论接口');
  
  if (!commentId) {
    logTest('DELETE /api/comments/:id', false, '没有可用的评论ID');
    return;
  }

  try {
    const res = await request('DELETE', `/api/comments/${commentId}`);
    const passed = res.status === 200 && res.body.success === true;
    logTest(`DELETE /api/comments/${commentId}`, passed, 
      passed ? '评论删除成功' : `状态码: ${res.status}`);
  } catch (error) {
    logTest(`DELETE /api/comments/${commentId}`, false, error.message);
  }

  // 测试删除不存在的评论
  try {
    const res = await request('DELETE', '/api/comments/99999');
    logTest('DELETE /api/comments/99999 (不存在)', res.status === 404);
  } catch (error) {
    logTest('DELETE /api/comments/99999', false, error.message);
  }
}

// 10. 测试删除文章
async function testDeleteArticle() {
  logGroup('删除文章接口');
  
  if (!articleId) {
    logTest('DELETE /api/articles/:id', false, '没有可用的文章ID');
    return;
  }

  try {
    const res = await request('DELETE', `/api/articles/${articleId}`);
    const passed = res.status === 200 && res.body.success === true;
    logTest(`DELETE /api/articles/${articleId}`, passed, 
      passed ? '文章删除成功' : `状态码: ${res.status}`);
  } catch (error) {
    logTest(`DELETE /api/articles/${articleId}`, false, error.message);
  }

  // 测试删除不存在的文章
  try {
    const res = await request('DELETE', '/api/articles/99999');
    logTest('DELETE /api/articles/99999 (不存在)', res.status === 404);
  } catch (error) {
    logTest('DELETE /api/articles/99999', false, error.message);
  }
}

// 运行所有测试
async function runAllTests() {
  console.log(`${colors.yellow}========================================`);
  console.log('  博客API接口测试');
  console.log(`========================================${colors.reset}`);
  
  // 等待服务器准备就绪
  const serverReady = await waitForServer();
  if (!serverReady) {
    console.log(`\n${colors.red}测试终止：服务器未就绪${colors.reset}`);
    process.exit(1);
  }

  // 执行测试
  await testHealthCheck();
  await testGetArticles();
  await testGetArticleById();
  await testCreateArticle();
  await testUpdateArticle();
  await testGetComments();
  await testCreateComment();
  await testUploadEndpoint();
  await testDeleteComment();
  await testDeleteArticle();

  // 统计结果
  const total = testResults.length;
  const passed = testResults.filter(r => r.passed).length;
  const failed = total - passed;

  console.log(`\n${colors.yellow}========================================`);
  console.log('  测试结果统计');
  console.log(`========================================${colors.reset}`);
  console.log(`总测试数: ${total}`);
  console.log(`${colors.green}通过: ${passed}${colors.reset}`);
  console.log(`${colors.red}失败: ${failed}${colors.reset}`);
  console.log(`通过率: ${((passed / total) * 100).toFixed(2)}%`);
  
  if (failed > 0) {
    console.log(`\n${colors.red}失败的测试:${colors.reset}`);
    testResults.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.message}`);
    });
  }

  console.log(`\n${failed === 0 ? colors.green + '✓ 所有测试通过！' : colors.red + '✗ 部分测试失败'}${colors.reset}\n`);
  
  process.exit(failed === 0 ? 0 : 1);
}

// 运行测试
runAllTests().catch(error => {
  console.error(`${colors.red}测试执行出错:${colors.reset}`, error);
  process.exit(1);
});
