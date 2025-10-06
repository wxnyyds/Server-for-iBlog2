const express = require('express');
const router = express.Router();
const {
  getCommentsByArticleId,
  createComment,
  deleteComment
} = require('../controllers/commentController');

// 获取文章评论
router.get('/articles/:id/comments', getCommentsByArticleId);

// 创建评论
router.post('/articles/:id/comments', createComment);

// 删除评论 (管理员功能)
router.delete('/:id', deleteComment);

module.exports = router;
