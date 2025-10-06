const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../middleware/upload');
const { uploadFile, getFiles, deleteFile } = require('../controllers/uploadController');

// 上传文件
router.post('/', upload, handleUploadError, uploadFile);

// 获取文件列表
router.get('/', getFiles);

// 删除文件
router.delete('/:id', deleteFile);

module.exports = router;
