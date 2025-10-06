# 📝 个人博客后端 API 服务

基于 Express.js + MySQL 构建的RESTful API服务，为个人博客提供文章管理、评论系统和文件上传功能。

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/express-4.18.2-blue)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/mysql-8.0-orange)](https://www.mysql.com/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-success)](./test-api.js)







## ✨ 功能特性

### 核心功能

- 📰 **文章管理** - 完整的CRUD操作，支持Markdown格式
- 💬 **评论系统** - 文章评论功能，支持昵称和内容发布
- 📁 **文件上传** - 图片上传、存储和访问管理
- 🔍 **数据检索** - 高效的文章列表和详情查询
- 🛡️ **安全防护** - SQL注入防护、XSS过滤、文件类型验证

### 技术亮点

- ✅ RESTful API 设计规范
- ✅ Sequelize ORM 数据建模
- ✅ 统一错误处理机制
- ✅ CORS 跨域支持
- ✅ 文件上传安全验证
- ✅ 100% API测试覆盖率

## 🛠️ 技术栈

### 后端框架
- **Express.js** `^4.18.2` - 快速、开放、极简的 Web 开发框架
- **Node.js** `>=14.0.0` - JavaScript 运行时环境

### 数据库
- **MySQL** `8.0+` - 关系型数据库
- **Sequelize** `^6.32.1` - Promise 风格的 Node.js ORM

### 核心依赖
- **multer** `^1.4.5` - 文件上传中间件
- **cors** `^2.8.5` - 跨域资源共享
- **dotenv** `^16.3.1` - 环境变量管理
- **marked** `^9.1.2` - Markdown 解析

### 开发工具
- **nodemon** `^3.0.1` - 自动重启开发服务器

## 🚀 快速开始

### 环境要求

```bash
Node.js >= 14.0.0
MySQL >= 8.0
npm >= 6.0.0
```

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd myblog-backend
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**

创建 `config.env` 文件：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=myblog
DB_USER=root
DB_PASSWORD=123456

# 服务器配置
PORT=3000
NODE_ENV=development

# 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

4. **初始化数据库**
```bash
npm run init-db
```

5. **启动服务**
```bash
# 开发模式（热重载）
npm run dev

# 生产模式
npm start
```

6. **验证运行**

访问：http://localhost:3000/api/health

成功响应：
```json
{
  "success": true,
  "message": "博客API服务运行正常",
  "timestamp": "2025-10-06T08:30:00.000Z"
}
```

## 📚 API文档

### 基础信息

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **Character Set**: `UTF-8`

### 接口概览

| 模块 | 方法 | 路径 | 描述 |
|------|------|------|------|
| **文章** | GET | `/articles` | 获取文章列表 |
| | GET | `/articles/:id` | 获取文章详情 |
| | POST | `/articles` | 创建文章 |
| | PUT | `/articles/:id` | 更新文章 |
| | DELETE | `/articles/:id` | 删除文章 |
| **评论** | GET | `/comments/articles/:id/comments` | 获取文章评论 |
| | POST | `/comments/articles/:id/comments` | 发表评论 |
| | DELETE | `/comments/:id` | 删除评论 |
| **上传** | POST | `/upload` | 上传文件 |
| | GET | `/upload` | 获取文件列表 |
| | DELETE | `/upload/:id` | 删除文件 |

### 快速示例

#### 获取文章列表
```bash
curl http://localhost:3000/api/articles
```

#### 创建文章
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的第一篇文章",
    "content": "这是文章内容",
    "summary": "文章摘要",
    "date": "2025-01-10"
  }'
```

#### 发表评论
```bash
curl -X POST http://localhost:3000/api/comments/articles/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "访客",
    "content": "很棒的文章！"
  }'
```

**完整API文档**: 查看 [API.md](./API.md)

## 📁 项目结构

```
myblog-backend/
├── config/                 # 配置文件
│   └── database.js        # 数据库连接配置
├── controllers/           # 业务逻辑控制器
│   ├── articleController.js
│   ├── commentController.js
│   └── uploadController.js
├── models/                # Sequelize 数据模型
│   ├── Article.js         # 文章模型
│   ├── Comment.js         # 评论模型
│   ├── File.js            # 文件模型
│   └── index.js           # 模型入口
├── routes/                # 路由定义
│   ├── articles.js
│   ├── comments.js
│   └── upload.js
├── middleware/            # 中间件
│   ├── upload.js          # 文件上传处理
│   └── errorHandler.js    # 全局错误处理
├── scripts/               # 工具脚本
│   └── init-database.js   # 数据库初始化
├── uploads/               # 文件上传目录
├── config.env             # 环境变量配置
├── package.json           # 项目依赖
├── app.js                 # 应用入口
├── test-api.js            # API测试脚本
├── API.md                 # API接口文档
└── README.md              # 项目说明
```

## ⚙️ 环境配置

### 开发环境

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=myblog_dev
DB_USER=root
DB_PASSWORD=your_password
```

### 生产环境

```env
NODE_ENV=production
PORT=3000
DB_HOST=your_production_host
DB_PORT=3306
DB_NAME=myblog_prod
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
UPLOAD_PATH=/var/www/uploads
MAX_FILE_SIZE=5242880
```

## 🗄️ 数据库设计

### 表结构

#### articles (文章表)
```sql
CREATE TABLE articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary VARCHAR(500),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (date)
);
```

#### comments (评论表)
```sql
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  article_id INT NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_article_id (article_id),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);
```

#### files (文件表)
```sql
CREATE TABLE files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 数据模型关系

```
Article (1) ----< (N) Comment
```

## 🧪 测试

### 运行测试

```bash
node test-api.js
```

### 测试覆盖

本项目包含 **21个** 自动化测试用例，覆盖：

- ✅ 健康检查接口
- ✅ 文章CRUD操作
- ✅ 评论增删查操作
- ✅ 文件上传接口
- ✅ 错误处理验证（404、400等）
- ✅ 数据验证（必填字段、格式验证）

### 测试结果示例

```
========================================
  测试结果统计
========================================
总测试数: 21
✅ 通过: 21
❌ 失败: 0
通过率: 100.00%

✓ 所有测试通过！
```

## 🚢 部署

### 使用 PM2 部署

1. **安装 PM2**
```bash
npm install -g pm2
```

2. **启动应用**
```bash
pm2 start app.js --name myblog-api
```

3. **查看状态**
```bash
pm2 status
pm2 logs myblog-api
```

4. **设置开机自启**
```bash
pm2 startup
pm2 save
```

### Docker 部署

```dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

构建和运行：
```bash
docker build -t myblog-api .
docker run -p 3000:3000 --env-file config.env myblog-api
```

## 📊 性能优化

- 🔄 数据库连接池配置
- 📇 合理使用索引优化查询
- 🗂️ 静态资源分离部署
- 💾 支持缓存机制扩展
- 📦 响应数据压缩

## 🔒 安全措施

- ✅ Sequelize 预编译查询防止 SQL 注入
- ✅ 文件类型和大小验证
- ✅ CORS 跨域配置
- ✅ 输入数据验证和清理
- ✅ 错误信息安全处理

## 🛣️ 开发路线图

### v1.0.0 (已完成)
- ✅ 基础文章管理
- ✅ 评论系统
- ✅ 文件上传

### v1.1.0 (计划中)
- [ ] 用户认证（JWT）
- [ ] 文章分类和标签
- [ ] 全文搜索功能
- [ ] 评论审核机制





---

**⭐ 如果这个项目对你有帮助，请给个 Star！**

---

<p align="center">
  Made with ❤️ by wxnyyds
</p>


<p align="center">
  <sub>最后更新: 2025-10-06</sub>
</p>

