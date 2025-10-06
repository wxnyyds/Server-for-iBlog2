// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('错误详情:', err);

  // Sequelize验证错误
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => e.message);
    return res.status(400).json({
      success: false,
      message: '数据验证失败',
      errors: errors
    });
  }

  // Sequelize唯一约束错误
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: '数据已存在'
    });
  }

  // Sequelize外键约束错误
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: '关联数据不存在'
    });
  }

  // 默认错误
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
};

// 404处理中间件
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `接口 ${req.originalUrl} 不存在`
  });
};

module.exports = {
  errorHandler,
  notFound
};
