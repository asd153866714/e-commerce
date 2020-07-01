const U = require('../models/user')
const P = require('../models/pDetail')
const C = require('../models/cart')
const KoaRouter = require("koa-router")
const router = new KoaRouter

router
.get('/', async (ctx) => {
    ctx.session.error_l = undefined
    ctx.session.error_r = undefined
    
    let userid = ctx.session.userID
    let data = await P.find()
    let p_data = []

    await data.forEach(element => {
        p_data.push(element)
    });

    await ctx.render('index',{
        userid, p_data
    })
})

.get('/signup', async (ctx) => {
    console.log(ctx.request.querystring)
    let message = ctx.session.error_r
    await ctx.render('user/signup',{
        message
    })
})

.post('/signup', signup)

.get('/login', async (ctx) => {
    let message = ctx.session.error_l
    await ctx.render('user/login',{
        message
    })
})

.post('/login', login)

.get('/logout', logout)

.get('/cart', loadCart)

.get('/product', pDetails)

.post('/addItemToCart', addItemToCart)

.post('/updateProductAmount', updateProductAmount)

.post('/removeCartItem', removeCartItem)

.get('/userDetails', userDetails)

.post('/updateUser', updataUserDetails)

.get('/userDetails/password', userPassword)

.post('/userDetails/updatePassword', updatePassword)

.get('/address', loadAddress)

.get('/order', loadOrder)

async function signup(ctx){
    const userData = ctx.request.body // 取得頁面的資料 (帳號，密碼)
    console.log(userData,"\n")
    let data = await U.get(userData.id)
    console.log(userData.id,"\n")
    if (userData.id && userData.password != "" ){

        if (data == null){ // 確認帳號是否重複
            await U.add(userData)
            ctx.redirect('/')
        }
        else {
            ctx.session.error_r = "帳號已被使用"
            ctx.redirect('/signup')
        }
    }
    else {
        ctx.session.error_r = "帳號或密碼不能為空白"
        ctx.redirect('/signup')
    }
}  

async function login(ctx){
    let {id, password} = ctx.request.body
    console.log(ctx.request.body,"\n")
    let find_login =  await U.get(id)

    if (id && password != ""){
        if (find_login != null){ // 確認使用者資料是否存在
            if (find_login.password == password){ // 確認密碼
                ctx.session.userID = id
                ctx.session.error_l = undefined
                ctx.redirect('/')
            }           
            else {
                ctx.session.error_l = "密碼錯誤"
                ctx.redirect('/login')
            }
        }
        else {
            ctx.session.error_l = "用戶不存在"
            ctx.redirect('/login')
        }
    }
    else {
        ctx.session.error_l = "帳號或密碼不可為空白"
        ctx.redirect('/login')
    }
}

async function logout(ctx){
    ctx.session.userID = undefined // 清除 session 紀錄的登入資料
    ctx.redirect('/')
}

async function pDetails(ctx){
    let pid = await ctx.query.pid
    console.log(pid,typeof(pid))

    if (pid){
        let find_p = await P.get(pid)

        let product = find_p
        let userid = ctx.session.userID
        await ctx.render('product/product',{
            product, userid
        })
    }
    else {
        ctx.redirect("/")
    }

}

async function addItemToCart(ctx){
    console.log(ctx.request.body, typeof(ctx.request.body))
    let userid = ctx.session.userID

    if(userid != undefined){
        console.log("login-check")
        let p_data = ctx.request.body       
        let find_user = await C.getProduct(userid, p_data)

        if(find_user != null){ 
            await C.addAmount(userid, p_data)        // 更新商品數量
        }
        else{
            await C.addItem(userid, p_data)             // 新增一筆資料
        }
    }
    else{
        console.log('no login')
    }

    console.log('add success!')
    ctx.body = null
}

async function loadCart(ctx){
    let userid = ctx.session.userID
    if (userid) {
        let data = await C.getCart(userid)
        let c_data = []
    
        await data.forEach(element => {
            c_data.push(element)
        });
        console.log(c_data)
    
        await ctx.render('product/cart',{ 
            userid, c_data
        })
    } else {
        ctx.body = 
        `
        <script>
            alert('請先登入')
            location.href = '/login'
        </script>
        `
    }
}

async function updateProductAmount(ctx) {
    let userid = ctx.session.userID
    let p_data = JSON.parse(ctx.request.body)
    console.log('ajax test')
    await C.updateAmount(userid, p_data.name, p_data.amount)
    ctx.response.body = "Sever response"    
}

async function removeCartItem(ctx) {
    let userid = ctx.session.userID
    let p_data = JSON.parse(ctx.request.body)
    console.log(p_data)
    await C.remove(userid, p_data.name)
    console.log("remove success")
    ctx.response.body = "hello world" // 要傳回 response 否則 Client 會 not found
}

async function userDetails(ctx) {
    ctx.session.error_p = undefined
    let userid = ctx.session.userID
    let data = await U.get(userid)
    let u_data = []
    await u_data.push(data)

    await ctx.render('user/userDetails',{
        userid, u_data
    })
}

async function updataUserDetails(ctx) {
    let u_data = ctx.request.body
    await U.updateDetails(u_data)
    console.log('updateUser\n')
    ctx.redirect('/userDetails')
}

async function userPassword(ctx) {
    let userid = ctx.session.userID
    let message = ctx.session.error_p
    await ctx.render('user/password',{
        userid, message
    })
}

async function updatePassword(ctx) {
    let userid =ctx.session.userID
    let u_data = ctx.request.body
    console.log(u_data)
    let DBpassword = await U.get(userid)
    let old_password = DBpassword.password
    console.log(u_data.old, old_password)
    if (u_data.old == old_password){
        let new_password = await U.updatePassword(userid, u_data.new)
        console.log("update password %s !\n",new_password)
        ctx.redirect('/userDetails')
    }
    else {
        ctx.session.error_p = "密碼錯誤"
        ctx.redirect('/userDetails/password')
    }
}

async function loadAddress(ctx) {
    let userid = ctx.session.userID

    await ctx.render('user/address',{
        userid
    })
}

async function loadOrder(ctx) {
    let userid = ctx.session.userID

    await ctx.render('user/order',{
        userid
    })
}

module.exports = router