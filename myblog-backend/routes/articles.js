const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');

// 获取文章列表
router.get('/', getArticles);

// 获取单篇文章
router.get('/:id', getArticleById);

// 创建文章 (管理员功能)
router.post('/', createArticle);

// 更新文章 (管理员功能)
router.put('/:id', updateArticle);

// 删除文章 (管理员功能)
router.delete('/:id', deleteArticle);

module.exports = router;
