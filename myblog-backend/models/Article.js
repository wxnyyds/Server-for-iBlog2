const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '文章标题'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '文章内容(Markdown格式)'
  },
  summary: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '文章摘要'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: '文章日期'
  }
}, {
  tableName: 'articles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['date']
    }
  ]
});

module.exports = Article;
