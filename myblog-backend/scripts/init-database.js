const mysql = require('mysql2/promise');
require('dotenv').config({ path: './config.env' });

const initDatabase = async () => {
  let connection;
  
  try {
    // 连接到MySQL服务器（不指定数据库）
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('✅ 连接到MySQL服务器成功');

    // 创建数据库
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ 数据库 ${process.env.DB_NAME} 创建成功`);

    // 使用数据库
    await connection.query(`USE \`${process.env.DB_NAME}\``);

    // 创建文章表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        summary VARCHAR(500),
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_date (date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ 文章表创建成功');

    // 创建评论表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        article_id INT NOT NULL,
        nickname VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_article_id (article_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ 评论表创建成功');

    // 创建文件表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS files (
        id INT PRIMARY KEY AUTO_INCREMENT,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        file_size INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ 文件表创建成功');

    // 插入示例文章数据
    const sampleArticles = [
      {
        title: '网站介绍',
        content: '这是我的个人博客主页，会不定期在这里发布内容。我会在这里分享我的生活，想法或者一些学习笔记，欢迎大家访问！',
        summary: '这是我的个人博客主页，会不定期在这里发布内容...',
        date: '2025-09-25'
      },
      {
        title: '马龙乒乓球传奇',
        content: `在乒乓球运动的历史长河中，马龙的名字如同一座巍峨的丰碑，镌刻着荣耀、突破与坚守。这位被国际乒联认证为 "历史最佳球员"（GOAT）的传奇选手，用 23 年的职业生涯书写了一段跨越时代的乒乓史诗，将 "为国争光" 的信念与极致的运动精神熔铸为永恒的印记。

### 命运转折：从 "鞍山小马" 到京城新星

1988 年出生的马龙，年少时便展露了对乒乓球的过人天赋，却在 13 岁时遭遇职业生涯的首个低谷 —— 因成长瓶颈面临被辽宁省队淘汰的危机。命运的转机出现在北京西城体校教练关华安的慧眼识珠，这位教练看中了马龙身上的韧劲与潜力，邀请他前往北京深造。"那是我人生最重要的选择"，多年后马龙回忆道。在父母的支持下，他毅然北上，进入了拥有张怡宁等名将的北京乒乓球队，在张雷等教练的悉心培养下迅速成长。

2003 年，15 岁的马龙凭借惊人的进步入选国家队，正式踏上国乒征程。2004 年全国锦标赛上，16 岁的他初生牛犊不怕虎，在个人赛中接连击败刘国正、王皓等名将，虽最终不敌王励勤获得亚军，却让整个乒坛看到了这颗新星的光芒。此时的马龙，已从 "鞍山小马" 蜕变为能与顶尖高手抗衡的京城新锐。`,
        summary: '在乒乓球运动的历史长河中，马龙的名字如同一座巍峨的丰碑...',
        date: '2025-09-26'
      },
      {
        title: '拉梅洛鲍尔引擎',
        content: `当特雷・曼恩在专访中直言拉梅洛・鲍尔是 "球队的发动机，NBA 最优秀的控球后卫之一" 时，这位 24 岁的年轻后卫已经用近五个赛季的成长，回应了从选秀前就伴随左右的质疑。从澳洲 NBL 的历练到夏洛特黄蜂的核心，从最佳新秀到全明星候选，拉梅洛的篮球之路始终以 "打破偏见" 为注脚，在天赋与争议的交织中不断重塑自我。

拉梅洛的崛起从未遵循传统轨迹。在登陆 NBA 之前，他没有选择美国大学篮球体系，而是远赴澳洲 NBL 联赛打磨技艺，在那里用惊艳表现坐稳球队核心，为日后的职业征程埋下伏笔。2020 年选秀大会上，黄蜂以首轮第 3 顺位将他招致麾下，这个决定在当时引发不少讨论 —— 质疑者认为他球风过于随性，养成难度极高，甚至可能沦为 "水货"。但新秀赛季便交出的 15.7 分、5.9 篮板、6.1 助攻的数据单，以及力压爱德华兹、哈利伯顿当选年度最佳新秀的荣誉，让所有质疑声暂时平息。`,
        summary: '当特雷・曼恩在专访中直言拉梅洛・鲍尔是 "球队的发动机"...',
        date: '2025-09-27'
      }
    ];

    for (const article of sampleArticles) {
      await connection.query(
        'INSERT IGNORE INTO articles (title, content, summary, date) VALUES (?, ?, ?, ?)',
        [article.title, article.content, article.summary, article.date]
      );
    }
    console.log('✅ 示例文章数据插入成功');

    console.log('\n🎉 数据库初始化完成！');
    console.log('📊 数据库信息:');
    console.log(`   - 数据库名: ${process.env.DB_NAME}`);
    console.log(`   - 主机: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`   - 用户: ${process.env.DB_USER}`);
    console.log('\n📝 已创建的表:');
    console.log('   - articles (文章表)');
    console.log('   - comments (评论表)');
    console.log('   - files (文件表)');
    console.log('\n📚 示例数据:');
    console.log('   - 3篇示例文章');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// 运行初始化
initDatabase();
