module.exports = (ctx, next) => {
    if (ctx.session.userID === undefined) {
        return ctx.body = `
        <script>
            alert('請先登入')
            location.href = '/login'
        </script>`
        
        // ctx.redirect('/login')
    }
    return next()
}