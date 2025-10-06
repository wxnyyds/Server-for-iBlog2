const { Article } = require('../models');

// 获取文章列表
const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.findAll({
      attributes: ['id', 'title', 'date', 'summary'],
      order: [['date', 'DESC']]
    });

    res.json(articles);
  } catch (error) {
    next(error);
  }
};

// 获取单篇文章
const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id, {
      attributes: ['id', 'title', 'content', 'date']
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    res.json(article);
  } catch (error) {
    next(error);
  }
};

// 创建文章
const createArticle = async (req, res, next) => {
  try {
    const { title, content, summary, date } = req.body;

    // 验证必填字段
    if (!title || !content || !date) {
      return res.status(400).json({
        success: false,
        message: '标题、内容和日期为必填项'
      });
    }

    const article = await Article.create({
      title,
      content,
      summary,
      date
    });

    res.status(201).json({
      success: true,
      data: {
        id: article.id,
        title: article.title,
        date: article.date
      }
    });
  } catch (error) {
    next(error);
  }
};

// 更新文章
const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, summary, date } = req.body;

    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    await article.update({
      title: title || article.title,
      content: content || article.content,
      summary: summary || article.summary,
      date: date || article.date
    });

    res.json({
      success: true,
      message: '文章更新成功'
    });
  } catch (error) {
    next(error);
  }
};

// 删除文章
const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    await article.destroy();

    res.json({
      success: true,
      message: '文章删除成功'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
