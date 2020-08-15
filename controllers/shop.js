const P = require('../models/product')
const C = require('../models/cart')

exports.getIndex = async (ctx) => {
    ctx.session.error_l = undefined
    ctx.session.error_r = undefined

    let data = await P.find()
    let p_data = []

    await data.forEach(element => {
        p_data.push(element)
    })
    await ctx.render('index', {
        userid: ctx.session.userID, 
        p_data
    })
}

exports.getCart = async (ctx) => {
    let data = await C.getCart(ctx.session.userID)
    let c_data = []

    await data.forEach(element => {
        c_data.push(element)
    });
    console.log(c_data)

    await ctx.render('product/cart.html', {
        userid: ctx.session.userID,
        c_data
    })
}

exports.getProduct = async (ctx) => {
    let pid = await ctx.query.pid

    if (pid) {
        let find_p = await P.get(pid)
        
        await ctx.render('product/product', {
            product: find_p,
            userid: ctx.session.userID
        })
    }
    else {
        ctx.redirect("/")
    }
}

exports.postCartAddProduct = async (ctx) => {
    console.log(ctx.request.body, typeof (ctx.request.body))
    let userid = ctx.session.userID

    let p_data = ctx.request.body
    let find_user = await C.getProduct(userid, p_data)

    if (find_user != null) {
        await C.addAmount(userid, p_data)        // 更新商品數量
    }
    else {
        await C.addItem(userid, p_data)          // 新增一筆資料
    }
    ctx.body = null
}

exports.postCartUpdateProductAmount = async (ctx) => {
    let userid = ctx.session.userID
    let p_data = JSON.parse(ctx.request.body)
    console.log('ajax test')
    await C.updateAmount(userid, p_data.name, p_data.amount)
    ctx.response.body = "Sever response"
}

exports.postCartRemoveProduct = async (ctx) => {
    let userid = ctx.session.userID
    let p_data = JSON.parse(ctx.request.body)
    console.log(p_data)
    await C.remove(userid, p_data.name)
    console.log("remove success")
    ctx.response.body = "hello world"           // 要傳回 response 否則 Client 會 not found
}

exports.getOrders = async (ctx) => {
    await ctx.render('user/order', {
        userid: ctx.session.userID
    })
}