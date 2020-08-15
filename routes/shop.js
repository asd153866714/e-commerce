const shopControllers = require('../controllers/shop')
const isAuth = require('../middlewares/auth')
const KoaRouter = require("koa-router")
const router = new KoaRouter()

router
    .get('/', shopControllers.getIndex)

    .get('/cart', isAuth, shopControllers.getCart)

    .get('/product', shopControllers.getProduct)

    .post('/addItemToCart', isAuth, shopControllers.postCartAddProduct)

    .post('/updateProductAmount', isAuth, shopControllers.postCartUpdateProductAmount)

    .post('/removeCartItem', isAuth, shopControllers.postCartRemoveProduct)

    .get('/order', isAuth, shopControllers.getOrders)

module.exports = router