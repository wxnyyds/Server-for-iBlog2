const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '存储文件名'
  },
  original_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '原始文件名'
  },
  file_path: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: '文件存储路径'
  },
  file_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '文件类型'
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '文件大小(字节)'
  }
}, {
  tableName: 'files',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = File;
