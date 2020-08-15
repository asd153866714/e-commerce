const userController = require('../controllers/user')
const isAuth = require('../middlewares/auth')
const KoaRouter = require("koa-router")
const router = new KoaRouter()

router
    .get('/signup', userController.getSignup)

    .post('/signup', userController.postSignup)

    .get('/login', userController.getLogin)

    .post('/login', userController.postLogin)

    .get('/logout', userController.getLogout)

    .get('/userDetails', isAuth, userController.getUserDetails)

    .post('/updateUser', isAuth, userController.postUpdateUserDetails)

    .get('/userDetails/password', isAuth, userController.getPassword)

    .post('/userDetails/updatePassword', userController.postUpdatePassword)

    .get('/address', isAuth, userController.getAddress)

module.exports = router