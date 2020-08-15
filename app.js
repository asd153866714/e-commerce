const U = require('./models/user')
const P = require('./models/product')
const C = require('./models/cart')

const shopRoutes = require('./routes/shop')
const userRoutes = require('./routes/user')

const Koa = require('koa')
const app = module.exports = new Koa()

const serve = require('koa-static')
const session = require('koa-session')
const koaLogger = require('koa-logger')
const koaBody = require('koa-body')
const views = require('koa-views')

app.use(views('views', { map: { html: 'ejs' } })) // 使用 ejs midleware(模板引擎) **要放在router啟動之前**
app.use(koaLogger())
app.use(koaBody())

app.keys = ['*@&))9kdjafda;983']
const CONFIG = {
  key: 'd**@&(_034k3q3&@^(!$!',
  maxAge: 86400000
}
app.use(session(CONFIG, app))               // session 要放在 router 前面
app.use(serve(__dirname + '/public'))

app.use(userRoutes.routes())
app.use(shopRoutes.routes())

async function main() {
  await U.open()
  await P.open()
  await C.open()
  app.listen(3000, '0.0.0.0')
  console.log("server run at http://localhost:3000")
}

if (!module.parent) {
  try {
    main()
  } catch (error) {
    console.log(error)
  }
}