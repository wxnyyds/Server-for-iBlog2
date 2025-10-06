const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  article_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '关联文章ID',
    references: {
      model: 'articles',
      key: 'id'
    }
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '评论者昵称'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '评论内容'
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '评论时间'
  }
}, {
  tableName: 'comments',
  timestamps: false,
  indexes: [
    {
      fields: ['article_id']
    }
  ]
});

module.exports = Comment;
