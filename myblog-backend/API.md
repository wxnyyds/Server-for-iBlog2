# 个人博客 API 接口文档

## 基本信息

- **服务地址**: `http://localhost:3000`
- **数据格式**: JSON
- **字符编码**: UTF-8

## 接口列表

### 1. 健康检查

#### 1.1 服务状态检查

**接口地址**: `GET /api/health`

**功能说明**: 检查API服务是否正常运行

**请求参数**: 无

**响应示例**:
```json
{
  "success": true,
  "message": "博客API服务运行正常",
  "timestamp": "2025-10-06T08:30:00.000Z"
}
```

---

## 2. 文章管理接口

### 2.1 获取文章列表

**接口地址**: `GET /api/articles`

**功能说明**: 获取所有已发布文章的列表，按日期倒序排列

**请求参数**: 无

**响应示例**:
```json
[
  {
    "id": 1,
    "title": "网站介绍",
    "date": "2025-09-25",
    "summary": "这是我的个人博客主页，会不定期在这里发布内容..."
  },
  {
    "id": 2,
    "title": "马龙乒乓球传奇",
    "date": "2025-09-26",
    "summary": "在乒乓球运动的历史长河中，马龙的名字如同一座巍峨的丰碑..."
  }
]
```

**字段说明**:
- `id`: 文章ID（整数）
- `title`: 文章标题（字符串）
- `date`: 文章日期（日期格式：YYYY-MM-DD）
- `summary`: 文章摘要（字符串，可为null）

---

### 2.2 获取单篇文章详情

**接口地址**: `GET /api/articles/:id`

**功能说明**: 根据文章ID获取文章的完整内容

**请求参数**:
- `id`: 文章ID（路径参数）

**响应示例**:
```json
{
  "id": 1,
  "title": "网站介绍",
  "content": "这是我的个人博客主页，会不定期在这里发布内容。我会在这里分享我的生活，想法或者一些学习笔记，欢迎大家访问！",
  "date": "2025-09-25"
}
```

**字段说明**:
- `id`: 文章ID（整数）
- `title`: 文章标题（字符串）
- `content`: 文章内容，Markdown格式（字符串）
- `date`: 文章日期（日期格式：YYYY-MM-DD）

**错误响应**:
```json
{
  "success": false,
  "message": "文章不存在"
}
```
HTTP状态码: 404

---

### 2.3 创建文章（管理员功能）

**接口地址**: `POST /api/articles`

**功能说明**: 创建一篇新文章

**请求头**:
```
Content-Type: application/json
```

**请求参数**:
```json
{
  "title": "新文章标题",
  "content": "文章内容，支持Markdown格式\n\n## 小标题\n\n正文内容...",
  "summary": "文章摘要（可选）",
  "date": "2025-01-10"
}
```

**字段说明**:
- `title`: 文章标题（必填，字符串）
- `content`: 文章内容（必填，字符串，支持Markdown）
- `summary`: 文章摘要（可选，字符串）
- `date`: 文章日期（必填，日期格式：YYYY-MM-DD）

**成功响应**:
```json
{
  "success": true,
  "data": {
    "id": 4,
    "title": "新文章标题",
    "date": "2025-01-10"
  }
}
```
HTTP状态码: 201

**错误响应**:
```json
{
  "success": false,
  "message": "标题、内容和日期为必填项"
}
```
HTTP状态码: 400

---

### 2.4 更新文章（管理员功能）

**接口地址**: `PUT /api/articles/:id`

**功能说明**: 更新指定ID的文章信息

**请求参数**:
- `id`: 文章ID（路径参数）

**请求体**:
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容",
  "summary": "更新后的摘要",
  "date": "2025-01-11"
}
```

**字段说明**: 所有字段都是可选的，只更新提供的字段

**成功响应**:
```json
{
  "success": true,
  "message": "文章更新成功"
}
```
HTTP状态码: 200

**错误响应**:
```json
{
  "success": false,
  "message": "文章不存在"
}
```
HTTP状态码: 404

---

### 2.5 删除文章（管理员功能）

**接口地址**: `DELETE /api/articles/:id`

**功能说明**: 删除指定ID的文章（级联删除该文章的所有评论）

**请求参数**:
- `id`: 文章ID（路径参数）

**成功响应**:
```json
{
  "success": true,
  "message": "文章删除成功"
}
```
HTTP状态码: 200

**错误响应**:
```json
{
  "success": false,
  "message": "文章不存在"
}
```
HTTP状态码: 404

---

## 3. 评论系统接口

### 3.1 获取文章评论列表

**接口地址**: `GET /api/comments/articles/:id/comments`

**功能说明**: 获取指定文章的所有评论，按时间倒序排列

**请求参数**:
- `id`: 文章ID（路径参数）

**响应示例**:
```json
[
  {
    "id": 1,
    "nickname": "张三",
    "content": "这篇文章写得很好！",
    "time": "2025-10-06T10:30:00.000Z"
  },
  {
    "id": 2,
    "nickname": "李四",
    "content": "学到了很多，谢谢分享",
    "time": "2025-10-06T11:15:00.000Z"
  }
]
```

**字段说明**:
- `id`: 评论ID（整数）
- `nickname`: 评论者昵称（字符串）
- `content`: 评论内容（字符串）
- `time`: 评论时间（ISO 8601格式）

**错误响应**:
```json
{
  "success": false,
  "message": "文章不存在"
}
```
HTTP状态码: 404

---

### 3.2 发表评论

**接口地址**: `POST /api/comments/articles/:id/comments`

**功能说明**: 为指定文章发表新评论

**请求参数**:
- `id`: 文章ID（路径参数）

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```json
{
  "nickname": "王五",
  "content": "非常棒的文章，收藏了！"
}
```

**字段说明**:
- `nickname`: 评论者昵称（必填，字符串，最大50字符）
- `content`: 评论内容（必填，字符串）

**成功响应**:
```json
{
  "success": true,
  "data": {
    "id": 3,
    "nickname": "王五",
    "content": "非常棒的文章，收藏了！",
    "time": "2025-10-06T12:00:00.000Z"
  }
}
```
HTTP状态码: 201

**错误响应**:
```json
{
  "success": false,
  "message": "昵称和评论内容为必填项"
}
```
HTTP状态码: 400

或
```json
{
  "success": false,
  "message": "文章不存在"
}
```
HTTP状态码: 404

---

### 3.3 删除评论（管理员功能）

**接口地址**: `DELETE /api/comments/:id`

**功能说明**: 删除指定ID的评论

**请求参数**:
- `id`: 评论ID（路径参数）

**成功响应**:
```json
{
  "success": true,
  "message": "评论删除成功"
}
```
HTTP状态码: 200

**错误响应**:
```json
{
  "success": false,
  "message": "评论不存在"
}
```
HTTP状态码: 404

---

## 4. 文件上传接口

### 4.1 上传文件

**接口地址**: `POST /api/upload`

**功能说明**: 上传图片文件（头像、文章配图等）

**请求头**:
```
Content-Type: multipart/form-data
```

**请求参数**:
- `file`: 图片文件（表单字段名，支持格式：jpg, jpeg, png, gif, webp）

**文件限制**:
- 最大文件大小: 5MB
- 支持的文件类型: 图片文件（image/*）

**成功响应**:
```json
{
  "success": true,
  "data": {
    "url": "http://localhost:3000/uploads/file_1640995200000_123456789.jpg",
    "id": 1,
    "filename": "avatar.jpg",
    "size": 102400
  }
}
```
HTTP状态码: 200

**字段说明**:
- `url`: 文件访问URL（字符串）
- `id`: 文件记录ID（整数）
- `filename`: 原始文件名（字符串）
- `size`: 文件大小（字节，整数）

**错误响应**:
```json
{
  "success": false,
  "message": "请选择要上传的文件"
}
```
HTTP状态码: 400

或
```json
{
  "success": false,
  "message": "只允许上传图片文件"
}
```
HTTP状态码: 400

或
```json
{
  "success": false,
  "message": "文件大小超过限制"
}
```
HTTP状态码: 400

---

### 4.2 获取文件列表

**接口地址**: `GET /api/upload`

**功能说明**: 获取所有已上传的文件列表

**请求参数**: 无

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "original_name": "avatar.jpg",
      "file_type": "image/jpeg",
      "file_size": 102400,
      "created_at": "2025-10-06T10:00:00.000Z"
    }
  ]
}
```

---

### 4.3 删除文件（管理员功能）

**接口地址**: `DELETE /api/upload/:id`

**功能说明**: 删除指定ID的文件（同时删除物理文件和数据库记录）

**请求参数**:
- `id`: 文件ID（路径参数）

**成功响应**:
```json
{
  "success": true,
  "message": "文件删除成功"
}
```
HTTP状态码: 200

**错误响应**:
```json
{
  "success": false,
  "message": "文件不存在"
}
```
HTTP状态码: 404

---

## 5. 静态文件访问

### 5.1 访问上传的文件

**接口地址**: `GET /uploads/:filename`

**功能说明**: 通过URL直接访问已上传的文件

**示例**: 
- `http://localhost:3000/uploads/file_1640995200000_123456789.jpg`

---

## 6. 错误码说明

| HTTP状态码 | 说明 |
|-----------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 7. 响应格式

### 成功响应格式

**数据返回**（GET请求）:
```json
{
  "id": 1,
  "title": "文章标题",
  ...
}
```

或

```json
[
  { "id": 1, ... },
  { "id": 2, ... }
]
```

**操作成功**（POST/PUT/DELETE）:
```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

### 错误响应格式

```json
{
  "success": false,
  "message": "错误描述"
}
```

---

## 8. 使用示例

### 8.1 JavaScript Fetch 示例

#### 获取文章列表
```javascript
fetch('http://localhost:3000/api/articles')
  .then(response => response.json())
  .then(articles => {
    console.log('文章列表:', articles);
  });
```

#### 获取文章详情
```javascript
const articleId = 1;
fetch(`http://localhost:3000/api/articles/${articleId}`)
  .then(response => response.json())
  .then(article => {
    console.log('文章详情:', article);
  });
```

#### 创建文章
```javascript
fetch('http://localhost:3000/api/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: '新文章',
    content: '文章内容',
    summary: '摘要',
    date: '2025-01-10'
  })
})
  .then(response => response.json())
  .then(result => {
    console.log('创建结果:', result);
  });
```

#### 发表评论
```javascript
const articleId = 1;
fetch(`http://localhost:3000/api/comments/articles/${articleId}/comments`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nickname: '张三',
    content: '这篇文章真不错！'
  })
})
  .then(response => response.json())
  .then(result => {
    console.log('评论结果:', result);
  });
```

#### 上传文件
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:3000/api/upload', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(result => {
    console.log('上传结果:', result);
    console.log('文件URL:', result.data.url);
  });
```

---

## 9. 前端集成建议

### 9.1 修改前端代码

#### 更新 `myblog/index.js`
```javascript
// 替换现有的手动数组和fetch逻辑
async function loadArticles() {
  try {
    const response = await fetch('http://localhost:3000/api/articles');
    const articles = await response.json();
    
    // 渲染文章卡片
    articles.forEach(article => {
      makeCard(article.title, article.id, article.date, article.summary);
    });
  } catch (error) {
    console.error('加载文章失败:', error);
  }
}

function makeCard(title, articleId, date, summary) {
  const card = document.createElement('article');
  card.className = 'article-card';
  card.innerHTML = `
    <h3>${title}</h3>
    ${summary ? `<p class="article-summary">${summary}</p>` : ''}
    ${date ? `<span class="article-date">${date}</span>` : ''}
    <button class="btn-read" onclick="location.href='article.html?id=${articleId}'">阅读更多</button>
  `;
  articleList.appendChild(card);
}

window.addEventListener('DOMContentLoaded', loadArticles);
```

#### 更新 `myblog/article.js`
```javascript
// 获取文章内容
async function loadArticle(articleId) {
  try {
    const response = await fetch(`http://localhost:3000/api/articles/${articleId}`);
    const article = await response.json();
    
    document.getElementById('article-title').textContent = article.title;
    document.getElementById('article-content').innerHTML = marked.parse(article.content);
    Prism.highlightAll();
  } catch (error) {
    console.error('加载文章失败:', error);
  }
}

// 获取评论
async function loadComments(articleId) {
  try {
    const response = await fetch(`http://localhost:3000/api/comments/articles/${articleId}/comments`);
    const comments = await response.json();
    
    commentList.innerHTML = '';
    comments.forEach(comment => {
      renderComment(comment.nickname, comment.content, new Date(comment.time).toLocaleString());
    });
  } catch (error) {
    console.error('加载评论失败:', error);
  }
}

// 提交评论
async function addComment() {
  const nick = document.getElementById('nickname').value.trim();
  const txt = document.getElementById('commentText').value.trim();
  
  if (!nick || !txt) return false;
  
  try {
    const response = await fetch(`http://localhost:3000/api/comments/articles/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: nick, content: txt })
    });
    
    const result = await response.json();
    if (result.success) {
      renderComment(result.data.nickname, result.data.content, new Date(result.data.time).toLocaleString());
      commentForm.reset();
    }
  } catch (error) {
    console.error('提交评论失败:', error);
  }
  
  return false;
}

const params = new URLSearchParams(window.location.search);
const articleId = params.get('id');

if (articleId) {
  loadArticle(articleId);
  loadComments(articleId);
}
```

---

## 10. 注意事项

1. **跨域问题**: 后端已配置CORS，允许跨域请求
2. **文件上传**: 最大文件大小为5MB，仅支持图片格式
3. **日期格式**: 统一使用 `YYYY-MM-DD` 格式
4. **时间格式**: 使用ISO 8601格式（如：`2025-10-06T10:30:00.000Z`）
5. **Markdown支持**: 文章内容支持Markdown格式，前端需使用marked.js渲染
6. **管理员功能**: 当前版本未实现权限验证，实际使用时需要添加认证机制

---

## 11. 测试工具

项目包含完整的测试脚本 `test-api.js`，可以使用以下命令运行测试：

```bash
node test-api.js
```

测试覆盖所有API接口，包括：
- ✅ 健康检查
- ✅ 文章列表、详情、创建、更新、删除
- ✅ 评论列表、创建、删除
- ✅ 文件上传接口
- ✅ 错误处理验证

