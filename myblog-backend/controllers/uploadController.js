const { File } = require('../models');
const path = require('path');
require('dotenv').config({ path: './config.env' });

// 上传文件
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的文件'
      });
    }

    const { filename, originalname, path: filePath, mimetype, size } = req.file;

    // 保存文件信息到数据库
    const fileRecord = await File.create({
      filename,
      original_name: originalname,
      file_path: filePath,
      file_type: mimetype,
      file_size: size
    });

    // 生成访问URL
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const fileUrl = `${baseUrl}/uploads/${filename}`;

    res.json({
      success: true,
      data: {
        url: fileUrl,
        id: fileRecord.id,
        filename: originalname,
        size: size
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取文件列表
const getFiles = async (req, res, next) => {
  try {
    const files = await File.findAll({
      attributes: ['id', 'original_name', 'file_type', 'file_size', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    next(error);
  }
};

// 删除文件
const deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    // 删除物理文件
    const fs = require('fs');
    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    // 删除数据库记录
    await file.destroy();

    res.json({
      success: true,
      message: '文件删除成功'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
  getFiles,
  deleteFile
};
