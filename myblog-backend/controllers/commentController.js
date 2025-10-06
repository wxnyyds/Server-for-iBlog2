const { Comment, Article } = require('../models');

// 获取文章评论
const getCommentsByArticleId = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 检查文章是否存在
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    const comments = await Comment.findAll({
      where: { article_id: id },
      attributes: ['id', 'nickname', 'content', 'time'],
      order: [['time', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// 创建评论
const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nickname, content } = req.body;

    // 验证必填字段
    if (!nickname || !content) {
      return res.status(400).json({
        success: false,
        message: '昵称和评论内容为必填项'
      });
    }

    // 检查文章是否存在
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    const comment = await Comment.create({
      article_id: id,
      nickname,
      content
    });

    res.status(201).json({
      success: true,
      data: {
        id: comment.id,
        nickname: comment.nickname,
        content: comment.content,
        time: comment.time
      }
    });
  } catch (error) {
    next(error);
  }
};

// 删除评论
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    await comment.destroy();

    res.json({
      success: true,
      message: '评论删除成功'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentsByArticleId,
  createComment,
  deleteComment
};
