const Koa = require('koa')
const app = new Koa()
const server = require('http').createServer(app.callback())
const io = require('socket.io').listen(server)

console.log('here')

const users = {} // 存储在线用户列表的对象

// io.on('connection', function (socket) {
//     socket.emit('news', { hello: 'world' })
//     socket.on('my other event', function (data) {
//         console.log(data)
//     })
//     socket.emit('news', { hello: 'very good2' })
// })

io.sockets.on('connection', function (socket) {

    //有人上线
    socket.on('online', function (data) {
        console.log('online data: ', data)
        //将上线的用户名存储为 socket 对象的属性，以区分每个 socket 对象，方便后面使用
        socket.name = data.user
        //users 对象中不存在该用户名则插入该用户名
        if (!users[data.user]) {
            users[data.user] = data.user
        }
        //向所有用户广播该用户上线信息
        io.sockets.emit('online', { users: users, user: data.user })
    })

    //有人发话
    socket.on('say', function (data) {
        console.log('say data: ', data)
        if (data.to == 'all') {
            //向其他所有用户广播该用户发话信息
            socket.broadcast.emit('say', data)
        } else {
            //向特定用户发送该用户发话信息
            //clients 为存储所有连接对象的数组
            var clients = io.sockets.clients()
            console.log('-- clients info: ---', clients)
            //遍历找到该用户
            clients.forEach(function (client) {
                if (client.name == data.to) {
                    //触发该用户客户端的 say 事件
                    client.emit('say', data)
                }
            })
        }
    })

    //有人下线
    socket.on('disconnect', function () {
        console.log(socket.name + ' is disconnect')
        //若 users 对象中保存了该用户名
        if (users[socket.name]) {
            //从 users 对象中删除该用户名
            delete users[socket.name]
            console.log('still online: ', users)
            //向其他所有用户广播该用户下线信息
            socket.broadcast.emit('offline', { users: users, user: socket.name })
        }
    })
})

server.listen(3000, function () {
    console.log('socket server listening on port 3000')
})