var log4js = require('log4js')
log4js.configure({
    appenders: {
        //错误日志
        error: {
            type: 'file',
            filename: 'logs/error.log',
            maxLogSize: 1000 * 1000 * 10,
            backups: 5
        },
        //系统日志
        system: {
            type: 'dateFile',
            filename: 'logs/sys.log',
            pattern: '.yyyy-MM-dd',
            compress: true,
            layout: { type: 'basic' }
        },
        //应用日志
        stats: {
            type: 'dateFile',
            filename: 'logs/stats.log',
            pattern: '.yyyy-MM-dd',
            compress: true,
            layout: { type: 'basic' }
        },
        exception: {
            type: 'dateFile',
            filename: 'logs/exception.log',
            pattern: '.yyyy-MM-dd',
            compress: true,
            layout: { type: 'basic' }
        },
    },
    categories: {
        error: { appenders: ['error', 'stats'], level: 'ALL' },
        system: { appenders: ['system', 'stats'], level: 'ALL' },
        default: { appenders: ['stats', 'exception'], level: 'ALL' }
    },
    pm2: true,
    disableClustering: true
})

module.exports = log4js