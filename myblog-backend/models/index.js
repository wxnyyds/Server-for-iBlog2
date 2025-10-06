const { sequelize, testConnection } = require('../config/database');
const Article = require('./Article');
const Comment = require('./Comment');
const File = require('./File');

// 定义模型关联
Article.hasMany(Comment, { foreignKey: 'article_id', as: 'comments' });
Comment.belongsTo(Article, { foreignKey: 'article_id', as: 'article' });

// 同步数据库
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ 数据库表同步成功');
  } catch (error) {
    console.error('❌ 数据库表同步失败:', error.message);
  }
};

module.exports = {
  sequelize,
  testConnection,
  Article,
  Comment,
  File,
  syncDatabase
};
