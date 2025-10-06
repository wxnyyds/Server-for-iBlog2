const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

// 导入数据库和模型
const { testConnection, syncDatabase } = require('./models');

// 导入路由
const articlesRouter = require('./routes/articles');
const commentsRouter = require('./routes/comments');
const uploadRouter = require('./routes/upload');

// 导入中间件
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 提供上传文件的访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API路由
app.use('/api/articles', articlesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/upload', uploadRouter);

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '博客API服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '欢迎使用博客API服务',
    version: '1.0.0',
    endpoints: {
      articles: '/api/articles',
      comments: '/api/comments',
      upload: '/api/upload',
      health: '/api/health'
    }
  });
});

// 404处理
app.use(notFound);

// 错误处理
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await testConnection();
    
    // 同步数据库表
    await syncDatabase();
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器启动成功！`);
      console.log(`📍 服务地址: http://localhost:${PORT}`);
      console.log(`📚 API文档: http://localhost:${PORT}/api/health`);
      console.log(`📁 上传目录: ${path.join(__dirname, 'uploads')}`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error.message);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 收到SIGTERM信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 收到SIGINT信号，正在关闭服务器...');
  process.exit(0);
});

startServer();

module.exports = app;
