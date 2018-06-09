module.exports = async function (ctx, next) {
    let method = ctx.method
    switch (method) {
        case 'GET':
            ctx.input = ctx.query
            break
        case 'PUT':
        case 'POST':
            ctx.input = ctx.request.body
            break
        default:
            ctx.input = {}
            break
    }


    if (!!ctx.header.bundle_id === false) ctx.header.bundle_id = ''
    if (!!ctx.header.device === false) ctx.header.device = ''
    if (!!ctx.header.version === false) ctx.header.version = ''

    ctx.type = 'application/json; charset=utf-8'

    await next()
}


