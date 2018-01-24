var config = {
    "title":"",
    //默认dev环境
    "env": 'dev',//development,test,production
    //监听端口号配置
    "port": 4002,
  
    "redis": {
      host: '127.0.0.1',
      'port': 6379
    },
    "read_mysql":{
        host: '',
        user: '',
        password: '',
        database: '',
        connectionLimit: 3
    },
    "write_mysql":{
      host: '',
      user: '',
      password: '',
      database: '',
      connectionLimit: 3
    },
  }
  
  module.exports = config