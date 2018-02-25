var config = {
  "title": "",
  //默认dev环境
  "env": 'dev',//development,test,production
  //监听端口号配置
  "port": 8801,

  "redis": {
    host: '127.0.0.1',
    'port': 6379,
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: '',
    db: 0
  },
  "read_mysql": {
    host: '',
    user: '',
    password: '',
    database: '',
    minConnection: 1,
    maxConnection: 10
  },
  "write_mysql": {
    host: '',
    user: '',
    password: '',
    database: '',
    minConnection: 1,
    maxConnection: 10
  },
}

module.exports = config