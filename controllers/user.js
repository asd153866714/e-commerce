const U = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getSignup = async (ctx) => {
    await ctx.render('user/signup',{
        message: ctx.session.error_r
    })
}

exports.postSignup = async (ctx) => {
    const userData = ctx.request.body   // 取得頁面的資料 (帳號，密碼)
    console.log(userData, "\n")

    if (userData.id && userData.password != "") {
        let data = await U.get(userData.id)
        if (data == null) {             // 確認帳號是否重複
            const salt = bcrypt.genSaltSync()
            userData.password = bcrypt.hashSync(userData.password, salt)
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

exports.getLogin = async (ctx) => {
    await ctx.render('user/login', {
        message: ctx.session.error_l
    })
}

exports.postLogin = async (ctx) => {
    let { id, password } = ctx.request.body
    console.log(ctx.request.body, "\n")
    let find_login = await U.get(id)

    if (id && password != "") {
        if (find_login != null) { // 確認使用者資料是否存在
            if (bcrypt.compareSync(password, find_login.password)) { // 確認密碼
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

exports.getLogout = async (ctx) => {
    ctx.session.userID = undefined
    ctx.redirect('/')
}

exports.getUserDetails = async (ctx) => {
    ctx.session.error_p = undefined
    let data = await U.get(ctx.session.userID)
    await ctx.render('user/userDetails', {
        userid: ctx.session.userID,
        u_data: data
    })
}

exports.postUpdateUserDetails = async (ctx) => {
    let u_data = ctx.request.body
    await U.updateDetails(u_data)
    console.log('updateUser\n')
    ctx.redirect('/userDetails')
}

exports.getPassword = async (ctx) => {
    await ctx.render('user/password', {
        userid: ctx.session.userID,
        message: ctx.session.error_p
    })
}

exports.postUpdatePassword = async (ctx) => {
    let userid = ctx.session.userID
    let u_data = ctx.request.body
    console.log(u_data)
    let old_password = (await U.get(userid)).password
    console.log(u_data.old, old_password)
    if (bcrypt.compareSync(u_data.old, old_password)) {
        let new_password = await U.updatePassword(userid,bcrypt.hashSync(u_data.new))
        console.log("update password %s !\n", new_password)
        ctx.redirect('/userDetails')
    }
    else {
        ctx.session.error_p = "密碼錯誤"
        ctx.redirect('/userDetails/password')
    }
}

exports.getAddress = async (ctx) => {
    await ctx.render('user/address', {
        userid: ctx.session.userID
    })
}